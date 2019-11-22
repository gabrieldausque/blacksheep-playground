import LimitBehavior from "./LimitBehavior";

export default class LimitReboundWithElasticityBehavior extends LimitBehavior {
    constructor(entity) {
        super('limitReboundWithElasticity', entity);
        entity.addEventListener('moveEvent', this.getEnergy);
        entity.addEventListener('moveEvent', this.checkLimits);
    }

    checkLimits(eventArgs) {
        const bodyComponent = eventArgs.currentEntity.getComponent('body');
        const limitComponent = eventArgs.currentEntity.getComponent('limits');
        if(bodyComponent.y < limitComponent.top) {
            bodyComponent.y = limitComponent.top;
        } else if (bodyComponent.y + bodyComponent.height > limitComponent.top + limitComponent.height) {
            bodyComponent.y = limitComponent.top + limitComponent.height - bodyComponent.height;
        }
    }

    getEnergy(eventArgs) {
        const elasticityComponent = eventArgs.currentEntity.getComponent('elasticity');
        const moveComponent = eventArgs.currentEntity.getComponent('move');
        const forcesComponent = eventArgs.currentEntity.getComponent('forces');

        for(let namedForceIndex in forcesComponent.forces) {
            let namedForce = forcesComponent.forces[namedForceIndex];
            if(namedForce.name !== 'rebound') {
                elasticityComponent.energy.x += namedForce.force.x;
                elasticityComponent.energy.y += namedForce.force.y;
            }
        }

        if(elasticityComponent.energy.x < 0) {
            elasticityComponent.energy.x = Math.max(-moveComponent.maxSpeedX * elasticityComponent.elasticity, elasticityComponent.energy.x);
        } else {
            elasticityComponent.energy.x = Math.min(elasticityComponent.energy.x, moveComponent.maxSpeedX * elasticityComponent.elasticity);
        }
        if(elasticityComponent.energy.y < 0) {
            elasticityComponent.energy.y = Math.max(-moveComponent.maxSpeedY * elasticityComponent.elasticity, elasticityComponent.energy.y);
        } else {
            elasticityComponent.energy.y = Math.min(elasticityComponent.energy.y, moveComponent.maxSpeedY * elasticityComponent.elasticity);
        }
    }

    update(eventArgs) {
        const limitCollision = super.getLimitCollision(eventArgs.currentEntity);
        const forcesComponent = eventArgs.currentEntity.getComponent('forces');
        const elasticityComponent = eventArgs.currentEntity.getComponent('elasticity');
        const moveComponent = eventArgs.currentEntity.getComponent('move');
        const reboundForce = forcesComponent.getForce('rebound');

        if(limitCollision.y && reboundForce.force.y === 0) {
            reboundForce.force.y = -elasticityComponent.energy.y;
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