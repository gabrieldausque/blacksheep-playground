import {Behavior, Entity} from "@blacksheep/playground";

export class CreateSpriteBehavior extends Behavior {

    public static metadata:any[] = [
        {
            contractType:'Behavior',
            contractName:'CreateSprite'
        }
    ]

    constructor() {
        super(CreateSpriteBehavior.metadata[0], [{
            eventName:'keyup',
            isGlobal:true
        }]);
    }

    async execute(owner: Entity): Promise<void> {

    }

    async on_keyup(entity:Entity, arg:any){

    }

}