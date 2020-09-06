import Behavior from "./Behavior";

class LimitDeathBehavior extends Behavior {
    constructor(entity) {
        super('limitDeath',entity);
    }
    update(eventArgs){
        const rebound = super.getLimitCollision(eventArgs.currentEntity);
        if (rebound.x || rebound.y)
        {
            eventArgs.currentEntity.dispatchEvent('death', this);
        }
    }
}