import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get('/', (req, res) => res.send({ message: 'Hello World!' }));

export default app;
