function Meteor(x,y) {
    Entity.call(this);
    this.addComponent(new BodyComponent(x,y,3,150,150,1));
    this.addComponent(new ImageComponent('img/meteor.png',1,1));
    this.addComponent(new CSSComponent({
        backgroundSize : 'contain',
        animationName : 'spin',
        animationDuration : '5s',
        animationIterationCount : 'infinite',
        animationTimingFunction : 'linear'
    }))
    this.addBehavior(new DrawImageBehavior(this));
    //TODO : add collision component and behavior
}

function MeteorFactorySettings() {
    Component.call(this, 'meteorsFactorySettings');
    this.coordinates = {
        x: {min: 1024, max : 1200},
        y: {min: 0, max : 700}
    };
    this.LastCreation = Date.now();
}

function MeteorCreateBehavior(entity) {
    Behavior.call(this,'meteorsCreation', entity);
    this.setUpdateHandler(function(event) {
        var factoryComponent = this.components['meteorsFactorySettings'];
        if(Date.now() - factoryComponent.LastCreation >= 2500) {
            var x = 1024;
            var y = 0;
            for(var meteorIndex=0;meteorIndex<2;meteorIndex++)
            {
                if(y === 0)
                    y = getRandomInt(0, factoryComponent.coordinates.y.max/2);
                else
                    y = Math.max(y+300, getRandomInt(factoryComponent.coordinates.y.max/2, factoryComponent.coordinates.y.max));
                var meteor = new Meteor(x,y)
                meteor.addComponent(new LimitComponent(-200, -500, 1700, 1068));
                meteor.addComponent(new MoveComponent(getRandomInt(-2,-4),
                    0,
                    -4, 0));
                meteor.addBehavior(new MoveBehavior(meteor));
                meteor.addBehavior(new LimitDeathBehavior(meteor));
                meteor.addEventListener('death', function (deadEntity) {
                    window.gameEngine.removeEntity(deadEntity);
                });
                window.gameEngine.addEntity(meteor);
            }
            factoryComponent.LastCreation = Date.now();
        }
    })
}
MeteorCreateBehavior.prototype = Object.create(Behavior.prototype);
MeteorCreateBehavior.prototype.constructor = MeteorCreateBehavior;

function MeteorsFactory() {
    Entity.call(this);
    this.addComponent(new MeteorFactorySettings());
    this.addBehavior(new MeteorCreateBehavior(this));
}