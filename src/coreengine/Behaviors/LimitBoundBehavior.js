import Behavior from "./Behavior";

export default class LimitBoundBehavior extends LimitBehavior {
    constructor(entity){
        super('limitBounder',entity);
    }
    update(eventArgs) {
        const rebound = super.getLimitCollision.call(eventArgs.currentEntity);
        if(rebound.x) {
            eventArgs.currentEntity.components['move'].speedx = -(eventArgs.currentEntity.components['move'].speedx);
        }
        if(rebound.y) {
            eventArgs.currentEntity.components['move'].speedy = -(eventArgs.currentEntity.components['move'].speedy);
        }
    }
}