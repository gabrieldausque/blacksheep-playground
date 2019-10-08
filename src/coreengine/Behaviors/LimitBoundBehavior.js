import Behavior from "./Behavior";

export default class LimitBoundBehavior extends LimitBehavior {
    constructor(entity){
        super('limitBounder',entity);
    }
    update(event) {
        const rebound = super.getLimitCollision.call(this);
        if(rebound.x) {
            this.components['move'].speedx = -(this.components['move'].speedx);
        }
        if(rebound.y) {
            this.components['move'].speedy = -(this.components['move'].speedy);
        }
    }
}