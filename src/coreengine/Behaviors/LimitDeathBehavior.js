import Behavior from "./Behavior";

class LimitDeathBehavior extends Behavior {
    constructor(entity) {
        super('limitDeath',entity);
    }
    update(event){
        const rebound = super.getLimitCollision.call(this);
        if (rebound.x || rebound.y)
        {
            this.dispatchEvent('death', this);
        }
    }
}