function Star(x,y,size,animationDuration) {
    Entity.call(this);
    this.addComponent(new BodyComponent(x,y,2,size,size,1));
    this.addComponent(new CSSImageComponent("#ffffff",
        "border-radius: 25px; animation: starsFading " + animationDuration + "s infinite;"));
    this.addBehavior(new DrawCSSBehavior(this));
}

function StarsFactoryComponent(maxStars) {
    Component.call(this, 'starsFactorySettings');
    this.isFirstRun =true;
    this.maxStars = maxStars;
    this.nbStars = 0;
    this.coordinates = {
        x: {min: 0, max:1029},
        y: {min: 0, max:768}
    };
}

function StarFactoryCreateStarBehavior(factory) {
    Behavior.call(this, 'starsCreation', factory);
    this.setUpdateHandler(function(event) {
        var factoryComponent = this.components['starsFactorySettings'];
        while(factoryComponent.nbStars < factoryComponent.maxStars)
        {
            var size = getRandomInt(1,5);
            var animationDuration = getRandomInt(1,5);
            var x = 1029;
            if(factoryComponent.isFirstRun)
                x = getRandomInt(factoryComponent.coordinates.x.min,factoryComponent.coordinates.x.max);

            var star = new Star(x,
                getRandomInt(factoryComponent.coordinates.y.min,factoryComponent.coordinates.y.max),
                size,
                animationDuration);

            star.addComponent(new LimitComponent(0,-10,1044,768));
            star.addComponent(new MoveComponent(-2,0,-2,0))
            star.addBehavior(new MoveBehavior(star));
            star.addBehavior(new LimitDeathBehavior(star));
            star.addEventListener('death',function(deadEntity) {
                factoryComponent.nbStars--;
                window.gameEngine.removeEntity(deadEntity);
            });
            window.gameEngine.addEntity(star);
            factoryComponent.nbStars++;
        }

        factoryComponent.isFirstRun = false;
    })
}
StarFactoryCreateStarBehavior.prototype = Object.create(Behavior.prototype);
StarFactoryCreateStarBehavior.prototype.constructor = StarFactoryCreateStarBehavior;

function StarFactory() {
    Entity.call(this);
    this.addComponent(new StarsFactoryComponent(60));
    this.addBehavior(new StarFactoryCreateStarBehavior(this));
}