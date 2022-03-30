import LimitBehavior from "./LimitBehavior";

export default class LimitReboundWithElasticityBehavior extends LimitBehavior {
    constructor(entity) {
        super('limitReboundWithElasticity', entity);
    }

    update(eventArgs) {
        const limitCollision = super.getLimitCollision(eventArgs.currentEntity);
        const forcesComponent = eventArgs.currentEntity.getComponent('forces');
        const elasticityComponent = eventArgs.currentEntity.getComponent('elasticity');
        const moveComponent = eventArgs.currentEntity.getComponent('move');
        const reboundForce = forcesComponent.getForce('rebound');
        
        if(limitCollision.y && reboundForce.force.y === 0) {
            reboundForce.force.y = 0;
            for(let i = 0; i < forcesComponent.forces.length;i++) {
                if(forcesComponent.forces[i] !== reboundForce) {
                    reboundForce.force.y -= forcesComponent.forces[i].force.y
                }
            }
            reboundForce.force.y = reboundForce.force.y * elasticityComponent.elasticity;
            moveComponent.speedy = - moveComponent.speedy;
        } else if(reboundForce.force.y < 0) {
            reboundForce.force.y += 1;
        } else if(reboundForce.force.y > 0) {
            reboundForce.force.y -=1;
        }

        if(limitCollision.x && reboundForce.force.x === 0) {
            reboundForce.force.x = -elasticityComponent.energy.x;
            moveComponent.speedx = -moveComponent.speedx;
        } else if(reboundForce.force.x < 0) {
            reboundForce.force.x +=1;
        } else if(reboundForce.force.y > 0) {
            reboundForce.force.x -=1;
        }
    }
}