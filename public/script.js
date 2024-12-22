const socket = io();

// Элементы
const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const usersList = document.getElementById("users");
const usernameModal = document.getElementById("usernameModal");
const usernameInput = document.getElementById("usernameInput");
const usernameSubmit = document.getElementById("usernameSubmit");

// Вход с именем
usernameSubmit.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if (username) {
    socket.emit("set username", username);
    usernameModal.style.display = "none";
  }
});

// Отправка сообщений
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});

// Получение сообщений
socket.on("chat message", ({ username, msg }) => {
  const item = document.createElement("li");
  item.textContent = `${username}: ${msg}`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

// Уведомления о подключении/отключении
socket.on("user joined", (username) => {
  const item = document.createElement("li");
  item.textContent = `${username} присоединился к чату.`;
  item.style.fontStyle = "italic";
  messages.appendChild(item);
});

socket.on("user left", (username) => {
  const item = document.createElement("li");
  item.textContent = `${username} покинул чат.`;
  item.style.fontStyle = "italic";
  messages.appendChild(item);
});

// Обновление списка пользователей
socket.on("update users", (users) => {
  usersList.innerHTML = "";
  users.forEach((user) => {
    const item = document.createElement("li");
    item.textContent = user;
    usersList.appendChild(item);
  });
});
