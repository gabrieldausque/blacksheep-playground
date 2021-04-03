import {EntityComponent} from "./EntityComponent";

export class BodyComponent extends EntityComponent {

    public static metadata = [
        {
            contractType:"Component",
            contractName:"Body",
            isShared:false
        }
    ]

    position:{ x:number|string, y:number|string, z:number|string}
    size: {width:number|string, height:number|string, depth:number|string}

    constructor() {
        super(BodyComponent.metadata[0])
        this.position = { x: 0, y:0, z:0};
        this.size = {width:0, height:0, depth:0}
    }
}