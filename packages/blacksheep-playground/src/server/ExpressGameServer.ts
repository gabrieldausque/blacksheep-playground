import express, {Express, Request, Response} from 'express';
import * as http from "http";
import {Server, Socket} from "socket.io";
import EventEmitter from "events";
import {SerializedSceneContract} from "../Scene";

export interface GameServer {
    stop():Promise<void>;
}

export class ExpressGameServer
    extends EventEmitter
    implements GameServer {
    private static app: Express;
    private static server: http.Server;
    private static serverSocket: Server;
    private readonly gameId: string;

    static async stop():Promise<void> {
        if(ExpressGameServer.server)
            ExpressGameServer.server.close(() => {
                console.log('GameServer', 'Stop listening');
            })
    }

    //TODO define the scene serialized contract to define the type for the sceneEndPoint
    constructor(gameId:string, gameEndpoint:any) {
        super();
        this.gameId = gameId;
        if(!ExpressGameServer.app){
            ExpressGameServer.app = express()
            ExpressGameServer.app.use(express.static('public'))
            ExpressGameServer.app.get('/', (req:Request, res:Response) => {
                res.sendFile('index.html');
            })
            ExpressGameServer.server = ExpressGameServer.app.listen(3000, () => {
                console.log('listening to player connection');
            })
            //TODO : open socket io endpoint to notify each client the change of state for each entities
            ExpressGameServer.serverSocket = new Server(ExpressGameServer.server);
        }
        ExpressGameServer.app.get(`/${gameId}`, (req:Request, res:Response) => {
            res.send(gameEndpoint());
        })

        ExpressGameServer.serverSocket.on(`${gameId}.Client.Update`, (data) => {
            //TODO : push update to the client server object update state queue, to be applied on update cycle ;
            this.emit('Client.Update',data);
        })
    }

    async stop():Promise<void> {
        ExpressGameServer.app.use(`/${this.gameId}`, (req:Request, res:Response) => {
            res.statusMessage = `the game with id ${this.gameId} is stopped`;
            res.status(404).end();
        })
    }

    async sendUpdate(frame:{
        frameState:Date,
        scene:SerializedSceneContract
                     }) {
        ExpressGameServer.serverSocket.to(this.gameId).emit('Update', frame);
    }

}