const mappingSocketService = require('./router');

// Maintain active connections and users
const clients = {};
const users = {};
let userActivity = [];

function handlerConnectSocket(socket) {
    console.log('New client connected:', socket.id);
  
    clients[socket.id] = socket;
    console.log(`${userId} connected.`);

    connection.on("message", (message) =>
      processReceivedMessage(connection, message, userId),
    );
    connection.on("close", () => handleClientDisconnection(userId));
}

function processReceivedMessage(connection, message, userId) {
    let msgObject = JSON.parse(message),
        typeOfConnect = Object.keys(msgObject)[0],
        classHandler = mappingSocketService[typeOfConnect] ?? null;
    if (classHandler === null) {
        return;
    }
    classHandler(connection, msgObject[typeOfConnect], userId, clients)
}

function handleClientDisconnection(userId) {
    console.log(userId + ' disconnected');
    delete clients[userId];
}

module.exports = handlerConnectSocket;