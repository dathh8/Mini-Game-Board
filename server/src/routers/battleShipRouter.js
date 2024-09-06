const express = require('express');
const battleShipController = require('../controllers/battleShipController');
const app = express();

const battle_ship_router = express.Router();
const { WebSocket, WebSocketServer } = require("ws");


battle_ship_router.get('/', function(req, res) {
    res.status(200).json({
        users: 'ok',
    });
});


module.exports = battle_ship_router;