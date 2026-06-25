const http = require('http');
const express = require('express');
const app = express();
const WebSocket = require('ws');
const handleWebSocketConnection = require('./websocketHandler');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', handleWebSocketConnection);

// Prevent unhandled errors on the wss instance from crashing the process
wss.on('error', (err) => {
  if (err.code !== 'EADDRINUSE') {
    console.error('WebSocket error:', err);
  }
});

const startWebSocketServer = (port) => {
  // Attach error listener BEFORE calling listen
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} in use, trying port ${port + 1}...`);
      startWebSocketServer(port + 1);
    } else {
      console.error('WebSocket server error:', err);
      process.exit(1);
    }
  });

  server.listen(port, () => {
    console.log(`WebSocket Server is running on http://localhost:${port}`);
  });
};

startWebSocketServer(3001);

module.exports = server;
