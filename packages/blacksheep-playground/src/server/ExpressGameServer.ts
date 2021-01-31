import express, {Express} from 'express';

export class ExpressGameServer {
    private app: Express;
    constructor(entityEndpoint:any) {
        this.app = express()
        this.app.get('/entity/', (req:any, res:any) => {
            res.send(entityEndpoint())
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