import express, {Express} from 'express';
import * as http from "http";

export interface GameServer {
    stop():Promise<void>;
}

export class ExpressGameServer implements GameServer {
    private app: Express;

    private server: http.Server;

    //TODO define the scene serialized contract to define the type for the sceneEndPoint
    constructor(sceneEndPoint:any) {
        this.app = express()
        this.app.get('/scenes/', (req:any, res:any) => {
            res.send(sceneEndPoint())
        })
        this.app.use(express.static('public'))
        this.app.get('/', (req:any, res:any) => {
            res.sendFile('index.html');
        })
        //TODO : open socket io endpoint to notify each client the change of state for each entities
        this.server = this.app.listen(3000, () => {
            console.log('listening to player connection');
        })
    }

    async stop():Promise<void> {
        if(this.server)
            this.server.close(() => {
                console.log('GameServer', 'Stop listening');
            })
    }
}