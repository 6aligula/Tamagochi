import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = process.env.MONGODB_URL || 'mongodb://mongo:27017';
console.log('MongoDB URL:', MONGO_URL);
/**
 * Función para conectar a MongoDB.
 */
export const connectToDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('Connected to MongoDB');

        // Manejo de eventos de conexión
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connection established');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB connection lost');
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

/**
 * Función para inicializar la base de datos y colecciones.
 */
export const initializeDatabase = async (): Promise<void> => {
    try {
        const db = mongoose.connection.useDb('game'); // Cambia al contexto de la base de datos 'game'
        const collections = await db.db.listCollections().toArray();

        if (!collections.some((c) => c.name === 'test')) {
            await db.createCollection('test'); // Crea una colección inicial
            console.log('Database "game" and collection "test" created.');
        } else {
            console.log('Database "game" and collection "test" already exist.');
        }
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};
