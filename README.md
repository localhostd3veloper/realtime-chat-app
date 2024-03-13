# Realtime Chat App using React, Node.js, Express, and Socket.io

## Overview

This project is a real-time chat application that allows users to communicate with each other in real time. It uses React and Socket.io for the front end and Node.js and Express for the back end.
- This app works on the principle of rooms, you can create a room on the first screen by entering your username and your own unique `room-id` and sharing the room URL with your friends/family.
- Once they open the shared URL, they will be prompted to enter their `username`.
- A `1 sec` sound is played when a message is sent, to improve user experience.

## Screenshots
![image](https://github.com/localhostd3veloper/realtime-chat-app/assets/64231917/ff0ff307-8b26-477f-85a1-5da19fa08cd6)



## Application Architecture

- Client

  - React (Vite)
  - Tailwind CSS
  - Socket.io (client)

> The Client application is a React application that uses Socket.io to communicate with the Server.

The React Application is built using `Vite` and `Typescript` and styled with `Tailwind CSS`.

- Server
  - Socket.io
  - Express (Node.js)

> The Server application is a `Node.js` application that uses `Socket.io` to communicate with the Client.

### Handling Concurrency

Handling multiple users simultaneously is a common problem in real-time applications.

- Especially when you're using web sockets.

I have used [Cluster Adapter](https://socket.io/docs/v4/cluster-adapter/) for handling concurrency.

- When scaling to `multiple Socket.IO servers`, you will need to replace the default in-memory adapter by another implementation, so the `events` and `requests` are properly `routed` to all `clients`.
- Every packet that is sent to multiple clients `(e.g. io.to("room1").emit() or socket.broadcast.emit())` is also sent to other workers via the IPC channel.
- The above implementation can be seen [here](https://github.com/localhostd3veloper/realtime-chat-app/blob/main/server/src/index.ts#L66)




## Environment Requirements

- [Node.js](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)

## Environment Setup (Linux)

If you're on Linux, it's a cherry on the cake. just run the following commands:

```bash
scripts/setup.sh
```

### Run Server

```bash
scripts/server.sh
```

### Run Client

```bash
scripts/client.sh
```

Alternatively You may follow the below instructions if you're on Windows.

- For more details on how to install Node.js and NPM, please refer to the [Node.js](https://nodejs.org/en/) documentation.

## Installation

- Clone the repository and run

```bash
git clone https://github.com/localhostd3veloper/realtime-chat-app
```

### Client

1. Move to the `client` directory and install the `dependencies`

```bash
cd realtime-chat-app/client && npm install
```

2. Run the Client `application`

```bash
npm run dev
```

### Server

1. Open a new terminal and move to the `server` directory and install the `dependencies`

```bash
cd realtime-chat-app/server && npm install
```

2. Run the Server `application`

```bash
npm run dev
```

## Author

- [Gautam Anand](https://github.com/localhostd3veloper)
