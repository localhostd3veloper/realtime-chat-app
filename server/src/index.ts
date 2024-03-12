import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import router from './router';
import { Server } from 'socket.io';
const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(morgan('dev'));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`User Connected : ${socket.id}`);
  socket.on('new_message', (data) => {
    socket.broadcast.emit('receive_message', data);
  });
});

server.listen(8080, () => {
  console.log('Server Running on http://localhost:8080/');
});

app.use('/', router());
