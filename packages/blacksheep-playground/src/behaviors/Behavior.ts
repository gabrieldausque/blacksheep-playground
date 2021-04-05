import { ExportMetadata, globalInstancesFactory } from "@hermes/composition";
import {Entity} from "../Entity";

export interface BehaviorContract {
    contractType:string;
    contractName:string;
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
            deserializedContract.contractName) as Behavior;
    }

    contractType:string;
    contractName:string;

    protected constructor(metadata:ExportMetadata) {
        this.contractType = metadata.contractType;
        this.contractName = metadata.contractName;
    }

    abstract execute(owner:Entity):Promise<void>

}