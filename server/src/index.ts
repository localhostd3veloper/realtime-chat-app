import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import { Server } from 'socket.io';

// workers
import cluster from 'cluster';
import os from 'os';
import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';
import { setupWorker, setupMaster } from '@socket.io/sticky';

import router from './router';

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

if (cluster.isPrimary) {
  const httpServer = http.createServer();

  // setup sticky sessions
  setupMaster(httpServer, {
    loadBalancingMethod: 'least-connection',
  });
  // setup primary
  setupPrimary();

  cluster.setupPrimary({
    serialization: 'advanced',
  });

  httpServer.listen(8080, () => {
    console.log(`Primary ${process.pid} started listening on port 8080`);
  });

  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
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

  // use the cluster adapter
  io.adapter(createAdapter());

  // setup connection with the primary process
  setupWorker(io);

  // Socket io: It listens to 'connection' event
  io.on('connection', (socket) => {
    socket.on('new_message', (data) => {
      if (data.roomID) {
        socket.to(data.roomID).emit('receive_message', data.message);
        return;
      }
      // We use this to send message to everyone excluding the sender
      // socket.broadcast.emit('receive_message', data.message);
    });

    socket.on('join_room', (data) => {
      socket.join(data.roomID);
      socket.to(data.roomID).emit('user_joined', data.username);
    });
  });

  app.use('/', router());
}
