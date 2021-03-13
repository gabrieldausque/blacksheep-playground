import {globalInstancesFactory, ExportMetadata} from '@hermes/composition';
import {serialize} from "v8";

export interface EntityComponentContract {
    contractType:string;
    contractName:string;
    [otherPropName:string] : any
}

export abstract class EntityComponent implements EntityComponentContract {

    serialize():string {
        return JSON.stringify(this);
    }

    static deserialize(serializedComponent:string | EntityComponentContract):EntityComponent{
        const deserializeObject:EntityComponentContract = (typeof serializedComponent === 'string')?
            JSON.parse(serializedComponent) as EntityComponentContract:
            serializedComponent;
        const concreteComponent:EntityComponent = globalInstancesFactory.getInstanceFromCatalogs(
            deserializeObject.contractType,
            deserializeObject.contractName
        );
        for(const propName in deserializeObject){
            if(concreteComponent.hasOwnProperty(propName) &&
                typeof deserializeObject[propName] !== 'function') {
                concreteComponent[propName] = deserializeObject[propName];
            }
        }
        return concreteComponent;
    }

    contractType:string;
    contractName:string;
    [otherPropName:string] : any;

    protected constructor(metadata:ExportMetadata) {
        this.contractType = metadata.contractType;
        this.contractName = metadata.contractName;
    }
}