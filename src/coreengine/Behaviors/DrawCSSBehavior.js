import Behavior from './Behavior';

export class DrawCSSBehavior extends Behavior {
    constructor(entity) {
        super('drawer', entity);
        this.entity.addEventListener('gameDraw', this.draw);
    }
    draw(eventArgs) {
        let display = document.getElementById('display');
        let element = document.getElementById(eventArgs.currentEntity.id);
        let body = eventArgs.currentEntity.components['body'];
        let css = eventArgs.currentEntity.components['css'];

        if(!element) {
            element = document.createElement('div');
            element.id = eventArgs.currentEntity.id;
            element.style.background = css.cssBackgroundText;
            element.style.zIndex = body.z;
            element.style.width = body.width + 'px';
            element.style.height = body.height + 'px';
            element.style.position = 'absolute';
            element.style.cssText += css.otherCssText;
            display.appendChild(element);
        }
        element.style.top = body.y + 'px';
        element.style.left = body.x + 'px';
    }
}