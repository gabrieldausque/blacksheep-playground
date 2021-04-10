import { ExportMetadata, globalInstancesFactory } from "@hermes/composition";
import {Entity} from "../Entity";

export interface BehaviorContract {
    contractType:string;
    contractName:string;
    reactOn:string[];
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
        return globalInstancesFactory.getInstanceFromCatalogs(
            deserializedContract.contractType,
            deserializedContract.contractName, deserializedContract.reactOn) as Behavior;
    }

    contractType:string;
    contractName:string;
    reactOn:string[];

    protected constructor(metadata:ExportMetadata, reactOn:string[] = []) {
        this.contractType = metadata.contractType;
        this.contractName = metadata.contractName;
        this.reactOn = reactOn

    }

    abstract execute(owner:Entity):Promise<void>

    async react(eventName:string, owner:Entity, ...args:any){
        if(typeof this[`on_${eventName}`] === 'function'){
            await this[`on_${eventName}`](owner, ...args);
        }
    }

    [prop:string] : any;
}