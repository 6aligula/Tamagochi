import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/game';

export const connectToDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('🟢 Connected to MongoDB');
    } catch (error) {
        console.error('🔴 Error connecting to MongoDB:', error);
        process.exit(1); // Salir si falla la conexión
    }

    // Eventos para monitorear la conexión
    mongoose.connection.on('connected', () => {
        console.log('🟢 MongoDB connection established');
    });

    mongoose.connection.on('error', (err) => {
        console.error('🔴 MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('🟠 MongoDB connection lost');
    });
};
