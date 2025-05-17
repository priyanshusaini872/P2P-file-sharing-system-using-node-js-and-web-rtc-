
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

io.on('connection', socket => {
  socket.on('file', data => {
    socket.broadcast.emit('file', data);
  });
  socket.on('chat', msg => {
    socket.broadcast.emit('chat', msg);
  });
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
