import React, { useState, useEffect } from 'react';
import './style.css';
import axios from 'axios';

function Game() {
  const [cells, setCells] = useState({});
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [inputRoomId, setInputRoomId] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [ws, setWs] = useState(null);

  const [initialMessageSent, setInitialMessageSent] = useState(false);

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  const createRoom = async () => {
    try {
      setIsCreatingRoom(true);
      const response = await axios.get('http://localhost:4000/create-room');
      const newRoomId = response.data.roomId;
      setRoomId(newRoomId);
      connectWebSocket(newRoomId);
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const joinRoom = () => {
    if (inputRoomId.trim() !== '') {
      setRoomId(inputRoomId.trim());
      connectWebSocket(inputRoomId.trim());
    }
  };

  const connectWebSocket = (roomId) => {
    const socket = new WebSocket(process.env.REACT_APP_WEB_SOCKET_URL);

    socket.onopen = () => {
      console.log('WebSocket connected');

      // if (!initialMessageSent) {
      //   socket.send(JSON.stringify({ type: 'initializeClient', payload: {} }));
      //   setInitialMessageSent(true);
      // }

      socket.send(JSON.stringify({ type: 'joinGame', game: 'xo', payload: { roomId } }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const { type, payload } = message;

      switch (type) {
        case 'playerAssigned':
          setPlayerSymbol(payload);
          break;
        case 'startGame':
          setGameStarted(true);
          break;
        case 'roomFull':
          setErrorMessage('Room is full. Please join a different room or create a new one.');
          // Close the WebSocket connection since the room is full
          socket.close();
          break;
        case 'roomNotFound':
          setErrorMessage('Room not found. Please check the Room ID and try again.');
          // Close the WebSocket connection since the room doesn't exist
          socket.close();
          break;
        case 'gameUpdate':
          setCells(payload.cells);
          setWinner(payload.winner);
          setCurrentPlayer((prev) => (prev === 'X' ? 'O' : 'X'));
          break;
        case 'gameReset':
          // Reset the local game state
          setCells({});
          setWinner(null);
          setCurrentPlayer('X'); // or 'O', depending on your logic
          break;
        case 'initializeClientAck':
          console.log('Server acknowledged client initialization');
          break;
        default:
          console.log('Unknown message type:', type);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      // Reset the game state if there was an error
      if (errorMessage) {
        setRoomId('');
        setPlayerSymbol(null);
        setGameStarted(false);
      }
    };

    setWs(socket);
  };

  const handleClick = (row, col) => {
    if (!gameStarted || winner || currentPlayer !== playerSymbol) return;

    const key = `${row},${col}`;
    if (cells[key]) {
      return; // Cell already occupied
    }

    // Send move to server
    ws.send(
      JSON.stringify({
        type: 'makeMove',
        payload: {
          roomId,
          move: { row, col, player: playerSymbol },
        },
      })
    );
  };

  const renderGrid = () => {
    const keys = Object.keys(cells);
    const positions = keys.map((key) => key.split(',').map(Number));

    const rows = [];
    let minRow = 0,
      maxRow = 0,
      minCol = 0,
      maxCol = 0;

    if (positions.length > 0) {
      minRow = Math.min(...positions.map((pos) => pos[0]));
      maxRow = Math.max(...positions.map((pos) => pos[0]));
      minCol = Math.min(...positions.map((pos) => pos[1]));
      maxCol = Math.max(...positions.map((pos) => pos[1]));
    }

    for (let row = minRow - 2; row <= maxRow + 2; row++) {
      const cols = [];
      for (let col = minCol - 2; col <= maxCol + 2; col++) {
        const key = `${row},${col}`;
        cols.push(
          <div
            key={key}
            className="cell"
            onClick={() => handleClick(row, col)}
          >
            {cells[key]}
          </div>
        );
      }
      rows.push(
        <div key={row} className="row">
          {cols}
        </div>
      );
    }
    return rows;
  };

  const resetGame = () => {
    // Send resetGame message to the server
    ws.send(
      JSON.stringify({
        type: 'resetGame',
        payload: {
          roomId,
        },
      })
    );
  };

  if (!roomId) {
    return (
      <div className="game">
        <h1>Unlimited Tic-Tac-Toe</h1>
        <button onClick={createRoom} disabled={isCreatingRoom}>
          {isCreatingRoom ? 'Creating Room...' : 'Create New Game'}
        </button>
        <div>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={inputRoomId}
            onChange={(e) => {
              setInputRoomId(e.target.value);
              setErrorMessage(''); // Reset error message
            }}
          />
          <button onClick={joinRoom}>Join Game</button>
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>
    );
  }

  return (
    <div className="game">
      <h1>Unlimited Tic-Tac-Toe</h1>
      <p>Room ID: {roomId}</p>
      {playerSymbol ? (
        <p>Your symbol: {playerSymbol}</p>
      ) : (
        <p>Waiting for symbol assignment...</p>
      )}
      {gameStarted ? (
        winner ? (
          <h2>Player {winner} wins!</h2>
        ) : (
          <p>Current Player: {currentPlayer}</p>
        )
      ) : (
        <p>Waiting for another player...</p>
      )}
      <div className="grid">{renderGrid()}</div>
      {winner && (
        <button className="reset-button" onClick={resetGame}>
          Play Again
        </button>
      )}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
}

export default Game;
