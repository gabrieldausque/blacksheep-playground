import {GameEngineProxy} from "./GameEngineProxy";

alert(`Hello world from ${window.location.origin}`);

const currentGame = new GameEngineProxy();

//TODO : create the player object and add it to the game engine proxy

(window as any).currentGame = currentGame;

currentGame.run().then(() => {
    console.log('Game Started');
})


