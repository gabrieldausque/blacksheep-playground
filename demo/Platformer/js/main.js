import * as BlackSheepGameEngine from "./blacksheepgameengine-build.js"

class GroundTile extends BlackSheepGameEngine.Entity {
    constructor(x, y, color) {
        super();
        this.addComponent(new BlackSheepGameEngine.BodyComponent(x,y,0,64,64,0));
        this.addComponent(new BlackSheepGameEngine.CSSImageComponent(color));
        this.addComponent(new BlackSheepGameEngine.CollisionComponent(new BlackSheepGameEngine.Rectangle(0,0,64,64)));

        this.addBehavior(new BlackSheepGameEngine.DrawCSSBehavior(this));
    }
}

class Camera extends BlackSheepGameEngine.Entity {
    constructor() {
        this.addEventListener('move', function(eventArgs) {
            //get the move coordinates (x, y and z)
            //change position of each entities 
            //window.gameEngine.entities 
        })
    }
}

window.gameEngine = new BlackSheepGameEngine.BlackSheepGameEngine();
document.documentElement.addEventListener('gameInit', function() {
    for(let i=0; i<32;i++){
        let color = (i<=16)?'green':'red';
        gameEngine.addEntity(new GroundTile((i*64),704, color));
    } 
});

window.addEventListener('load', function() {
    gameEngine.run();
});