import { ExportMetadata, globalInstancesFactory } from "@hermes/composition";
import {Entity} from "../Entity";

export interface EventDescriptor {
    eventName:string;
    isGlobal:boolean;
}

export interface BehaviorContract {
    contractType:string;
    contractName:string;
    reactOn:EventDescriptor[];
    [propName:string] : any;

}

export abstract class Behavior implements BehaviorContract {

    serialize():BehaviorContract {
        return {...this};
    }

    static deserialize(serializedBehavior:string|BehaviorContract):Behavior{
        const deserializedContract:BehaviorContract = (typeof serializedBehavior === 'string')?
            JSON.parse(serializedBehavior) as BehaviorContract:
            serializedBehavior;
        deserializedContract.contractType = deserializedContract.contractType?
            deserializedContract.contractType:
            'Behavior';
        const behavior = globalInstancesFactory.getInstanceFromCatalogs(
            deserializedContract.contractType,
            deserializedContract.contractName, deserializedContract.reactOn) as Behavior;
        for(const propName in deserializedContract) {
            if(behavior.hasOwnProperty(propName)) {
                behavior[propName] = deserializedContract[propName];
            }
        }
        behavior.initAfterDeserialize();
        return behavior;
    }

    contractType:string;
    contractName:string;
    reactOn:EventDescriptor[];
    notUnique:boolean;

    protected constructor(metadata:ExportMetadata, reactOn:EventDescriptor[] = []) {
        this.contractType = metadata.contractType;
        this.contractName = metadata.contractName;
        this.reactOn = reactOn
        this.notUnique = false;
    }

    abstract execute(owner:Entity):Promise<void>

    async react(eventName:string, owner:Entity, ...args:any){
        try{
            if(typeof this[`on_${eventName}`] === 'function'){
                await this[`on_${eventName}`](owner, ...args);
            }
            if(typeof this['on_all'] === 'function') {
                await this['on_all'](owner, ...args)
            }
        } catch(exception) {
            console.error(exception);
        }
    }

    initAfterDeserialize() {
        //Doing nothing, to override in derived class
    }

    [prop:string] : any;
}