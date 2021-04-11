import express, {Express, Request, Response} from 'express';
import * as http from "http";
import {Server, Socket} from "socket.io";
import EventEmitter from "events";
import {SerializedSceneContract} from "../Scene";
import * as path from "path";
const nodeModules = require('node_modules-path');
import {v4 as guid} from 'uuid';
import fs from "fs";
import {GameEngine} from "../GameEngine";

export interface GameServer {
    stop():Promise<void>;
}

export class ExpressGameServer
    extends EventEmitter
    implements GameServer {
    static app: Express;
    static server: http.Server;
    private static serverSocket: Server;
    private readonly gameId: string;
    private socketByPlayers: {
        [playerId:string] : Socket;
    }

    static async stop():Promise<void> {
        if(ExpressGameServer.server)
            ExpressGameServer.server.close(() => {
                console.log('GameServer', 'Stop listening');
            })
    }

    static runningGames:Array<GameEngine> = [];

    static async initApplication() : Promise<void> {
        if(!ExpressGameServer.app){
            ExpressGameServer.app = express()
            ExpressGameServer.app.use('/public', express.static('public'));
            ExpressGameServer.app.get(/scripts\/.+js$/,(req:Request, res:Response) => {
                let indexPath = '';
                if(req.path === '/scripts/client.js'){
                    indexPath = path.resolve(`${__dirname}/../client/blacksheep-playground-client.js`);
                    res.sendFile(indexPath);
                    return;
                }
                res.status(404).send(`Script ${req.path} not found.`);
            })
            ExpressGameServer.app.get('/', (req:Request, res:Response) => {
                let indexPath = '';
                indexPath = path.resolve(`${__dirname}/../screen/index.html`);
                res.sendFile(indexPath);
            })
            ExpressGameServer.app.post('/Game', async (req:Request, res:Response) => {
                const game = new GameEngine();
                //TODO : add the player from the request on the new GameEngine
                ExpressGameServer.runningGames.push(game);
                await game.run();
                res.status(201).send(game.id);
            });
            ExpressGameServer.server = ExpressGameServer.app.listen(3000, () => {
                console.log('listening to player connection');
            })
            ExpressGameServer.serverSocket = new Server(ExpressGameServer.server);
        }
    }

    //TODO define the scene serialized contract to define the type for the sceneEndPoint
    constructor(gameId:string, gameEndpoint:any) {
        super();
        this.gameId = gameId;
        this.socketByPlayers = {};

        ExpressGameServer.app.get(`/Game/${gameId}`, (req:Request, res:Response) => {
            res.send(gameEndpoint());
        })

        ExpressGameServer.serverSocket.on(`${gameId}.Client.Update`, (data) => {
            //TODO : push update to the client server object update state queue, to be applied on update cycle ;
            this.emit('Client.Update',data);
        })

        ExpressGameServer.serverSocket.on('connection', (socket) => {
            socket.on('Join',(a:any) => {
                if(a === this.gameId) {
                    socket.join(this.gameId);
                    const playerId = guid();
                    this.socketByPlayers[playerId] = socket;
                    this.emit('Join', playerId);
                }
            })
            socket.on('EventRaised', async (arg:any) => {
                this.emit('EventRaised', arg);
            })
        })

    }

    async stop():Promise<void> {
        ExpressGameServer.app.get(`/Game/${this.gameId}`, (req:Request, res:Response) => {
            res.statusMessage = `the game with id ${this.gameId} is stopped`;
            res.status(404).end();
        })
    }

    async sendUpdate(frame: { gameId: string; frameState: Date; scene: SerializedSceneContract | undefined }) {
        ExpressGameServer.serverSocket.to(this.gameId).emit('Update', frame);
    }

    async send(event:string, ...objects:any):Promise<void>{
        ExpressGameServer.serverSocket.to(this.gameId).emit(event,...objects);
    }

    async sendToPlayer(playerId:string, eventName:string, ...objects:any){
        if(this.socketByPlayers.hasOwnProperty(playerId)){
            this.socketByPlayers[playerId].emit(eventName, playerId, ...objects);
        }
    }
}