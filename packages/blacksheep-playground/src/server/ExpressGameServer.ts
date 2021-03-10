import express, {Express} from 'express';

export class ExpressGameServer {
    private app: Express;
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
        this.app.listen(3000, () => {
            console.log('listening to player connection');
        })
    }
}