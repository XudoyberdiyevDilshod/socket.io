const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = {}; // Хранилище пользователей

io.on("connection", (socket) => {
  console.log("Пользователь подключился");

  // Пользователь задаёт имя
  socket.on("set username", (username) => {
    users[socket.id] = username;
    socket.broadcast.emit("user joined", username);
    io.emit("update users", Object.values(users));
  });

  // Получение сообщения
  socket.on("chat message", (msg) => {
    const username = users[socket.id];
    io.emit("chat message", { username, msg });
  });

  // Отключение пользователя
  socket.on("disconnect", () => {
    const username = users[socket.id];
    if (username) {
      delete users[socket.id];
      socket.broadcast.emit("user left", username);
      io.emit("update users", Object.values(users));
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
