import * as events from "events";
import {EntityComponent, EntityComponentContract} from "./components/EntityComponent";
import {Behavior, BehaviorContract} from "./behaviors/Behavior";
import {v4 as uuid} from 'uuid';

export interface SerializedEntityContract {
    id:string,
    components:Array<EntityComponentContract>,
    behaviors:Array<BehaviorContract>
}

export class Entity extends events.EventEmitter {

    static deserialize(serializedEntity:string | SerializedEntityContract):Entity{
        const deserializedEntityContract:SerializedEntityContract = typeof serializedEntity === 'string'?
            JSON.parse(serializedEntity) as SerializedEntityContract:
            serializedEntity;
        const entity = new Entity();
        for(const serializedComponent of deserializedEntityContract.components){
            entity.addComponent(EntityComponent.deserialize(serializedComponent));
        }
        for(const serializedBehavior of deserializedEntityContract.behaviors) {
            entity.addBehavior(Behavior.deserialize(serializedBehavior));
        }
        return entity;
    }

    id:string;
    components:Array<EntityComponent>;
    behaviors:Array<Behavior>;

    constructor() {
        super();
        this.id = uuid();
        this.components = new Array<EntityComponent>();
        this.behaviors = new Array<Behavior>();
        this.on('EventRaised', (arg: {
            eventName: string,
            eventSender: string,
            args: any
        }) => {
            this.emit(arg.eventName, arg.args);
        })
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
        return typeof this.getComponent(entityComponent.contractName, entityComponent.contractType) !== 'undefined'
    }

    getComponent<T extends EntityComponent = EntityComponent>(name:string, type:string = 'Component'):T | undefined {
        return this.components.find(c =>
            c.contractType === type &&
            c.contractName === name
        ) as T;
    }

    addBehavior(behavior: Behavior) {
        if(!this.hasBehavior(behavior)) {
            this.behaviors.push(behavior);
            for(const eventListened of behavior.reactOn){
                this.on(eventListened.eventName, (args) => {
                    behavior.react(eventListened.eventName, this, args).catch((e) => {
                        //do nothing
                        console.error(e);
                    })
                })
            }
        }
    }

    hasBehavior(behavior: Behavior) {
        return typeof this.getBehavior(behavior.contractName, behavior.contractType) !== 'undefined';
    }

    getBehavior<T extends Behavior = Behavior>(name: string, type: string = 'Behavior'): T | undefined {
        return this.behaviors.find(b =>
            b.contractType === type &&
            b.contractName === name
        ) as T;
    }

    serialize():SerializedEntityContract {
        const toReturn:SerializedEntityContract = {
            id: this.id,
            components: [],
            behaviors: []
        }
        for(const component of this.components){
            toReturn.components.push(component.serialize())
        }
        for(const behavior of this.behaviors) {
            toReturn.behaviors.push(behavior.serialize())
        }
        return toReturn;
    }

    raiseEvent(eventName:string, arg?:any) : boolean{
        console.log(`entity emitting ${eventName.toString()}`)
        if(typeof arg === 'undefined'){
           const e = {
               eventName: eventName
           }
           return super.emit(eventName, e);
        }else {
            return super.emit(eventName, arg)
        }
    }
}