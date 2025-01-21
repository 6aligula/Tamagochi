import { Request, Response } from 'express';
import Player from '../models/Player';
import { PlayerService } from '../services/PlayerService';

export const createPlayer = async (req: Request, res: Response) => {
    try {
        const playerData = req.body;
        const newPlayer = await PlayerService.createPlayer(playerData);
        return res.status(201).json(newPlayer);
    } catch (error) {
        return res.status(500).json({ error: 'Error al crear el jugador' });
    }
};
