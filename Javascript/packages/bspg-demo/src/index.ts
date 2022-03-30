import {GameEngine} from '@blacksheep/playground';
import { globalInstancesFactory } from '@hermes/composition';

globalInstancesFactory.loadExportedClassesFromDirectory(`${__dirname}/Sprites`);

const game = new GameEngine();

game.run().then(() => {
});