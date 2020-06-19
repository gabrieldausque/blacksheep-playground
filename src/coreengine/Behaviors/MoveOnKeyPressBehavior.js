import Behavior from './Behavior.js';

export default class MoveOnKeyPressedBehavior extends Behavior {
    constructor(entity, leftKey, rightKey, upKey, downKey, speedAcceleration) {
        super('moveOnKeyPress', entity);
        this.inputService = window.gameEngine.inputs();
        this.leftKey = leftKey;
        this.rightKey = rightKey;
        this.upKey = upKey;
        this.downKey = downKey;
        this.speedAcceleration = speedAcceleration;
    }
    update(eventArgs) {
        let move = {
            x:0,
            y:0
        };
        const currentEntity = eventArgs.currentEntity;
        const moveOnKeyPressBehavior = currentEntity.getBehavior('moveOnKeyPress');
        const moveComponent = currentEntity.getComponent('move');

        const newSpeedXAbs = (moveOnKeyPressBehavior.speedAcceleration)?
            (Math.min(moveComponent.maxSpeedX, Math.abs(moveComponent.speedx) + moveOnKeyPressBehavior.speedAcceleration)):
            moveComponent.maxSpeedX;
        const newSpeedYAbs = (moveOnKeyPressBehavior.speedAcceleration)?
            (Math.min(moveComponent.maxSpeedY, Math.abs(moveComponent.speedy) + moveOnKeyPressBehavior.speedAcceleration)):
            moveComponent.maxSpeedY;

        if(moveOnKeyPressBehavior.inputService[moveOnKeyPressBehavior.leftKey]) {
            move.x = -newSpeedXAbs;
        }
        if(moveOnKeyPressBehavior.inputService[moveOnKeyPressBehavior.rightKey]) {
            move.x = newSpeedXAbs;
        }

        if(moveOnKeyPressBehavior.inputService[moveOnKeyPressBehavior.upKey]) {
            move.y = -newSpeedYAbs;
        }
        if(moveOnKeyPressBehavior.inputService[moveOnKeyPressBehavior.downKey]) {
            move.y = newSpeedYAbs;
        }

        moveComponent.speedx = move.x;
        moveComponent.speedy = move.y;

        currentEntity.dispatchEvent('speedUpdated',move);
    }
}