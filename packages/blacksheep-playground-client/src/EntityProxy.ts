import {GameEventEmitter} from "./GameEventEmitter";
import {eventArgConverter} from "./EventArgConverter";

export interface Component {
    contractType:string;
    contractName:string;

    [propName:string] : any;
}

export interface EventDescriptor {
    eventName:string;
    isGlobal:boolean;
}

export interface Behavior {
    contractType:string;
    contractName:string;
    reactOn:EventDescriptor[]
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
    behaviors:Array<Behavior>

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
                    console.log(`subscribing ${behavior.contractName} to `)
                    for(const event of behavior.reactOn){
                        const eventEmitter = event.isGlobal ? document : sprite;
                        eventEmitter.addEventListener(event.eventName, (arg) => {
                            // TODO : convert the event based on eventName
                            console.log(`emitting ${event.eventName}`)
                            this.emit('EventRaised', {
                                eventName: event.eventName,
                                eventSender: this.id,
                                args: eventArgConverter.convert(event.eventName, arg)
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
                    sprite.style.top = bodyComponent.position.y + 'px';
                if(sprite.style.left !== bodyComponent.position.x)
                    sprite.style.left = bodyComponent.position.x + 'px';
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

        const htmlComponent = this.components.find(c => c.contractName.toLowerCase() === 'html');
        if(htmlComponent) {
            if(sprite.innerHTML !== htmlComponent.content)
                sprite.innerHTML = htmlComponent.content;
        }
    }
}

