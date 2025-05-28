/**
 * Sprawdza, czy użytkownik jest zalogowany na podstawie obecności tokenu w localStorage
 * @returns {boolean} true, jeśli accessToken istnieje; false w przeciwnym razie 
 */

function isLoggedIn(){
    const token = localStorage.getItem('accessToken');
    if(token){
        return true;
    } else {
        return false;
    }
}

/**
 * Rejestruje nowego użytkownika, jeśli nie jest zalogowany
 * @param {string} username - nazwa użytkownika
 * @param {string} password - hasło
 * @returns {Promise<string|Error>} komunikat sukcesu lub obiekt błędu
 */

async function register(username, password){
    if(!(typeof username === 'string') || !(typeof password === 'string')){
        console.error("Błędne dane wejściowe");
        return new Error("Dane wejściowe nie są tekstem");
    }
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
            credentials: 'include'
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

/**
 * Loguje użytkownika, jeśli nie jest już zalogowany
 * @param {string} username - nazwa użytkownika
 * @param {string} password - hasło
 * @returns {Promise<string|Error>} komunikat sukcesu lub obiekt błędu
 */
async function login(username, password){
    if(!(typeof username === 'string') || !(typeof password === 'string')){
        console.error("Błędne dane wejściowe");
        return new Error("Dane wejściowe nie są tekstem");
    }
    if(isLoggedIn()){
        return new Error('Użytkownik jest już zalogowany');
    }

    const url = `${window.location.origin}/api/login`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password}),
            credentials: 'include'
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

/**
 * Wylogowuje użytkownika, usuwa token oraz rozłącza socket
 * @returns {Promise<string|Error>} komunikat sukcesu lub obiekt błędu
 */
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
            credentials: 'include'
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

/**
 * Testuje poprawność access tokena próbując uzyskać dostęp do chronionego zasobu
 * @returns {Promise<string|Error>} dane lub błąd
 */
async function testAccessToken(){
    const url = `${window.location.origin}/protected`;
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        return new Error('Access token is missing');
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

/**
 * Odświeża access token na podstawie cookie
 * @returns {Promise<string|Error>} komunikat sukcesu lub błąd
 */
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

let socket;


/**
 * Inicjuje połączenie socket.io i ustawia nasłuch zdarzeń
 */
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
        console.log('Otrzymano historię wiadomości:', messages);
        pokazCzat(messages);
    });

    socket.on('listOfAllUsers', (listOfAllUsers) => {
        console.table(listOfAllUsers);
    });

    socket.on('chatHistory', (listOfChats) => {
        wyswietlanieCzatow(listOfChats);//Dlaczego lista czatów nie jest listą tylko obiektem? :(
        console.log("Lista czatów:",listOfChats);
    });
    socket.on('proszeOtoId', (mojeId) => {
        console.log("Moje ID: ", mojeId);
        uzytkownik.id = mojeId;


        getAllChats();
    });
}

/**
 * Wysyła wiadomość do innego użytkownika
 * @param {string} receiverId - ID odbiorcy
 * @param {string} content - treść wiadomości
 */
function sendMessage(receiverId, content){
    socket.emit('message', { receiverId, content });
}

/**
 * Pobiera historię czatu z wybranym użytkownikiem
 * @param {string} withUserId - ID użytkownika, z którym prowadzona jest rozmowa
 */
function getChatHistory(withUserId){
    socket.emit('getMessages', {withUserId});
}

/**
 * Pobiera listę wszystkich rozmów użytkownika
 */
function getAllChats(){
    socket.emit('getChats');
}
function dajId(){
    socket.emit('dajId');
}
/**
 * Pobiera listę wszystkich użytkowników
 */
function getUserList(){
    socket.emit('getAllUsers');
}
