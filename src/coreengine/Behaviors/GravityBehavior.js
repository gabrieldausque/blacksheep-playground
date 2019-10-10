import Behavior from "./Behavior";

export default class GravityBehavior extends Behavior {
    constructor(entity) {
        super('gravitor',entity)
    }
    update(event) {
        const body = this.components['body'];
        const move = this.components['move'];
        const forces = this.components['forces'];
        const currentGravityForce = forces.getForce('gravity');
        currentGravityForce.force.y = Math.min(currentGravityForce.force.y + body.weight, move.maxSpeedY);
        //forces.addForce('gravity', currentGravityForce.force);
    }
}