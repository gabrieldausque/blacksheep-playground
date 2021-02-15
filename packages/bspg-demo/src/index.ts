import {GameEngine} from '@blacksheep/playground';

console.log('creating game engine')

const game = new GameEngine();

game.run().then(() => {
    console.log('running ....');
});