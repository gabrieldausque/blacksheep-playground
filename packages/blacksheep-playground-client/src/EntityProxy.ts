import {GameEventEmitter} from "./GameEventEmitter";

export interface Component {
    contractType:string;
    contractName:string;

    [propName:string] : any;
}

export interface Behavior {
    contractType:string;
    contractName:string;

    [propName:string] : any;
}

export interface EntityProxyInterface {
    id:string;
    components:Array<Component>
    behaviors:Array<Behavior>
}

export class EntityProxy extends GameEventEmitter {

    id:string;
    components:Array<Component>
    behaviors:Array<Component>

    constructor() {
        super();
        this.components = [];
        this.behaviors = [];
    }

    deserialize(serializedEntity:EntityProxyInterface):void {
        this.id = serializedEntity.id;
        this.components.push(...serializedEntity.components);
        this.behaviors.push(...serializedEntity.behaviors);
    }

    async update(serializedEntity:EntityProxyInterface):Promise<void> {
        this.components = [];
        this.components.push(...serializedEntity.components);
    }

    async draw() {
        let sprite:HTMLElement = document.getElementById(this.id);

        if(!sprite){
            sprite = document.createElement("div");
            sprite.id = this.id;
            document.getElementById('screen').append(sprite);
            for(const behavior of this.behaviors){
                if(Array.isArray(behavior.reactOn)){
                    for(const eventName of behavior.reactOn){
                        sprite.addEventListener(eventName, (arg) => {
                            console.log('Emiting');
                            console.log(arg);
                            this.emit('EventRaised', {
                                eventName: eventName,
                                eventSender: this.id,
                                args: arg
                            })
                        })
                    }
                }
            }
        }

        const bodyComponent = this.components.find(c => c.contractName.toLowerCase() === 'body')
        if(bodyComponent) {
            if(bodyComponent.position){
                if(sprite.style.top !== bodyComponent.position.y)
                    sprite.style.top = bodyComponent.position.y;
                if(sprite.style.left !== bodyComponent.position.x)
                    sprite.style.left = bodyComponent.position.x;
                if(sprite.style.zIndex !== bodyComponent.position.z)
                    sprite.style.zIndex = bodyComponent.position.z;
            }
            if(bodyComponent.size){
                if(sprite.style.width !== bodyComponent.size.width +'px')
                    sprite.style.width = bodyComponent.size.width +'px';
                if(sprite.style.height !== bodyComponent.size.height + 'px')
                    sprite.style.height = bodyComponent.size.height + 'px';
            }
        }

        const textComponent = this.components.find(c => c.contractName.toLowerCase() === 'text');
        if(textComponent) {
            if(sprite.innerText !== textComponent.text)
                sprite.innerText = textComponent.text;
        }

        const cssComponent = this.components.find(c => c.contractName.toLowerCase() === 'css');
        if(cssComponent) {
            for(const c of cssComponent.classes){
                if(!sprite.classList.contains(c))
                    sprite.classList.add(c)
            }
        }
    }
}

