export interface Component {
    contractType:string;
    contractName:string;

    [propName:string] : any;
}

export interface EntityProxyInterface {
    id:string;
    components:Array<Component>
}

export class EntityProxy {
    id:string;
    components:Array<Component>
    constructor() {
        this.components = [];
    }
    deserialize(serializedEntity:EntityProxyInterface):void {
        this.id = serializedEntity.id;
        this.components.push(...serializedEntity.components);
    }

    async update(serializedEntity:EntityProxyInterface){
        this.components = [];
        this.components.push(...serializedEntity.components);
    }

    async draw() {
        let sprite:HTMLElement = document.getElementById(this.id);
        if(!sprite){
            sprite = document.createElement("div");
            sprite.id = this.id;
            document.getElementById('screen').append(sprite);
        }
        const bodyComponent = this.components.find(c => c.contractName.toLowerCase() === 'body')
        if(bodyComponent) {
            if(bodyComponent.position){
                sprite.style.top = bodyComponent.position.y;
                sprite.style.left = bodyComponent.position.x;
                sprite.style.zIndex = bodyComponent.position.z;
            }
            if(bodyComponent.size){
                sprite.style.width = typeof bodyComponent.size.width === "number"?bodyComponent.size.width +'px':bodyComponent.size.width;
                sprite.style.height = typeof bodyComponent.size.height === "number"?bodyComponent.size.height + 'px':bodyComponent.size.height;
            }
        }
        const textComponent = this.components.find(c => c.contractName.toLowerCase() === 'text');
        if(textComponent) {
            sprite.innerText = textComponent.text;
        }
        const cssComponent = this.components.find(c => c.contractName.toLowerCase() === 'css');
        if(cssComponent) {
            sprite.classList.add(cssComponent.classes)
        }
    }
}

