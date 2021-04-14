import {Behavior} from "./Behavior";
import {Entity} from "../Entity";

export class PrintBehavior extends Behavior {

    public static metadata = [
        {
            contractType:'Behavior',
            contractName:'Print',
            isShared:true
        }
    ]

    constructor() {
        super(PrintBehavior.metadata[0], [
            {
                eventName:'click',
                isGlobal:false
            },
            {
                eventName:'keyup',
                isGlobal:true
            }
        ]);
    }

    execute(owner: Entity): Promise<void> {
        return Promise.resolve(undefined);
    }

    async on_all(entity:Entity, arg:any):Promise<void>{
        console.log(`on ${arg.eventName}`);
        console.log(arg);
    }

}