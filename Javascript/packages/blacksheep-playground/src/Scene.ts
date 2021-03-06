import {Entity, SerializedEntityContract} from "./Entity";
import * as events from 'events';

export interface SerializedSceneContract {
    order:number,
    key:string,
    entities:Array<SerializedEntityContract>
}

export class Scene extends events.EventEmitter{

    static deserialize(serializedScene:string | SerializedSceneContract) {
        const deserializedSceneContract:SerializedSceneContract = typeof serializedScene === 'string'?
            JSON.parse(serializedScene) as SerializedSceneContract:
            serializedScene;
        const scene = new Scene();
        scene.order = deserializedSceneContract.order;
        scene.key = deserializedSceneContract.key;
        for(const serializedEntity of deserializedSceneContract.entities){
            scene.addEntity(Entity.deserialize(serializedEntity));
        }
        return scene;
    }

    serialize():SerializedSceneContract {
        const toReturn:SerializedSceneContract = {
            key: this.key?this.key:'',
            order: this.order,
            entities: []
        }
        for(const entity of this.entities) {
            toReturn.entities.push(entity.serialize())
        }
        return toReturn
    }

    /**
     * List of entities of the current scene
     */
    entities: Entity[];

    /**
     * The scene order number
     */
    order:number;

    /**
     *
     */
    key?: string;

    constructor() {
        super();
        this.entities = []
        this.order = 0;
    }

    /**
     * Add an entity in the current scene
     * @param entity The entity to add
     */
    addEntity(entity:Entity){
        if(this.entities.indexOf(entity) < 0) {
            this.entities.push(entity);
            this.on('EventRaised', (arg:{
                eventName:string,
                eventSender:string,
                args:any
            }) => {
                if(entity.id === arg.eventSender){
                    entity.emit('EventRaised', arg)
                }
            })
            entity.on('NextScene',() => {
                this.emit('NextScene')
            })
        }
    }

    /**
     * Update all entities of the scene
     */
    async update():Promise<void> {
        for(const entity of this.entities){
            await entity.update();
        }
    }
}