const chatContainer = document.getElementById('chat-container');
const input = document.getElementById('chat-input');
const list = document.getElementById('chat-messages');
const userList = document.getElementById('user-list');
const sidebar = document.getElementById('sidebar');
const usernameDisplay = document.getElementById('username-display');
const usernameInput = document.getElementById('username-input');
const usernameSubmit = document.getElementById('username-submit');
const chatSubmit = document.getElementById('chat-submit');
const chatForm = document.getElementById('chat-form');
const socket = io.connect('https://jubilant-octo-chainsaw.herokuapp.com/');

let username = '';

function setUsername() {
  const trimmedUsername = usernameInput.value.trim();
  if (trimmedUsername.length >= 2 && trimmedUsername.length <= 15) {
    username = trimmedUsername;
    chatContainer.style.display = 'flex';
    usernameContainer.style.display = 'none';
    socket.emit('username', username);
  } else {
    alert('Username must be between 2 and 15 characters.');
  }
}

usernameSubmit.addEventListener('click', setUsername);
usernameInput.addEventListener('keydown', (event) => {
  if (event.keyCode === 13 || event.key === 'Enter') {
    setUsername();
  }
});

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('message', ({ message, sender }) => {
  const li = document.createElement('li');
  li.innerHTML = `<strong>${sender}:</strong> ${message}`;
  list.appendChild(li);
});

socket.on('userList', (users) => {
  userList.innerHTML = '';
  for (const user of users) {
    const li = document.createElement('li');
    li.textContent = user;
    userList.appendChild(li);
  }
});

function sendMessage() {
  const text = input.value.trim();
  if (text !== '') {
    socket.emit('message', text);
    input.value = '';
  }
}

chatSubmit.addEventListener('click', sendMessage);
chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  sendMessage();
});

input.addEventListener('keydown', (event) => {
  if (event.keyCode === 13 || event.key === 'Enter') {
    event.preventDefault();
    sendMessage();
  }
});
