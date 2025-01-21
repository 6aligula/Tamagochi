import { Router } from 'express';
import { createPlayer } from '../controllers/playerController';

const router = Router();

router.post('/create', createPlayer);

export default router;
