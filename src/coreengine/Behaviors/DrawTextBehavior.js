import Behavior from "./Behavior";

export default class DrawTextBehavior
    extends Behavior {
    constructor(entity){
        super('drawer', entity);
        this.entity.addEventListener('gameDraw', this.draw);
    }
    draw(eventArgs) {
        eventArgs.ctx.font = "50px Arial";
        eventArgs.ctx.textAlign = "center";
        eventArgs.ctx.fillText(eventArgs.currentEntity.components['text'].text,
            512,50);
    };
}