import Behavior from "./Behavior";

export default class LimitBoundBehavior extends LimitBehavior {
    constructor(entity){
        super('limitBounder',entity);
    }
    update(eventArgs) {
        const rebound = super.getLimitCollision.call(this, eventArgs.currentEntity);
        const currentEntity = eventArgs.currentEntity;
        let hasRebound = false;
        if(rebound.x) {
            eventArgs.currentEntity.components['body'].x = eventArgs.currentEntity.components['body'].x - eventArgs.currentEntity.components['move'].speedx;
            eventArgs.currentEntity.components['move'].speedx = -(eventArgs.currentEntity.components['move'].speedx);
            hasRebound = true;
        }
        if(rebound.y) {
            eventArgs.currentEntity.components['body'].y = eventArgs.currentEntity.components['body'].y - eventArgs.currentEntity.components['move'].speedy;
            eventArgs.currentEntity.components['move'].speedy = -(eventArgs.currentEntity.components['move'].speedy);
            hasRebound = true;
        }

        if(hasRebound) {
            currentEntity.dispatchEvent('rebound', eventArgs);
        }
    }
}