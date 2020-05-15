import * as BlacksheepGameEngine from "./blacksheepgameengine-build.js";
import {Entity, BodyComponent, ImageComponent, DrawImageBehavior} from "./blacksheepgameengine-build.js";
import {getRandomInt} from "./blacksheepgameengine-build.js";

window.gameEngine = new BlacksheepGameEngine.BlackSheepGameEngine();

class GrassTile extends Entity {
    constructor(x, y){
        super();
        this.addComponent(new BodyComponent( x,y,0,32,32));
        const image = new ImageComponent('images/grass-tileset-Sheet.png', 1,4);
        this.addComponent(image);
        image.currentImage.x = getRandomInt(0,3);
        this.addBehavior(new DrawImageBehavior(this));
    }
}

document.documentElement.addEventListener('gameInit', function() {
    for(let x=0;x<(1024);x+=32){
        for(let y=0;y<(768);y+=32) {
            gameEngine.addEntity(new GrassTile(x, y))
        }

    }
});

window.addEventListener('load', function() {
    gameEngine.run();
});