import Behavior from "./Behavior";

export default class GravityBehavior extends Behavior {
    constructor(entity) {
        super('gravitor',entity)
    }
    update(event) {
        const body = this.components['body'];
        body.y += 3*body.weight;
    }
}