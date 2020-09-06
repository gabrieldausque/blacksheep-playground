import {Entity} from "./Entity";

const EventEmitter = require('events');

export class Scene extends EventEmitter{

    /**
     * List of entities of the current scene
     */
    private entities: Entity[];

    constructor() {
        super();
        this.entitixes = []
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