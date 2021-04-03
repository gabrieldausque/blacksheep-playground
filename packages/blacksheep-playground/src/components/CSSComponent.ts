import {EntityComponent} from "./EntityComponent";

export class CSSComponent extends EntityComponent {
    public static metadata = [
        {
            contractType:"Component",
            contractName:"Css",
            isShared:false
        }
    ]

    classes:Array<string>;

    constructor() {
        super(CSSComponent.metadata[0]);
        this.classes = []
    }
    
}