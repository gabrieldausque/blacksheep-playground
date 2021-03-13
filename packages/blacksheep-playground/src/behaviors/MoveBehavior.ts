import {Behavior} from "./Behavior";
import {Entity} from "../Entity";
import {BodyComponent} from "../components";
import {SpeedComponent} from "../components/SpeedComponent";

export class MoveBehavior extends Behavior {

    public static metadata = [
        {
            contractType:'Behavior',
            contractName:'Move',
            isShared:true
        }
    ]

    constructor() {
        super(MoveBehavior.metadata[0]);
    }

    async execute(owner: Entity): Promise<void> {
        const bodyComponent:BodyComponent | undefined = owner.getComponent<BodyComponent>('Body');
        const speedComponent:SpeedComponent | undefined = owner.getComponent<SpeedComponent>('Speed');
        if(bodyComponent && speedComponent){
            bodyComponent.position.x += speedComponent.speeds.x;
            bodyComponent.position.y += speedComponent.speeds.y;
            bodyComponent.position.z += speedComponent.speeds.z;
        }
    }

}