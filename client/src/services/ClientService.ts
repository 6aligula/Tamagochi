import { Socket, io } from "socket.io-client";
import { GameService } from "./GameService";
import { Message } from "./entities/Message";

export class ClientService {
  
    private socket : Socket | null;
    private active : boolean;

    private static instance: ClientService;
    private constructor() {
        this.socket = null;
        this.active = false;
    };

    static getInstance(): ClientService {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ClientService();
        return this.instance;
    }

    public init( url: String) {
        this.socket = io("http://localhost:3000");
        this.socket.on("connect", () => {
            this.active = true;
            GameService.getInstance().do({ type: "CONNECTED" , content: ""});
            
        });

        this.socket.on("message", (data)=> {
                GameService.getInstance().do(data);
        })

        this.socket.onAny((event: string, ...args: any[]) => {
            console.log(`Evento recibido: ${event}`, args);
        });

        this.socket.on("disconnect", () => {
            this.active = false;
        });

    }

}