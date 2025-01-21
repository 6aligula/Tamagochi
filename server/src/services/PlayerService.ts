import Player, { IPlayer } from '../models/Player';

export class PlayerService {
    public static async createPlayer(playerData: Partial<IPlayer>): Promise<IPlayer> {
        const newPlayer = new Player(playerData);
        return await newPlayer.save();
    }

    public static async getAllPlayers(): Promise<IPlayer[]> {
        return await Player.find().select('-__v');
    }
}
