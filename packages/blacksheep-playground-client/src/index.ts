import {GameEngineProxy} from "./GameEngineProxy";

const currentGame = new GameEngineProxy();

//TODO : create the player object and add it to the game engine proxy

(window as any).currentGame = currentGame;

currentGame.run().then(() => {

})



