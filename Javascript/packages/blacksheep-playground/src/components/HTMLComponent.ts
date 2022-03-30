import {EntityComponent} from "./EntityComponent";

export class HTMLComponent extends EntityComponent {
    public static metadata = [
        {
            contractType:"Component",
            contractName:"HTML",
            isShared:false
        }
    ]

    content:string;

    constructor() {
        super(HTMLComponent.metadata[0]);
        this.content = '';
    }
}