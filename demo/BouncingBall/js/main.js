import * as BlacksheepGameEngine from  "../../../dist/blacksheepgameengine-build.js";

class ball extends BlacksheepGameEngine.Entity {
    constructor() {
        super();
        this.addComponent(new BlacksheepGameEngine.BodyComponent(512,0,0,48,48,0.5));
        this.addComponent(new BlacksheepGameEngine.ImageComponent('img/Soccer_ball.svg' ));
        this.addComponent(new BlacksheepGameEngine.LimitComponent(0,0,1024,768));
        this.addComponent(new BlacksheepGameEngine.MoveComponent(0,5,0,5));
        this.addComponent(new BlacksheepGameEngine.ForcesComponent());

        this.addBehavior(new BlacksheepGameEngine.DrawImageBehavior(this));
        this.addBehavior(new BlacksheepGameEngine.GravityBehavior(this));
        this.addBehavior(new BlacksheepGameEngine.LimitBoundBehavior(this));
        this.addBehavior(new BlacksheepGameEngine.MoveBehavior(this));
    }
}

window.gameEngine = new BlacksheepGameEngine.BlackSheepGameEngine();
document.documentElement.addEventListener('gameInit', function() {
    gameEngine.addEntity(new ball());
});

window.addEventListener('load', function() {
    gameEngine.run();
});


