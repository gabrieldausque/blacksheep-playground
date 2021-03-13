import {Behavior} from "./Behavior";
import {Entity} from "../Entity";

export class MoveBehavior extends Behavior {

    static metadata:[
        {
            contractType:'Behavior',
            contractName:'Move'
            isShared:true;
        }
    ]

    constructor() {
        super(MoveBehavior.metadata[0]);
    }

    async execute(owner: Entity): Promise<void> {
        //TODO : get the component speed and body and update the body according to the move
    }

}