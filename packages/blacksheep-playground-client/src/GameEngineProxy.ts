import axios, {AxiosInstance} from "axios";
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
            this.initScene(object);
        })
        this.socket.on('NewScene', async(scene:any) => {
            this.initScene(scene);
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

    initScene(scene: any) {
        let sceneCss = <HTMLLinkElement>document.getElementById('current-scene');
        if(!sceneCss)
        {
            sceneCss = <HTMLLinkElement>document.createElement('link');
            sceneCss.id = 'current-scene';
            sceneCss.rel = 'stylesheet';
            document.querySelector('head').append(sceneCss);
        }
        if(scene.key)
            sceneCss.href = `public/${scene.key}.css`;
        const screen = document.getElementById('screen');
        screen.innerText = '';
        this.entities = [];
        for(const entity of scene.entities){
            const e = new EntityProxy();
            e.deserialize(entity)
            this.entities.push(e)
            e.on('EventRaised', async (arg) => {
                this.socket.emit('EventRaised',arg);
            })
        }
    }
}