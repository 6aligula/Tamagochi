import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { connectToDatabase, initializeDatabase } from './config/database';

const PORT = process.env.PORT || 3000;
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// Flujo: conectar y luego inicializar
(async () => {
    try {
        await connectToDatabase(); // Paso 1: Conexión
        await initializeDatabase(); // Paso 2: Inicialización de BD y colecciones
    } catch (error) {
        console.error('Failed to start server due to database error:', error);
        process.exit(1); // Detenemos el proceso si no se puede configurar la base de datos
    }
})();

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
