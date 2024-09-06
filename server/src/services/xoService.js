// Object to store all game rooms
let rooms = {};
rooms[1] = {
  roomId: 1,
    players: [],
    symbols: new Map(),
    cells: {},
    currentPlayer: 'X',
    minRow: 0,
    maxRow: 0,
    minCol: 0,
    maxCol: 0,
    winner: null,
}

function handleXoGame(ws, message, userId, clients) {
  const { type, payload } = message;

  switch (type) {
    case 'initializeClient':
      handleInitializeClient(ws);
      break;
    case 'joinGame':
      handleJoinGame(ws, payload);
      break;
    case 'makeMove':
      handleMakeMove(ws, payload);
      break;
    case 'disconnected':
      handleDisconnect(ws);
      break;
    case 'resetGame':
      handleResetGame(ws, payload);
    break;
    default:
      console.log('Unknown message type:', type);
  }
}

function handleInitializeClient(ws) {
  // Perform any necessary initialization for the client
  console.log('Client initialization message received');

  // Send acknowledgment back to the client
  ws.send(JSON.stringify({ type: 'initializeClientAck', payload: {} }));
}

function handleJoinGame(ws, { roomId }) {
  if (rooms[roomId]) {
    const room = rooms[roomId];
    addPlayerToRoom(ws, room);
  } else {
    ws.send(JSON.stringify({ type: 'roomNotFound' }));
  }
}

function handleMakeMove(ws, { roomId, move }) {
  const room = rooms[roomId];
  if (room) {
    processPlayerMove(ws, room, move);
  }
}

function handleDisconnect(ws) {
  for (const roomId in rooms) {
    const room = rooms[roomId];
    removePlayerFromRoom(ws, room);
    if (room.players.length === 0) {
      delete rooms[roomId];
      console.log(`Room ${roomId} deleted`);
    }
  }
}

// Function to create a new game room
function createNewRoom(roomId) {
  return {
    roomId: roomId,
    players: [],
    symbols: new Map(),
    cells: {},
    currentPlayer: 'X',
    minRow: 0,
    maxRow: 0,
    minCol: 0,
    maxCol: 0,
    winner: null,
  };
}

// Function to add a player to a room
function addPlayerToRoom(ws, room) {
  if (room.players.length < 2) {
    room.players.push(ws);
    const symbol = room.players.length === 1 ? 'X' : 'O';
    room.symbols.set(ws, symbol);
    ws.send(JSON.stringify({ type: 'playerAssigned', payload: symbol }));
    console.log(`Player assigned symbol ${symbol} in room ${room.roomId}`);

    if (room.players.length === 2) {
      broadcastToRoom(room, { type: 'startGame' });
    }
  } else {
    ws.send(JSON.stringify({ type: 'roomFull' }));
  }
}

// Function to process a player's move
function processPlayerMove(ws, room, move) {
  if (!room.winner) {
    const { row, col, player } = move;
    const key = `${row},${col}`;

    // Check if the cell is already occupied
    if (room.cells[key]) return;

    // Ensure it's the player's turn
    if (room.symbols.get(ws) !== room.currentPlayer) return;

    room.cells[key] = player;

    // Update grid boundaries
    room.minRow = Math.min(room.minRow, row);
    room.maxRow = Math.max(room.maxRow, row);
    room.minCol = Math.min(room.minCol, col);
    room.maxCol = Math.max(room.maxCol, col);

    // Check for a win
    if (checkWin(room.cells, row, col, player)) {
      room.winner = player;
      broadcastToRoom(room, { type: 'gameUpdate', payload: { cells: room.cells, winner: room.winner } });
    } else {
      // Switch to the next player
      room.currentPlayer = player === 'X' ? 'O' : 'X';
      broadcastToRoom(room, { type: 'gameUpdate', payload: { cells: room.cells, winner: null } });
    }
  }
}

// Function to remove a player from a room
function removePlayerFromRoom(ws, room) {
  room.players = room.players.filter((playerWs) => playerWs !== ws);
  room.symbols.delete(ws);
}

// Function to broadcast a message to all players in a room
function broadcastToRoom(room, message) {
  const data = JSON.stringify(message);
  room.players.forEach((playerWs) => {
    // if (playerWs.readyState === WebSocket.OPEN) {
      playerWs.send(data);
    // }
  });
}

// Function to check for a win condition
function checkWin(cells, row, col, player) {
  const directions = [
    [0, 1],   // Horizontal
    [1, 0],   // Vertical
    [1, 1],   // Diagonal \
    [1, -1],  // Diagonal /
  ];
  const winLength = 5;

  for (let [dx, dy] of directions) {
    let count = 1;

    // Check forward direction
    let r = row + dx;
    let c = col + dy;
    while (cells[`${r},${c}`] === player) {
      count++;
      r += dx;
      c += dy;
    }

    // Check backward direction
    r = row - dx;
    c = col - dy;
    while (cells[`${r},${c}`] === player) {
      count++;
      r -= dx;
      c -= dy;
    }

    if (count >= winLength) {
      return true;
    }
  }
  return false;
}

function handleResetGame(ws, { roomId }) {
  const room = rooms[roomId];
  if (room) {
    // Reset the game state
    room.cells = {};
    room.winner = null;
    room.currentPlayer = 'X'; // or 'O', depending on your game's logic
    room.minRow = 0;
    room.maxRow = 0;
    room.minCol = 0;
    room.maxCol = 0;

    // Notify all players in the room
    broadcastToRoom(room, {
      type: 'gameReset',
    });

    // Optionally, send a gameUpdate message to update the game state on clients
    broadcastToRoom(room, {
      type: 'gameUpdate',
      payload: {
        cells: room.cells,
        winner: room.winner,
        currentPlayer: room.currentPlayer,
      },
    });
  } else {
    // The room does not exist
    ws.send(JSON.stringify({ type: 'roomNotFound' }));
  }
}

module.exports = handleXoGame;