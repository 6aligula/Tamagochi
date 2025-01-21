import { DefaultEventsMap, Server } from 'socket.io';
import http from 'http';
import { Directions, Player, PlayerStates } from '../player/entities/Player';
import { GameService } from '../game/GameService';

export class ServerService {
    private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null;
    private active : boolean;

    private static instance: ServerService;
    private constructor() {
        this.io = null;
        this.active = false;
    };

    static getInstance(): ServerService {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ServerService();
        return this.instance;
    }

    public init(httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
        this.io = new Server(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });
        this.active = true;

        this.io.on('connection', (socket) => {
            socket.emit("connectionStatus", { status: true });
            const player: Player = {
                id: socket,
                x: 0,
                y: 0,
                state: PlayerStates.Idle,
                direction: Directions.Up,
                visibility: true
            }
            
            GameService.getInstance().addPlayer(player);
            
            socket.on('disconnect', () => {
                console.log('Un cliente se ha desconectado:', socket.id);
            });
        });

    }

    public gameStartMessage() {
        //
    }

    public isActive() {
        return this.active;
    }
}