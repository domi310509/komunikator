const express = require('express');
const cookieParser = require('cookie-parser');
const { register, login, refresh, logout, authenticateAccessToken, authenticateSocketToken } = require('./auth');
const { Server } = require('socket.io');

const app = express();
const PORT = 80;
const server = app.listen(PORT, () => {console.log(`Serwer nasłuchuje na http://localhost:${PORT}`);});

// Middleware do obsługi statycznych plików
app.use(express.static('public'));
app.use('/socket.io', express.static('node_modules/socket.io-client/dist')); // bibliotkea socket.io dla klienta

// Middleware do parsowania JSON
app.use(express.json());

// Middleware do autentykacji
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Serwer działa!');
});

// api endpoints
app.post('/api/register', register);
app.post('/api/login', login);
app.post('/api/token', refresh);
app.post('/api/logout', logout);

// Endpoint, który wymaga tokenu w ciasteczku
app.get('/protected', authenticateAccessToken, (req, res) => {
    res.send(`Hello ${req.user.id}, you are authenticated!`);
});


// IO 
const io = new Server(server, {
    cors: {
        origin: `http://localhost:${PORT}`,  // Wartość odpowiadająca adresowi frontend (np. http://localhost:3000)
        methods: ["GET", "POST"]
    }
});

io.use(authenticateSocketToken);

// Obsługa połączeń Socket.IO
io.on('connection', (socket) => {
    console.log('A user connected');

    // Obsługuje wiadomości
    socket.on('message', (msg) => {
        console.log('Message received: ' + msg);
        socket.emit('message', 'Message received');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// KONIEC IO