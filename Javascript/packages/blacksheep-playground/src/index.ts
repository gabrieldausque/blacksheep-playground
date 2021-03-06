import { globalInstancesFactory } from '@hermes/composition';
import {ExpressGameServer} from "./server/ExpressGameServer";
import {GameEngine} from "./GameEngine";
import {Request, Response} from "express";
import * as path from "path";
import * as fs from "fs";

export {GameEngine} from './GameEngine';
export {Entity, SerializedEntityContract} from './Entity';
export {Scene, SerializedSceneContract} from './Scene';
export * from './components';
export * from './behaviors';

globalInstancesFactory.loadExportedClassesFromDirectory(__dirname);

const customBehaviorsDirectory = `${process.cwd()}/behaviors`;
const customComponentsDirectory = `${process.cwd()}/components`;
if(fs.existsSync(customBehaviorsDirectory)){
    globalInstancesFactory.loadExportedClassesFromDirectory(customBehaviorsDirectory);
}
if(fs.existsSync(customComponentsDirectory)) {
    globalInstancesFactory.loadExportedClassesFromDirectory(customComponentsDirectory)
}
globalInstancesFactory.loadExportedClassesFromDirectory(process.cwd())
