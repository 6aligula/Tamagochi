import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { ServerService } from './server/ServerService';
import { connectToDatabase } from './config/database';

// Conectar a MongoDB
connectToDatabase();

const PORT = process.env.PORT || 3000;
const httpServer = http.createServer(app);
const io = new Server(httpServer);

ServerService.getInstance().init(io);

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
