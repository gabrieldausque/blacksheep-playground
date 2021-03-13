import {EntityComponent} from "./EntityComponent";

export class SpeedComponent extends EntityComponent {

    public static metadata = [
        {
            contractType:"Component",
            contractName:"Speed",
            isShared:false
        }
    ]

    speeds:{x:number, y:number, z:number}
    maxSpeeds:{x:number, y:number, z:number}

    constructor() {
        super(SpeedComponent.metadata[0]);
        this.speeds = {x:0, y:0, z:0};
        this.maxSpeeds = {x:0, y:0, z:0};
    }

}