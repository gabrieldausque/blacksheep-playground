import {Entity, SerializedEntityContract} from "./Entity";
import * as events from 'events';

export interface SerializedSceneContract {
    entities:Array<SerializedEntityContract>
}

export class Scene extends events.EventEmitter{

    static deserialize(serializedScene:string | SerializedSceneContract) {
        const deserializedSceneContract:SerializedSceneContract = typeof serializedScene === 'string'?
            JSON.parse(serializedScene) as SerializedSceneContract:
            serializedScene;
        const scene = new Scene();
        for(const serializedEntity of deserializedSceneContract.entities){
            scene.addEntity(Entity.deserialize(serializedEntity));
        }
        return scene;
    }

    /**
     * List of entities of the current scene
     */
    entities: Entity[];

    constructor() {
        super();
        this.entities = []
    }

    /**
     * Add an entity in the current scene
     * @param entity The entity to add
     */
    addEntity(entity:Entity){
        if(this.entities.indexOf(entity) < 0) {
            this.entities.push(entity);
        }
    }
}