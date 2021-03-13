import {EntityComponent} from "./EntityComponent";

export class BodyComponent extends EntityComponent {

    public static metadata = [
        {
            contractType:"EntityComponent",
            contractName:"Body",
            isShared:false
        }
    ]

    coordinates:{ x:number, y:number, z:number}
    size: {width:number, height:number, depth:number}

    constructor() {
        super(BodyComponent.metadata[0])
        this.coordinates = { x: 0, y:0, z:0};
        this.size = {width:0, height:0, depth:0}
    }
}