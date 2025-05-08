import app from './src/app.js';
import config from './src/config/config.js';
import connectDB from './src/db/db.js';
import http from 'http';
import initializeSocket from "./src/socketio/socket.js";

const server = http.createServer(app);

initializeSocket(server);

connectDB();
server.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
})