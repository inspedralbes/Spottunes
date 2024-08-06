import http from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";

import manager from "./comunicationManager.js";

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  path: "/socket",
});

const userSockets = new Map();

io.on("connection", (socket) => {
  socket.on("logged", (userId) => {
    console.log(`Usuario ${userId} se ha conectado`);
    userSockets.set(userId, socket.id);
    console.log(`Usuario ${userId} está asociado con el socket ${socket.id}`);
  });

  socket.on("message", (message, contact) => {
    if (io.sockets.adapter.rooms.get(message.chat_id)?.size == 2) {
      message.status = "leido";
    } else if (userSockets.has(contact)) {
      message.status = "recibido";
    } else {
      message.status = "enviado";
    }
    manager
      .insertMessage(message)
      .then((response) => {
        socket.join(response.chat_id);

        io.to(response.chat_id).emit("message", response);
        if (io.sockets.adapter.rooms.get(response.chat_id)?.size != 2) {
          if (userSockets.has(contact)) {
            io.to(userSockets.get(contact)).emit("notification", response);
          } else {
            console.log("El usuario no está conectado");
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("leaveChat", (chatId) => {
    socket.leave(chatId);
  });

  socket.on("disconnect", () => {
    userSockets.forEach((value, key) => {
      if (value === socket.id) {
        userSockets.delete(key);
      }
    });
    console.log("Usuario desconectado");
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Servidor Socket.IO escuchando en el puerto ${PORT}`);
});
