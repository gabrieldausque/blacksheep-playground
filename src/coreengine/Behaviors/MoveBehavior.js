import Behavior from "./Behavior";

export default class MoveBehavior extends Behavior {
    constructor(entity) {
        super('mover', entity);
    }
    update(event) {
        const body = this.components['body'];
        const x = body.x;
        const y = body.y;
        const width = body.width;
        const height = body.height;

        const move = this.components['move'];
        const speedx = move.speedx;
        const speedy = move.speedy;

        let forcesX = 0;
        let forcesY = 0;

        if(typeof this.components['forces'] !== 'undefined') {
            let forces = this.components['forces'].forces;
            for (let forceIndex = 0; forceIndex < forces.length; forceIndex++) {
                forcesX += forces[forceIndex].force.x;
                forcesY += forces[forceIndex].force.y;
            }
        }
        body.x += Math.min(speedx + forcesX, move.maxSpeedX);
        body.y += Math.min(speedy + forcesY, move.maxSpeedY);
        this.dispatchEvent('moveEvent',this);
    }
}