import {Behavior} from "./Behavior";
import {Entity} from "../Entity";

export class ScriptBehavior extends Behavior {

    public static metadata = [
        {
            contractType:'Behavior',
            contractName:'Script',
            isShared:false
        }
    ]

    handlers: { [eventName:string] : string[]}

    constructor() {
        super(ScriptBehavior.metadata[0]);
        this.handlers = {};
    }

    execute(owner: Entity): Promise<void> {
        return Promise.resolve(undefined);
    }

    initAfterDeserialize() {
        for(const eventName in this.handlers){
            if(this.handlers.hasOwnProperty(eventName)){
                const functionBody = this.handlers[eventName].join(' ');
                this[`on_${eventName}`] = eval(functionBody);
            }
        }
    }

}