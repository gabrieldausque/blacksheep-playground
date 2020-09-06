import * as BlackSheepGameEngine from "./blacksheepgameengine-build.js"
import * as TentaclesClass from "./Tentacles.js";

window.gameEngine = new BlackSheepGameEngine.BlackSheepGameEngine();
document.documentElement.addEventListener('gameInit', function() {
    gameEngine.addEntity(new TentaclesClass.Tentacles());
});

window.addEventListener('load', function() {
    gameEngine.run();
});

