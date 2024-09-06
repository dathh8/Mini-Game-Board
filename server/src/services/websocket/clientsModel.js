class ClientManager {
  constructor() {
    this.clients = {}; // userId -> connection
    this.modelClassClients = {}; // modelClass -> { userId -> connection }
  }

  addClient(userId, connection, modelClass) {
    this.clients[userId]['connection'] = connection;

    if (modelClass) {
      if (!this.modelClassClients[modelClass]) {
        this.modelClassClients[modelClass] = {};
      }
      this.modelClassClients[modelClass][userId] = connection;
    }
  }

  removeClient(userId) {
    delete this.clients[userId];

    for (const modelClass in this.modelClassClients) {
      if (this.modelClassClients[modelClass][userId]) {
        delete this.modelClassClients[modelClass][userId];
        if (Object.keys(this.modelClassClients[modelClass]).length === 0) {
          delete this.modelClassClients[modelClass];
        }
        break;
      }
    }
  }

  getClientsByModelClass(modelClass) {
    return this.modelClassClients[modelClass] || {};
  }
}
module.exports = ClientManager;