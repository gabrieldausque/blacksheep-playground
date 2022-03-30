import {EntityComponent} from "./EntityComponent";

export class TextComponent extends EntityComponent {
    public static metadata = [
        {
            contractType:"Component",
            contractName:"Text",
            isShared:false
        }
    ]

    text:string;

    constructor() {
        super(TextComponent.metadata[0]);
        this.text = '';
    }

}