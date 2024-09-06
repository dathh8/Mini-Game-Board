const express = require('express');

const app = express();
const xo = express.Router();

xo.get('/create-room', function(req, res) {
    const { roomId } = req.body;
    if (!roomId || typeof roomId !== 'string' || roomId.trim() === '') {
      return res.status(400).json({ message: 'Invalid Room ID' });
    }
  
    if (rooms[roomId]) {
      return res.status(400).json({ message: 'Room ID already exists' });
    }
  
    rooms[roomId] = createNewRoom(roomId);
    console.log(`Room ${roomId} created`);
    res.status(200).json({ roomId });
});


module.exports = xo;