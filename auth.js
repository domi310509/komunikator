const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('./db');

// Funkcje do access tokenów by uzytkownika nie wylogowywalo 
function generateAccessToken(user) {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(user) {
    return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

async function register(req, res){
    const {username, password} = req.body;

    if(!username || !password) {
        return res.status(400).json({error: "LOGIN_EMPTY"});
    }

    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if(existingUser.length > 0) {
            return res.status(400).json({error: 'LOGIN_TAKEN'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [user] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]); // INSERT returns what was saved in db (?) of new created insert + fix for injections 
        
        const userRepaired = {id: user.insertId};
        // Generowanie tokenów
        const accessToken = generateAccessToken(userRepaired);
        const refreshToken = generateRefreshToken(userRepaired);
        await pool.query("INSERT INTO refresh_tokens (token, user_id) VALUES (?, ?)", [refreshToken, user.insertId]);

        // Ustawienie tokenów w ciasteczkach
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
        return res.status(201).json({accessToken: accessToken});
    } catch (error){
        console.error(error);
        return res.status(500).json({error: 'SERVER_ERROR'});
    }
}

async function login(req, res) {
    const {username, password} = req.body;

    if(!username || !password) {
        return res.status(400).json({error: "LOGIN_EMPTY"});
    }

    try {
        const [user] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if(user.length === 0){
            return res.status(400).json({error:'INVALID_CREDENTIALS'});
        }

        const isMatch = await bcrypt.compare(password, user[0].password);

        if(!isMatch){
            return res.status(400).json({error: 'INVALID_CREDENTIALS'});
        }

        // Generowanie tokenów
        const accessToken = generateAccessToken(user[0]);
        const refreshToken = generateRefreshToken(user[0]);
        await pool.query("INSERT INTO refresh_tokens (token, user_id) VALUES (?, ?)", [refreshToken, user[0].id]);

        // Ustawienie tokenów w ciasteczkach
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
        return res.status(201).json({accessToken: accessToken});
    } catch (error){
        console.error(error);
        return res.status(500).json({error: 'SERVER_ERROR'});
    }
}

async function refresh(req, res) {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(401).json({error: 'MISSING_REFRESH_TOKEN'});

    const found = await pool.query("SELECT * FROM refresh_tokens WHERE token = ?", [token]);
    if (!found.length) return res.sendStatus(403).json({error: "INVALID_REFRESH_TOKEN"});

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) return res.sendStatus(403).json({error: "INVALID_REFRESH_TOKEN"});

        pool.query("DELETE FROM refresh_tokens WHERE token = ?", [token]); // Usuwanie starego refresh_tokenu

        const newRefreshToken = generateRefreshToken(user); // Generowanie nowego
        pool.query("INSERT INTO refresh_tokens (token, user_id) VALUES (?, ?)", [newRefreshToken, user.id]);

        res.cookie('refreshToken', newRefreshToken, { httpOnly: true });
        return res.json({ accessToken: generateAccessToken({ id: user.id })});
    });
}

async function logout(req, res) {
    const refreshToken = req.cookies.refreshToken;
    pool.query("DELETE FROM refresh_tokens WHERE token = ?", [refreshToken]); // Usuwanie starego refresh_tokenu
    res.clearCookie('refreshToken');
    res.sendStatus(204);
}

async function logoutById(req, res) {
    const id = req.user.id;
    pool.query("DELETE FROM refresh_tokens WHERE user_id = ?", [id]); // Usuwanie starego refresh_tokenu
    res.clearCookie('refreshToken');
    res.sendStatus(204);
}

function authenticateAccessToken(req, res, next){
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({error: 'MISSING_ACCESS_TOKEN'});
    }

    const token = authHeader.substring(7, authHeader.length);
    if(!token){
        return res.status(401).json({error: 'MISSING_ACCESS_TOKEN'});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err){
            return res.status(403).json({error:'INVALID_ACCESS_TOKEN'});
        }

        req.user = user;

        next();
    })
}

async function authenticateSocketToken(socket, next){
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('MISSING_ACCESS_TOKEN'));
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if(err){
            return next(new Error('INVALID_ACCESS_TOKEN'));
        }
        
        const [result] = await pool.query('select id from users where id = ?', [user.id]);
        
        if(result.length != 1){
            return next(new Error('DB_CONSTRAINT_FAILED'));
        }

        socket.user = user;
        next();
    })
}

async function accountDeletion(req, res){
    const {username, password} = req.body;

    if(!username || !password) {
        return res.status(400).json({error: "LOGIN_EMPTY"});
    }

    try {
        const [user] = await pool.query('SELECT * FROM users WHERE username = ? and id = ?', [username, req.user.id]);

        if(user.length === 0){
            return res.status(400).json({error:'INVALID_CREDENTIALS'});
        }

        const isMatch = await bcrypt.compare(password, user[0].password);

        if(!isMatch){
            return res.status(400).json({error: 'INVALID_CREDENTIALS'});
        }

        logoutById(req, res);
        await pool.query("DELETE FROM messages WHERE sender_id = ? or receiver_id = ?", [req.user.id, req.user.id]);
        await pool.query("DELETE FROM users WHERE id = ?", [req.user.id]);

        return res.status(201);
    } catch (error){
        console.error(error);
        return res.status(500).json({error: 'SERVER_ERROR'});
    }

}

module.exports = { register, login, refresh, logout, authenticateAccessToken, authenticateSocketToken, logoutById, accountDeletion };