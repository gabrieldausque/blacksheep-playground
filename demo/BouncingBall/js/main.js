import * as BlacksheepGameEngine from  "../../../dist/blacksheepgameengine-build.js";

class Elasticity extends BlacksheepGameEngine.Component {
    constructor(elasticity) {
        super('elasticity');
        this.elasticity = Math.max(0,elasticity);
        this.energy = {x:0, y:0};

    }
}

class LimitReboundWithElasticity extends BlacksheepGameEngine.LimitBehavior {
    constructor(entity) {
        super('limitReboundWithElasticity', entity);
        entity.addEventListener('moveEvent', this.getEnergy);
        entity.addEventListener('moveEvent', this.checkLimits);
    }

    checkLimits(moveEventArg) {
        const bodyComponent = this.getComponent('body');
        const limitComponent = this.getComponent('limits');
        if(bodyComponent.y < limitComponent.top) {
            bodyComponent.y = limitComponent.top;
        } else if (bodyComponent.y + bodyComponent.height > limitComponent.top + limitComponent.height) {
            bodyComponent.y = limitComponent.top + limitComponent.height - bodyComponent.height;
        }
    }

    getEnergy(moveEventArg) {
        const elasticityComponent = this.getComponent('elasticity');
        const moveComponent = this.getComponent('move');

        elasticityComponent.energy.x += moveEventArg.x;
        elasticityComponent.energy.y += moveEventArg.y;

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

    update(eventArg) {
        const limitCollision = super.getLimitCollision.call(this);
        const forcesComponent = this.getComponent('forces');
        const elasticityComponent = this.getComponent('elasticity');
        const reboundForce = forcesComponent.getForce('rebound');

        if((limitCollision.y && reboundForce.force.y === 0) || (limitCollision.x && reboundForce.force.x === 0)) {
            let reboundForceValueY = reboundForce.force.y;
            let reboundForceValueX = reboundForce.force.x;

            if(limitCollision.y) {
                reboundForceValueY = -elasticityComponent.energy.y;
            }

            if(limitCollision.x) {
                reboundForceValueX = -elasticityComponent.energy.x;
            }
            const force = {x: reboundForceValueX, y:reboundForceValueY};
            forcesComponent.addForce('rebound', {x: reboundForceValueX, y:reboundForceValueY});
            return;
        }

        if(reboundForce && (reboundForce.force.x !== 0 || reboundForce.force.y !== 0)) {
            if(reboundForce.force.y < 0) {
                reboundForce.force.y += 1;
            }

            if(reboundForce.force.x !== 0) {
                reboundForce.force.x -= 1;
            }
        }
    }
}

class Ball extends BlacksheepGameEngine.Entity {
    constructor() {
        super();
        this.addComponent(new BlacksheepGameEngine.BodyComponent(512,0,0,48,48,3));
        this.addComponent(new BlacksheepGameEngine.MoveComponent(1,0,30,30));
        this.addComponent(new BlacksheepGameEngine.ImageComponent('img/Soccer_ball.svg' ));
        this.addComponent(new BlacksheepGameEngine.LimitComponent(0,0,1024,768));
        this.addComponent(new BlacksheepGameEngine.ForcesComponent());

        this.addComponent(new Elasticity(2));

        this.addBehavior(new BlacksheepGameEngine.DrawImageBehavior(this));
        this.addBehavior(new BlacksheepGameEngine.GravityBehavior(this));
        this.addBehavior(new BlacksheepGameEngine.MoveBehavior(this));
        this.addBehavior(new LimitReboundWithElasticity(this));
    }
}

window.gameEngine = new BlacksheepGameEngine.BlackSheepGameEngine();
document.documentElement.addEventListener('gameInit', function() {
    gameEngine.addEntity(new Ball());
});

window.addEventListener('load', function() {
    gameEngine.run();
});


