import Behavior from "./Behavior";

class DrawCSSBehavior extends Behavior {
    constructor(entity) {
        super('drawer', entity);
        this.entity.addEventListener('gameDraw', this.draw);
    }
    draw(event) {
        var display = document.getElementById('display');
        var element = document.getElementById(this.id);
        var body = this.components['body'];
        var css = this.components['css'];

        if(!element) {
            element = document.createElement('div');
            element.id = this.id;
            element.style.background = css.cssBackgroundText;
            element.style.zIndex = body.z;
            element.style.width = body.width + "px";
            element.style.height = body.height + "px";
            element.style.position = "absolute";
            element.style.cssText += css.otherCssText;
            display.appendChild(element);
        }
        element.style.top = body.y + "px";
        element.style.left = body.x + "px";
    }
}