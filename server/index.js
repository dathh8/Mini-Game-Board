// create a new express app
const express = require('express');
const env = require('./etc/env');
const app = express();
const port = env.port;
const portWebsocket = env.ws_port;
const routers = require('./routers/routers');
const webSocketService = require('./src/services/websocket/webSocketService');
const socketIo = require('socket.io');
const http = require("http");
const uuidv4 = require("uuid").v4;


const { WebSocket, WebSocketServer } = require("ws");
// Create an HTTP server and a WebSocket server
const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const io = socketIo(server);

Object.keys(routers.MAPPING_ROUTERS).forEach(function(key, idx, arr){
    app.use(key, routers.MAPPING_ROUTERS[key])
});

// make the app listen to port 3000
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    }
);
// Start the WebSocket server
server.listen(portWebsocket, () => {
    console.log(`WebSocket server is running on port ${portWebsocket}`);
  });

// Handle new client connections
wsServer.on("connection", function handleNewConnection(connection) {
  webSocketService(connection)
});

// Handle socket.io connections
io.on('connection', (socket) => {
  webSocketService(socket)
});