import { ExportMetadata, globalInstancesFactory } from "@hermes/composition";
import {Entity} from "../Entity";

export interface BehaviorContract {
    contractType:string;
    contractName:string;
}

export abstract class Behavior implements BehaviorContract {

    serialize():string {
        return JSON.stringify(this);
    }

    static deserialize(serializedBehavior:string|BehaviorContract):Behavior{
        const deserializedContract:BehaviorContract = (typeof serializedBehavior === 'string')?
            JSON.parse(serializedBehavior) as BehaviorContract:
            serializedBehavior;
        return globalInstancesFactory.getInstanceFromCatalogs(
            deserializedContract.contractType,
            deserializedContract.contractName) as Behavior;
    }

    contractType:string;
    contractName:string;
    subscribedEvents:string[];

    protected constructor(metadata:ExportMetadata) {
        this.contractType = metadata.contractType;
        this.contractName = metadata.contractName;
        this.subscribedEvents = [];
    }

    abstract execute(owner:Entity):Promise<void>

}