import * as BlacksheepGameEngine from  "../../../dist/blacksheepgameengine-build.js";
import Ball from "./sprites/Ball.js";


window.gameEngine = new BlacksheepGameEngine.BlackSheepGameEngine();
document.documentElement.addEventListener('gameInit', function() {
    gameEngine.addEntity(new Ball());
});

window.addEventListener('load', function() {
    gameEngine.run();
});


