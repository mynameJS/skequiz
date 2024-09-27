require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://skequiz.netlify.app'],
    methods: ['GET', 'POST'],
    allowedHeaders: [],
    credentials: false,
  },
});

const PORT = process.env.NODE_SOCKET_URL || 3000;

io.on('connection', socket => {
  console.log('New client connected');

  // 그림을 그리기 시작할 때
  socket.on('startDrawing', () => {
    socket.broadcast.emit('startDrawing');
  });

  // 그림을 그릴 때마다 좌표 데이터를 받음
  socket.on('drawing', drawData => {
    // 다른 클라이언트에게 그림 데이터를 브로드캐스트
    socket.broadcast.emit('drawing', drawData);
  });

  // 그림을 멈출 때
  socket.on('stopDrawing', () => {
    socket.broadcast.emit('stopDrawing');
  });

  // 캔버스를 초기화할 때
  socket.on('clearCanvas', () => {
    socket.broadcast.emit('clearCanvas');
  });

  // 색상 및 선 굵기 업데이트 이벤트
  socket.on('updateContextOption', newContextOption => {
    socket.broadcast.emit('updateContextOption', newContextOption);
  });

  // 색상 채우기 이벤트
  socket.on('fillArea', fillData => {
    socket.broadcast.emit('fillArea', fillData);
  });

  // Todo : undo 기능 추가하기

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
