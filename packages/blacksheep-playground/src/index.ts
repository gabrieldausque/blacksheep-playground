import { globalInstancesFactory } from '@hermes/composition';
import {ExpressGameServer} from "./server/ExpressGameServer";
import {GameEngine} from "./GameEngine";

export {GameEngine} from './GameEngine';
export {Entity, SerializedEntityContract} from './Entity';
export {Scene, SerializedSceneContract} from './Scene';
export * from './components';
export * from './behaviors';

globalInstancesFactory.loadExportedClassesFromDirectory(__dirname);

//TODO : use factory to get Server initializer object
const initGame = new GameEngine();
initGame.stop().then(() => {
    console.log('initialize done');
})