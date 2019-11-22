import Behavior from "./Behavior";

export default class MoveBehavior extends Behavior {
    constructor(entity) {
        super('mover', entity);
    }
    update(eventArgs) {
        const body = eventArgs.currentEntity.components['body'];
        const x = body.x;
        const y = body.y;
        const width = body.width;
        const height = body.height;

        const move = eventArgs.currentEntity.components['move'];
        const speedx = move.speedx;
        const speedy = move.speedy;

        let forcesX = 0;
        let forcesY = 0;

        if(typeof eventArgs.currentEntity.components['forces'] !== 'undefined') {
            let forces = eventArgs.currentEntity.components['forces'].forces;
            for (let forceIndex = 0; forceIndex < forces.length; forceIndex++) {
                forcesX += forces[forceIndex].force.x;
                forcesY += forces[forceIndex].force.y;
            }
        }

        let toAddX = speedx + forcesX;
        let toAddY = speedy + forcesY;

        if(toAddX > 0) {
            toAddX = Math.min(toAddX, move.maxSpeedX);
        }  else if(toAddX < 0) {
            toAddX = Math.max(toAddX, -move.maxSpeedX);
        }
        body.x += toAddX;

        if(toAddY > 0) {
            toAddY = Math.min(toAddY, move.maxSpeedY);
        } else {
            toAddY = Math.max(toAddY, -move.maxSpeedY);
        }
        body.y += toAddY;
        eventArgs.currentEntity.dispatchEvent('moveEvent',{ x: toAddX, y: toAddY });
    }
}