const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const handlerRoom = require('./roomHandler')

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173'
  }
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

server.listen(5000)

const rooms = []

io.on('connection', (socket) => {
  console.log(socket.id);
  handlerRoom(io, socket, rooms)
});