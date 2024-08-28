const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

io.on('connection', socket => {
  console.log('New client connected');

  // 클라이언트가 그림을 그리기 시작할 때
  socket.on('startDrawing', () => {
    socket.broadcast.emit('startDrawing');
  });

  // 클라이언트가 그림을 그릴 때마다 좌표 데이터를 받음
  socket.on('drawing', data => {
    // 다른 클라이언트에게 그림 데이터를 브로드캐스트
    socket.broadcast.emit('drawing', data);
  });

  // 클라이언트가 그림을 멈출 때
  socket.on('stopDrawing', () => {
    socket.broadcast.emit('stopDrawing');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
