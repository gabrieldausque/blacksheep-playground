//TODO : extract the stars factory to its own file
//TODO : extract the meteor factory to its own file

window.addEventListener('load', function() {

    if(window.gameEngine === undefined) {
        window.gameEngine = new GameEngine();

        if (!gameEngine.started) {
            gameEngine.started = true;
            document.documentElement.addEventListener('gameInit', function (event) {
                var player = new Entity();

                player.addComponent(new BodyComponent(15, 288, 100, 64, 64, 1));
                player.addComponent(new ImageComponent('img/ufo_64x64.png', 2, 8));
                player.addComponent(new LimitComponent(0, 0, 1024, 768));
                player.addComponent(new MoveComponent(0, 0, 3, 3));
                player.addComponent(new ForcesComponent());

                player.addBehavior(new DrawImageBehavior(player));
                player.addBehavior(new SpecificAnimationBehavior(player));
                player.addBehavior(new GravityBehavior(player));

                player.components['forces'].addForce('jump', {x: 0, y: 0});

                //TODO : refactor and put it to the core engine !!!!
                var customBehavior = new Behavior('forces', player);
                player.addBehavior(customBehavior);
                customBehavior.forceLabel = 'playerForces';
                customBehavior.lastUpdate = Date.now();
                customBehavior.setUpdateHandler(function (event) {
                    var theBehavior = this.getBehavior('forces');
                    var jumpForce = this.getComponent('forces').getForce('jump');
                    if (window.gameEngine.inputs()[" "]) {
                        theBehavior.lastUpdate = Date.now();
                        jumpForce.force.y = Math.max(-10, jumpForce.force.y - 1);
                    }

                    if (Date.now() - theBehavior.lastUpdate > 125) {
                        jumpForce.force.y = (Math.min(0, jumpForce.force.y + 1));
                    }
                });

                player.addBehavior(new MoveBehavior(player));
                player.addBehavior(new LimitBoundBehavior(player));

                gameEngine.addEntity(player);

                var background = new Entity();
                background.addComponent(new BodyComponent(0, 0, 1, 1024, 768, 0));
                background.addComponent(new CSSImageComponent("linear-gradient(black, #000080"));
                background.addBehavior(new DrawCSSBehavior(background));

                gameEngine.addEntity(background);

                var starsFactory = new StarFactory();
                gameEngine.addEntity(starsFactory);

                var meteorsFactory = new MeteorsFactory();
                gameEngine.addEntity(meteorsFactory);
            })

            gameEngine.run();

        }
    }
});
