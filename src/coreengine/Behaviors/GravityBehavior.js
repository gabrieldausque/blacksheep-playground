import Behavior from "./Behavior";

export default class GravityBehavior extends Behavior {
    constructor(entity) {
        super('gravitor',entity)
    }
    update(event) {
        const body = this.components['body'];
        const forces = this.components['forces'];
        forces.addForce('gravity', {x:0, y:3*body.weight});
    }
}