const http=require('http');
const express=require('express');
const app=express();
const WebSocket =require('ws');
const handleWebSocketConnection=require('./websocketHandler');

const server=http.createServer(app);
const wss=new WebSocket.Server({server});

wss.on('connection',handleWebSocketConnection)

server.listen(3000, () => {
    console.log('WebSocket Server is running on http://localhost:3000');
  });
  
module.exports = server;


