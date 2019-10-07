import Behavior from "./Behavior";

export default class DrawImageBehavior extends Behavior {
    constructor(entity) {
        super('drawer', entity);
        this.entity.addEventListener('gameDraw', this.draw);
    }
    draw(event) {
        const display = document.getElementById('display');
        let element = document.getElementById(this.id);
        const body = this.components['body'];
        const image = this.components['image'];

        if (typeof element === 'undefined' || element === null) {
            element = document.createElement('div');
            element.id = this.id;
            element.style.backgroundImage = 'url(\'' + image.imagePath + '\')';
            element.style.backgroundSize = 'initial';
            element.style.zIndex = body.z;
            element.style.width = body.width + "px";
            element.style.height = body.height + "px";
            element.style.position = "absolute";
            let css = this.components['css'];
            if (css) {
                for (let property in css.styles) {
                    if (css.styles.hasOwnProperty(property)) {
                        element.style[property] = css.styles[property];
                    }
                }
            }
            display.appendChild(element);
            const collision = this.components['collision'];
            if (collision && window.gameEngine.isDebug) {
                let colElt = document.createElement("div");
                colElt.id = "col" + this.id;
                colElt.style.borderColor = "red";
                colElt.style.borderWidth = "2px";
                colElt.style.borderStyle = "solid"
                colElt.style.top = collision.collisionRectangle.top + "px";
                colElt.style.left = collision.collisionRectangle.left + "px";
                colElt.style.width = collision.collisionRectangle.width + "px";
                colElt.style.height = collision.collisionRectangle.height + "px";
                colElt.style.position = "absolute";
                element.appendChild(colElt);
            }
        }
        element.style.backgroundPositionX = image.currentImage.x * body.width + "px";
        element.style.backgroundPositionY = image.currentImage.y * body.height + "px";
        element.style.top = body.y + "px";
        element.style.left = body.x + "px";
    }
}