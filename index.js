const express = require('express');
const cookieParser = require('cookie-parser');
const { register, login, refresh, logout, authenticateAccessToken, authenticateSocketToken, logoutById, accountDeletion } = require('./auth');
const { Server } = require('socket.io');
const pool = require('./db');

const app = express();
const PORT = 3000;
const server = app.listen(PORT, '0.0.0.0', () => { console.log(`Serwer nasłuchuje na http://localhost:${PORT}`); });

// Middleware do obsługi statycznych plików
app.use(express.static('public'));
app.use('/socket.io', express.static('node_modules/socket.io-client/dist')); // biblioteka socket.io dla klienta

// Middleware do parsowania JSON
app.use(express.json());

// Middleware do autentykacji
app.use(cookieParser());

// api endpoints
app.post('/api/register', register);
app.post('/api/login', login);
app.post('/api/token', refresh);
app.post('/api/logout', logout);
app.post('/api/logoutAll', authenticateAccessToken, logoutById);
app.post('/api/deleteAccount', authenticateAccessToken, accountDeletion);

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
    console.log(`An user connected: ${socket.user?.id}`);
    // Connect all devices with the same user.id together
    if (socket.user?.id) {
        socket.join(`user_${socket.user.id}`);
    };

    // Obsługuje wiadomości
    socket.on('message', async ({ receiverId, content }) => {
        try {
            const senderId = socket.user.id;
            const [result] = await pool.query(`INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)`, [senderId, receiverId, content]);

            const message = {
                id: result.insertId,
                senderId,
                receiverId,
                content,
                sentAt: new Date()
            };

            io.to(`user_${receiverId}`).emit('message', message);
            socket.emit('message', message);
        } catch (error) {
            console.error("Error when saving message: ", error);
        }
    });

    socket.on('getMessages', async ({ withUserId }) => {
        try {
            const myId = socket.user.id;
            const [rows] = await pool.query(
                `SELECT * FROM messages
                WHERE (sender_id = ? AND receiver_id = ?) 
                   OR (sender_id = ? AND receiver_id = ?)
                ORDER BY sent_at ASC`,
                [myId, withUserId, withUserId, myId]);
            socket.emit('messageHistory', rows);
        } catch (error) {
            console.error('Error when retrieving chat history: ', error);
        }
    });

    socket.on('getAllUsers', async () => {
        try {
            const [rows] = await pool.query(`SELECT id, username FROM users`);
            socket.emit('listOfAllUsers', rows);
        } catch (error) {
            console.error('Error when retrieving chat history: ', error);
        }
    });

    socket.on('fetchId', async () => {
        try {
            const mojeId = socket.user.id;
            socket.emit('idReturn', mojeId);
        } catch (error) {
            console.error('Error when fetching id', error);
        }
    });

    socket.on('getChats', async () => {
        try {
            const myId = socket.user.id;
            const [rows] = await pool.query(
                `SELECT sender_id, receiver_id, content, sent_at FROM messages where sender_id = ? or receiver_id = ? ORDER BY receiver_id, sender_id, sent_at`,
                [myId, myId]
            );
            const chats = {};

            // Grupowanie wiadomości po receiver_id i sender_id (ignorowanie kolejności)
            rows.forEach(message => {
                const { sender_id, receiver_id } = message;
                const chatId = `${Math.min(sender_id, receiver_id)}_${Math.max(sender_id, receiver_id)}`;

                if (!chats[chatId]) {
                    chats[chatId] = [];
                }
                chats[chatId].push(message);
            });

            // Skoro wiadomości są pogrupowane, możemy je wysłać do klienta
            socket.emit('chatHistory', chats);
        } catch (error) {
            console.error('Error when fetching chat history:', error);
        }
    });

    socket.on("ping", () => {
        socket.emit("pong");
    });

    socket.on("deleteMessage", async ({id}) => {
        try {
            const myId = socket.user.id;
            const [foundId] = await pool.query(
                `SELECT id FROM messages where id = ? and (sender_id = ? or receiver_id = ?)`,
                [id, myId, myId]
            );
            console.log(foundId, id);
            if(foundId.length < 1){
                return;
            }
            await pool.query('delete from messages where id = ?', [id]);

            try {
                const myId = socket.user.id;
                const [rows] = await pool.query(
                    `SELECT sender_id, receiver_id, content, sent_at FROM messages where sender_id = ? or receiver_id = ? ORDER BY receiver_id, sender_id, sent_at`,
                    [myId, myId]
                );
                const chats = {};

                // Grupowanie wiadomości po receiver_id i sender_id (ignorowanie kolejności)
                rows.forEach(message => {
                    const { sender_id, receiver_id } = message;
                    const chatId = `${Math.min(sender_id, receiver_id)}_${Math.max(sender_id, receiver_id)}`;

                    if (!chats[chatId]) {
                        chats[chatId] = [];
                    }
                    chats[chatId].push(message);
                });

                // Skoro wiadomości są pogrupowane, możemy je wysłać do klienta
                socket.emit('chatHistory', chats);
            } catch (error) {
                console.error('Error when fetching chat history:', error);
            }
        } catch (error) {
            console.error('Error when deleting message:', error);
        }
    })

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// KONIEC IO