import * as events from "events";
import {EntityComponent, EntityComponentContract} from "./components/EntityComponent";
import {Behavior, BehaviorContract} from "./behaviors/Behavior";
import {v4 as uuid} from 'uuid';

export interface SerializedEntityContract {
    components:Array<EntityComponentContract>,
    behaviors:Array<BehaviorContract>
}

export class Entity extends events.EventEmitter {

    static deserialize(serializedEntity:string){
        const deserializedEntityContract:SerializedEntityContract = JSON.parse(serializedEntity) as SerializedEntityContract;
        const entity = new Entity();
        for(const serializedComponent of deserializedEntityContract.components){
            entity.addComponent(EntityComponent.deserialize(serializedComponent));
        }
        for(const serializedBehavior of deserializedEntityContract.behaviors) {
            entity.addComponent(Behavior.deserialize(serializedBehavior));
        }
    }

    id:string;
    components:Array<EntityComponent>;
    behaviors:Array<Behavior>;

    constructor() {
        super();
        this.id = uuid();
        this.components = new Array<EntityComponent>();
        this.behaviors = new Array<Behavior>();
    }

    async update(){
        for(const behavior of this.behaviors) {
            await behavior.execute(this);
        }
    }

    addComponent(entityComponent: EntityComponent):void {
        if(!this.hasComponent(entityComponent)) {
           this.components.push(entityComponent);
        }
    }

    hasComponent(entityComponent: EntityComponent):boolean {
        return typeof this.getComponent(entityComponent.contractType, entityComponent.contractName) !== 'undefined'
    }

    getComponent(type:string, name:string):EntityComponent | undefined {
        return this.components.find(c =>
            c.contractType === type &&
            c.contractName === name
        )
    }
}