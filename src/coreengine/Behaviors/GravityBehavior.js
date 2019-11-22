import Behavior from "./Behavior";

export default class GravityBehavior extends Behavior {
    constructor(entity) {
        super('gravitor',entity)
    }
    update(eventArgs) {
        const body = eventArgs.currentEntity.components['body'];
        const move = eventArgs.currentEntity.components['move'];
        const forces = eventArgs.currentEntity.components['forces'];
        const currentGravityForce = forces.getForce('gravity');
        currentGravityForce.force.y = Math.min(currentGravityForce.force.y + body.weight, move.maxSpeedY);
    }
}