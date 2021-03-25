import express, {Express, Request, Response} from 'express';
import * as http from "http";

export interface GameServer {
    stop():Promise<void>;
}

export class ExpressGameServer implements GameServer {
    private static app: Express;
    private static server: http.Server;
    private readonly gameId: string;

    static async stop():Promise<void> {
        if(ExpressGameServer.server)
            ExpressGameServer.server.close(() => {
                console.log('GameServer', 'Stop listening');
            })
    }

    //TODO define the scene serialized contract to define the type for the sceneEndPoint
    constructor(gameId:string, gameEndpoint:any) {
        this.gameId = gameId;
        if(!ExpressGameServer.app){
            ExpressGameServer.app = express()
            ExpressGameServer.app.use(express.static('public'))
            ExpressGameServer.app.get('/', (req:any, res:any) => {
                res.sendFile('index.html');
            })
            ExpressGameServer.server = ExpressGameServer.app.listen(3000, () => {
                console.log('listening to player connection');
            })
            //TODO : open socket io endpoint to notify each client the change of state for each entities
        }
        ExpressGameServer.app.get(`/${gameId}`, (req:Request, res:Response) => {
            res.send(gameEndpoint());
        })
    }

    async stop():Promise<void> {
        ExpressGameServer.app.use(`/${this.gameId}`, (req:Request, res:Response) => {
            res.statusMessage = `the game with id ${this.gameId} is stopped`;
            res.status(404).end();
        })
    }

}