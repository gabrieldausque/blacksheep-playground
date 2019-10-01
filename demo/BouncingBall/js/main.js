import * as BlacksheepGameEngine from  "../../../dist/blacksheepgameengine-build.js";

class ground extends BlacksheepGameEngine.Entity {
    constructor() {
        super();
        this.addComponent(new BlacksheepGameEngine.BodyComponent(0,0,0,48,48));
        this.addComponent(new BlacksheepGameEngine.ImageComponent('Soccer_ball.svg' ))
    }
}