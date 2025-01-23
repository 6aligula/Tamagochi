import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import playerRoutes from './routes/playerRoutes'

dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/players', playerRoutes);

// Rutas
app.get('/', (req, res) => res.send({ message: 'Hello World!' }));


export default app;
