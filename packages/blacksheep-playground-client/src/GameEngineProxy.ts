import axios, {AxiosInstance} from "axios";
import EventEmitter = require("events");
import  * as io from 'socket.io-client';
export class GameEngineProxy {

    private webClient:AxiosInstance
    private readonly url: string;
    private gameId?:string;
    private socket:any;

    constructor(url?:string) {
        this.url = url?url:window.location.origin;
        this.webClient = axios.create();
    }

    async run():Promise<void> {
        const response = await this.webClient.post<string>(
            `${this.url}/Game`
        )
        this.gameId = response.data;
        this.socket = io(this.url.replace('http','ws'));
        this.socket.on('connect',async() => {
            this.socket.emit('Join', this.gameId);
            console.log('connection to game engine done');
        });
        this.socket.on('Update', (event) => {
            //Update local object received, set them to dirty, for drawing them;
        });
    }


}