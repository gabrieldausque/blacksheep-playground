import axios, {AxiosInstance} from "axios";

export class GameEngineProxy {

    private webClient:AxiosInstance
    private readonly url: string;

    constructor(url?:string) {
        this.url = url?url:window.location.origin;
        this.webClient = axios.create();
    }

    async run():Promise<void> {
        const currentSceneSerialized = await this.webClient.post(
            `${this.url}/Game`
        )
        console.log(currentSceneSerialized);
    }

}