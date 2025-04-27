const express = require('express');
const cookieParser = require('cookie-parser');
const { register, login, refresh, logout, authenticateAccessToken } = require('./auth');

const app = express();
const PORT = 80;

// Middleware do obsługi statycznych plików
app.use(express.static('public'));

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
app.post('/api/refresh', refresh);
app.post('/api/logout', logout);

// Endpoint, który wymaga tokenu w ciasteczku
app.get('/protected', authenticateAccessToken, (req, res) => {
    res.send(`Hello ${req.user.id}, you are authenticated!`);
});

// odpal server
app.listen(PORT, () => {
    console.log(`Serwer nasłuchuje na http://localhost:${PORT}`);
});