function isLoggedIn(){
    const token = localStorage.getItem('accessToken');
    if(token){
        return true;
    } else {
        return false;
    }
}

async function register(username, password){
    if(isLoggedIn()){
        return new Error('Użytkownik jest już zalogowany')
    }

    const url = `${window.location.origin}/api/register`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include' // automatically stores cookies send by server
        });
        const data = await response.json();
        if(response.ok){
            const accessToken = data.accessToken;
            localStorage.setItem('accessToken', accessToken);
            return 'Rejestracja zakończona pomyślnie';
        } else {
            return new Error(`Błąd rejestracji: ${data.error}`);
        }
    } catch(error){
        return new Error('Błąd połączenia z serwerem: ' + error);
    }
}

async function login(username, password){
    if(isLoggedIn()){
        return new Error('Użytkownik jest już zalogowany')
        return;
    }

    const url = `${window.location.origin}/api/login`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password}),
            credentials: 'include' // automatically stores cookies send by server
        });
        const data = await response.json();
        if(response.ok){
            const accessToken = data.accessToken;
            localStorage.setItem('accessToken', accessToken);
            return 'Zalogowano pomyślnie';
        } else {
            return new Error(`Błąd logowania: ${data.error}`);
        }
    } catch(error){
        return new Error('Błąd połączenia z serwerem: ' + error);
    }
}

async function logout() {
    const url = `${window.location.origin}/api/logout`;
    localStorage.removeItem('accessToken');
    if(!!socket){
        socket.disconnect();
    }
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // automatically sends cookies send by server
        });
        const data = await response.text();
        if(response.ok){
            return 'Wylogowano pomyślnie';
        } else {
            return new Error(`Błąd wylogowywania: ${data}`);
        }
    } catch(error){
        return new Error('Błąd połączenia z serwerem: ' + error);
    }
}

async function testAccessToken(){
    const url = `${window.location.origin}/protected`;
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        return new Error('Access token is missing');
        return;
    }
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.text();
        if(response.ok){
            return data;
        } else {
            return new Error(`Błąd logowania: ${data}`);
        }
    } catch(error){
        return new Error('Błąd połączenia z serwerem: ' + error);
    }
}

async function refreshToken() {
    const url = `${window.location.origin}/api/token`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include'
        });
        const data = await response.json();
        if(response.ok){
            const accessToken = data.accessToken;
            localStorage.setItem('accessToken', accessToken);
            return 'Odświeżono token pomyślnie';
        } else {
            return new Error(`Błąd logowania: ${data.error}`);
        }
    } catch(error){
        return new Error('Błąd połączenia z serwerem: ' + error);
    }
}

// TODO:
// Zamienić wszystkie console.error na throw error -- 50/50 zrobione? 

let socket;

function startSocket() {
    const accessToken = localStorage.getItem('accessToken');
    socket = io(`${window.location.origin}`, {
        auth: {
            token: accessToken
        }
    });

    socket.on('connect', () => {
        console.log('Successfully connected to server!');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server!');
    });

    socket.on('connect_error', (err) => {
        console.error('Connection error:', err.message);
    });

    socket.on('message', (message) => {
        console.log('Received message from server:', message);
    });

    socket.on('messageHistory', (messages) => {
        console.log(messages);
    });

    socket.on('listOfAllUsers', (listOfAllUsers) => {
        console.table(listOfAllUsers);
    });

    socket.on('chatHistory', (listOfChats) => {
        console.log(listOfChats);
    });
}

// ADD SOCKET CLASS / HANDLER

function sendMessage(receiverId, content){
    socket.emit('message', { receiverId, content });
}

function getChatHistory(withUserId){
    socket.emit('getMessages', {withUserId});
}

function getAllChats(){
    socket.emit('getChats');
}

function getUserList(){
    socket.emit('getAllUsers');
}