const uuidv4 = require("uuid").v4;
const mappingSocketService = require('./router')

// Maintain active connections and users
const clients = {};
const clientsClassHandle = {};
const users = {};
let userActivity = [];

function handlerConnectSocket(connection) {
    const userId = uuidv4();

    clients[userId] = connection;
    connection.on("message", (message) =>
      processReceivedMessage(connection, message, userId),
    );
    connection.on("close", () => handleClientDisconnection(userId));
}

function processReceivedMessage(connection, message, userId) {
    let msgObject = JSON.parse(message),
        typeOfConnect = msgObject.game,
        classHandler = clientsClassHandle[userId] ?? mappingSocketService[typeOfConnect] ?? null;
    if (clientsClassHandle[userId] === undefined) {
        clientsClassHandle[userId]= classHandler;
    }
    
    if (classHandler === null) {
        return;
    }
    classHandler(connection, msgObject, userId, clients)
}

function handleClientDisconnection(userId) {
    let classHandler = clientsClassHandle[userId];
    console.log(userId + ' disconnected');
    if ((classHandler !== undefined) && (classHandler !== null)) {
        classHandler(clients[userId], { type: 'disconnected'}, userId, clients)
    }
    delete clients[userId];

}

module.exports = handlerConnectSocket;