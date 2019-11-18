import * as BlackSheepGameEngine from "./blacksheepgameengine-build.js"
import Tentacles from "./Tentacles.js";

window.gameEngine = new BlackSheepGameEngine.BlackSheepGameEngine();
document.documentElement.addEventListener('gameInit', function() {
    gameEngine.addEntity(new Tentacles());
});

window.addEventListener('load', function() {
    gameEngine.run();
});

