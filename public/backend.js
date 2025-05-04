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
        console.error('Użytkownik jest już zalogowany')
        return;
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
            console.log('Rejestracja zakończona pomyślnie');
        } else {
            console.error(`Błąd rejestracji: ${data.error}`);
        }
    } catch(error){
        console.error('Błąd połączenia z serwerem: ' + error);
    }
}

async function login(username, password){
    if(isLoggedIn()){
        console.error('Użytkownik jest już zalogowany')
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
            console.log('Zalogowano pomyślnie');
        } else {
            console.error(`Błąd logowania: ${data.error}`);
        }
    } catch(error){
        console.error('Błąd połączenia z serwerem: ' + error);
    }
}

async function logout() {
    const url = `${window.location.origin}/api/logout`;
    localStorage.removeItem('accessToken');
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
            console.log('Wylogowano pomyślnie');
        } else {
            console.error(`Błąd logowania: ${data}`);
        }
    } catch(error){
        console.error('Błąd połączenia z serwerem: ' + error);
    }
}

async function testAccessToken(){
    const url = `${window.location.origin}/protected`;
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        console.error('Access token is missing');
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
            console.log(data);
        } else {
            console.error(`Błąd logowania: ${data}`);
        }
    } catch(error){
        console.error('Błąd połączenia z serwerem: ' + error);
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
            console.log('Odświeżono token pomyślnie');
        } else {
            console.error(`Błąd logowania: ${data.error}`);
        }
    } catch(error){
        console.error('Błąd połączenia z serwerem: ' + error);
    }
}

let socket;

function startSocket() {
    const accessToken = localStorage.getItem('accessToken');
    // Inicjalizujemy socket.io z tokenem w nagłówku
    socket = io(`http://localhost:80`, {
        auth: {
            token: accessToken // Przekazujemy token autoryzacyjny
        }
    });

    // Reagujemy na wydarzenie 'connect' - potwierdzenie połączenia
    socket.on('connect', () => {
        console.log('Successfully connected to server!');
    });

    // Reagujemy na wydarzenie 'disconnect' - połączenie zostało zerwane
    socket.on('disconnect', () => {
        console.log('Disconnected from server!');
    });

    // Obsługa błędów, np. jeśli połączenie nie udało się nawiązać
    socket.on('connect_error', (err) => {
        console.error('Connection error:', err.message);
    });

    // Opcjonalnie możesz nasłuchiwać na wiadomości od serwera
    socket.on('message', (data) => {
        console.log('Received message from server:', data);
    });
}