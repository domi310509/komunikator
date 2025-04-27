const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('./db');

const app = express();
const PORT = 80;

// Middleware do obsługi statycznych plików
app.use(express.static('public'));

// Middleware do parsowania JSON
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Serwer działa!');
});

app.post('/register', async (req, res) => {
    const {username, password} = req.body;

    if(!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]); // fix for injections

        if(existingUser.length > 0) {
            return res.status(400).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

        res.status(201).send('User registered successfully');
    } catch (error){
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;

    if(!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const [user] = await pool.query('SELECT * FROM users WHERE username = ?', [username]); // fix for injections

        if(user.length === 0){
            return res.status(400).send('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user[0].password);

        if(!isMatch){
            return res.status(400).send('Invalid credentials');
        }

        res.status(200).send('Logged in successfully');
    } catch (error){
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

// odpal server
app.listen(PORT, () => {
    console.log(`Serwer nasłuchuje na http://localhost:${PORT}`);
});