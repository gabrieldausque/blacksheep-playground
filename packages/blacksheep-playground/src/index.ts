import { globalInstancesFactory } from '@hermes/composition';

export {GameEngine} from './GameEngine';
export {Entity, SerializedEntityContract} from './Entity';
export {Scene, SerializedSceneContract} from './Scene';
export * from './components';
export * from './behaviors';

const g = globalInstancesFactory
globalInstancesFactory.loadExportedClassesFromDirectory(__dirname);
console.log('initialize done');