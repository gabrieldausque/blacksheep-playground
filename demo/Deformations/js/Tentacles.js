import * as BlackSheepGameEngine from "./blacksheepgameengine-build.js";

class DrawImageWithSinusoid extends BlackSheepGameEngine.DrawImageBehavior {
    constructor(entity) {
        super(entity)
    }

    createElement(entity, image, body, display) {
        let element = document.createElement('div');
        element.id = entity.id;
        
        element.style.zIndex = body.z;
        element.style.width = body.width + "px";
        element.style.height = body.height + "px";
        element.style.position = "absolute";

        for(let rowIndex = 0; rowIndex < 2; rowIndex++) {
            let rowElement = document.createElement('div');
            rowElement.style.height = body.height/2 + "px";
            rowElement.style.width = body.width + "px";
            
            element.appendChild(rowIndex);
        }

        let css = entity.components['css'];
        if (css) {
            for (let property in css.styles) {
                if (css.styles.hasOwnProperty(property)) {
                    element.style[property] = css.styles[property];
                }
            }
        }
        
        display.appendChild(element);
        
        const collision = entity.components['collision'];
        if (collision && window.gameEngine.isDebug) {
            let colElt = document.createElement("div");
            colElt.id = "col" + entity.id;
            colElt.style.borderColor = "red";
            colElt.style.borderWidth = "2px";
            colElt.style.borderStyle = "solid";
            colElt.style.top = collision.collisionRectangle.top + "px";
            colElt.style.left = collision.collisionRectangle.left + "px";
            colElt.style.width = collision.collisionRectangle.width + "px";
            colElt.style.height = collision.collisionRectangle.height + "px";
            colElt.style.position = "absolute";
            element.appendChild(colElt);
        }

        return element;
    }
}

export default class Tentacles extends BlackSheepGameEngine.Entity {
    constructor() {
        super();
        this.addComponent(new BlackSheepGameEngine.BodyComponent(0,0,0,1024,768,3));
        this.addComponent(new BlackSheepGameEngine.ImageComponent('imgs/tentacle.jpg'));
        
        this.addBehavior(new BlackSheepGameEngine.DrawImageBehavior(this));
    }
}