import axios, {AxiosInstance} from "axios";
import EventEmitter = require("events");
import  * as io from 'socket.io-client';
import {EntityProxy} from "./EntityProxy";
export class GameEngineProxy {

    private webClient:AxiosInstance
    private readonly url: string;
    private gameId?:string;
    private socket:any;
    private entities:Array<EntityProxy>;
    private playerId?:string;

    constructor(url?:string) {
        this.url = url?url:window.location.origin;
        this.webClient = axios.create();
        this.entities = new Array<EntityProxy>();
    }

    async run():Promise<void> {
        const response = await this.webClient.post<string>(
            `${this.url}/Game`
        )
        this.gameId = response.data;
        this.socket = io(this.url.replace('http','ws'));
        this.socket.on('Joined',async(playerId: string, object:any) => {
            console.log('Joined');
            //receive current scene state
            this.playerId = playerId;
            console.log(`Joining with player id ${playerId}`);
            let sceneCss = <HTMLLinkElement>document.getElementById('current-scene');
            if(!sceneCss)
            {
                sceneCss = <HTMLLinkElement>document.createElement('link');
                sceneCss.id = 'current-scene';
                document.querySelector('head').append(sceneCss);
            }
            if(object.key)
                sceneCss.href = `public/${object.key}.css`;
            //TODO : save player entity reference and reinject it in entities list
            this.entities = [];
            for(const entity of object.entities){
                const e = new EntityProxy();
                e.deserialize(entity)
                this.entities.push(e)
            }
        })
        this.socket.on('Update', async(event) => {
            //TODO : Update local object received, set them to dirty, for drawing them;
            const screen = document.getElementById('screen');

            if(screen){
                const newTransform = 'scale(' + (window.innerWidth/(screen.scrollWidth)) + ')';
                if(screen.style.transformOrigin !== 'left center')
                    screen.style.transformOrigin = 'left center';
                if(screen.style.transform !== newTransform)
                    screen.style.transform = newTransform
            }

            for(const e of this.entities){
                await e.draw();
            }
        });
        this.socket.on('connect',async() => {
            this.socket.emit('Join', this.gameId);
            console.log('connection to game engine done');
        });
    }


}