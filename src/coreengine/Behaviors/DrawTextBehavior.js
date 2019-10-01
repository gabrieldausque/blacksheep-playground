import Behavior from "./Behavior";

export default class DrawTextBehavior
    extends Behavior {
    constructor(entity){
        super('drawer', entity);
        this.entity.addEventListener('gameDraw', this.draw);
    }
    draw(event) {
        event.ctx.font = "50px Arial";
        event.ctx.textAlign = "center";
        event.ctx.fillText(this.components['text'].text,
            512,50);
    };
}