import { Router } from 'express';
import { createPlayer, getAllPlayers } from '../controllers/playerController';

const router = Router();

router.post('/create', createPlayer);
router.get('/list', getAllPlayers);

export default router;
