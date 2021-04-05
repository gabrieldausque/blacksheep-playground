import {GameEngineProxy} from "./GameEngineProxy";

const currentGame = new GameEngineProxy();

(window as any).currentGame = currentGame;
currentGame.run().then(() => {

})



