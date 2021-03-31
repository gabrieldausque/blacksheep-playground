import { globalInstancesFactory } from '@hermes/composition';
import {ExpressGameServer} from "./server/ExpressGameServer";
import {GameEngine} from "./GameEngine";
import {Request, Response} from "express";

export {GameEngine} from './GameEngine';
export {Entity, SerializedEntityContract} from './Entity';
export {Scene, SerializedSceneContract} from './Scene';
export * from './components';
export * from './behaviors';

globalInstancesFactory.loadExportedClassesFromDirectory(__dirname);

//TODO : use factory to get Server initializer object
ExpressGameServer.initApplication();
const runningGames = new Array<GameEngine>()
ExpressGameServer.app.post('/Game', async (req:Request, res:Response) => {
    //TODO : add the player from the request on the new GameEngine
    if(req.method === 'POST' || req.method === 'post'){
        const game = new GameEngine();
        runningGames.push(game);
        await game.run();
        res.status(201).send(game.getCurrentScene());
    }
});

//TODO : manage the join Game endpoint
