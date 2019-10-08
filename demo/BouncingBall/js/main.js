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
        elasticityComponent.energy.x += moveEventArg.x;
        if(moveEventArg.y > 0)
            elasticityComponent.energy.y += moveEventArg.y;
        console.log('energy : ' + elasticityComponent.energy.y);
    }

    update(eventArg) {
        const limitCollision = super.getLimitCollision.call(this);
        const forcesComponent = this.getComponent('forces');
        const elasticityComponent = this.getComponent('elasticity');
        const reboundForce = forcesComponent.getForce('rebound');
        console.log(reboundForce.force.y);

        if(limitCollision.x || limitCollision.y && reboundForce.force.y === 0 ) {
            let reboundForceValueY = 0;
            let reboundForceValueX = 0;

            if(limitCollision.y) {
                reboundForceValueY = - elasticityComponent.energy.y * elasticityComponent.elasticity;
                elasticityComponent.energy.y = 0;
            }

            if(limitCollision.x) {
                reboundForceValueX = elasticityComponent.energy.x * 2;
                elasticityComponent.energy.x = 0;
            }

            forcesComponent.addForce('rebound', {x: reboundForceValueX, y:reboundForceValueY});
            return;
        }

        if(reboundForce && (reboundForce.force.x !== 0 || reboundForce.force.y !== 0)) {
            if(reboundForce.force.y !== 0) {
                reboundForce.force.y = Math.round(reboundForce.force.y/2);
            }

            if(reboundForce.force.x !== 0) {
                reboundForce.force.x = reboundForce.force.x /2;
            }
        }
    }
}

class Ball extends BlacksheepGameEngine.Entity {
    constructor() {
        super();
        this.addComponent(new BlacksheepGameEngine.BodyComponent(512,0,0,48,48,3));
        this.addComponent(new BlacksheepGameEngine.MoveComponent(0,0,15,15));
        this.addComponent(new BlacksheepGameEngine.ImageComponent('img/Soccer_ball.svg' ));
        this.addComponent(new BlacksheepGameEngine.LimitComponent(0,0,1024,768));
        this.addComponent(new BlacksheepGameEngine.ForcesComponent());

        this.addComponent(new Elasticity(0.9));

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


