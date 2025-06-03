/**
 * Własna klasa do błędów
 *
 * @constructor
 * @param {number} code - numer błędu
 * @param {string} langKey - identyfikator tłumaczenia błędu
 * @param {string|null} [data] - dodatkowe dane (opcjonalne)
 */
class AppError extends Error {
    constructor(langKey = "UNKNOWN_ERROR", data = null) {
        const lang = localStorage.getItem("lang") || "pl";

        const msgTemplate = window.translations[lang]["errors"][langKey] || langKey;

        const message = data ? `${msgTemplate}: ${data}` : msgTemplate;

        super(message);
        this.langKey = langKey;
    }
}

/**
 * Oczyszcza tekst z możliwych ataków xss
 * @param {string} input 
 * @returns {string} oczyszczony input
 */
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Oczyszcza wejście z ataków xss
 * @param {*} obj 
 * @returns 
 */
function sanitize(obj) {
  if (typeof obj === 'string') {
    return escapeHTML(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(sanitize);
  } else if (obj !== null && typeof obj === 'object') {
    const sanitized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitize(obj[key]);
      }
    }
    return sanitized;
  } else {
    // liczby, booleany, null — zwracamy bez zmian
    return obj;
  }
}
/**
 * Zajmuje się częstymi błędami przy akcjach wymaganych autoryzacji
 * @param {string} errorType 
 * @returns Zwraca true jeśli sobie poradził lub false jeśli nie
 */
async function handleLoginError(errorType){
    switch(errorType){
        case "INVALID_ACCESS_TOKEN":
        case "MISSING_ACCESS_TOKEN":
            await refreshToken();
            return true;
        case "MISSING_REFRESH_TOKEN":
            await logout();
            return true;
        default:
            return false;
    }
}

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
 * @returns {Promise<string|AppError>} komunikat sukcesu lub obiekt błędu
 */
async function register(username, password){
    if(!(typeof username === 'string') || !(typeof password === 'string')){
        console.error("Błędne dane wejściowe");
        return new AppError("INVALID_INPUT", { field: "username/password" });
    }
    if(isLoggedIn()){
        return new AppError("ALREADY_AUTHENTICATED");
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
            if(data.error in window.translations[localStorage.getItem("lang") || "pl"]){
                return new AppError(data.error);
            } else{
                return new AppError("REGISTRATION_ERROR", data.error);
            }
        }
    } catch(error){
        return new AppError("SERVER_ERROR", error);
    }
}

/**
 * Loguje użytkownika, jeśli nie jest już zalogowany
 * @param {string} username - nazwa użytkownika
 * @param {string} password - hasło
 * @returns {Promise<string|AppError>} komunikat sukcesu lub obiekt błędu
 */
async function login(username, password){
    if(!(typeof username === 'string') || !(typeof password === 'string')){
        console.error("Błędne dane wejściowe");
        return new AppError("INVALID_INPUT", { field: "username/password" });
    }
    if(isLoggedIn()){
        return new AppError("ALREADY_AUTHENTICATED");
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
            if(data.error in window.translations[localStorage.getItem("lang") || "pl"]){
                return new AppError(data.error);
            } else{
                return new AppError("LOGIN_ERROR", data.error);
            }
        }
    } catch(error){
        return new AppError("NETWORK_ERROR", error);
    }
}

/**
 * Wylogowuje użytkownika, usuwa token oraz rozłącza socket
 * @returns {Promise<string|AppError>} komunikat sukcesu lub obiekt błędu
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
            if(await handleLoginError(data.error)){
                //Happy happy happy
                return logoutFromAllDevices();
            } else {
                return new AppError("LOGOUT_ERROR", error);
            }
        }
    } catch(error){
        return new AppError("NETWORK_ERROR", error);
    }
}

/**
 * Wylogowuje użytkownika z wszystkich urządzeń, usuwa token oraz rozłącza socket
 * @returns {Promise<string|AppError>} komunikat sukcesu lub obiekt błędu
 */
async function logoutFromAllDevices(){
    const url = `${window.location.origin}/api/logoutAll`;
    const accessToken = localStorage.getItem('accessToken');
    
    if(!!socket){
		socket.disconnect();
    }
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        const data = await response.json();
        if(response.ok){
            localStorage.removeItem('accessToken');
            return 'Wylogowano pomyślnie';
        } else {
            if(await handleLoginError(data.error)){
                //Happy happy happy
                return logoutFromAllDevices();
            } else {
                return new AppError("LOGOUT_ERROR", error);
            }
        }
    } catch(error){
        return new AppError("NETWORK_ERROR", error);
    }
}

async function deleteAccount(username, password){
    if(!(typeof username === 'string') || !(typeof password === 'string')){
        console.error("Błędne dane wejściowe");
        return new AppError("INVALID_INPUT", { field: "username/password" });
    }

    const url = `${window.location.origin}/api/deleteAccount`;
    const accessToken = localStorage.getItem('accessToken');
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
			body: JSON.stringify({ username, password}),
			credentials: "include",
        });
        const data = await response;
        if(response.ok){
            localStorage.removeItem('accessToken');
            return 'Wylogowano pomyślnie';
        } else {
            if(await handleLoginError(data.error)){
                //Happy happy happy
                return deleteAccount(username, password);
            } else {
                return new AppError("ACCOUNT_DELETION_ERROR", error);
            }
        }
    } catch(error){
        return new AppError("NETWORK_ERROR", error);
    }
}

/**
 * Testuje poprawność access tokena próbując uzyskać dostęp do chronionego zasobu
 * @returns {Promise<string|AppError>} dane lub błąd
 */
async function testAccessToken(){
    const url = `${window.location.origin}/protected`;
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        return new AppError('MISSING_ACCESS_TOKEN');
    }
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if(response.ok){
            return data;
        } else {
            if(await handleLoginError(data.error)){
                //Happy happy happy
                return testAccessToken();
            } else {
                return new AppError("LOGIN_ERROR", error);
            }
        }
    } catch(error){
        return new AppError("NETWORK_ERROR", error);
    }
}

/**
 * Odświeża access token na podstawie cookie
 * @returns {Promise<string|AppError>} komunikat sukcesu lub błąd
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
            if(await handleLoginError(data.error)){
                //Happy happy happy
                return refreshToken();
            } else {
                return new AppError("LOGIN_ERROR", error);
            }
        }
    } catch(error){
        return new AppError("NETWORK_ERROR", error);
    }
}

let socket;


/**
 * Inicjuje połączenie socket.io
 */
function startSocket() {
    const accessToken = localStorage.getItem('accessToken');
    socket = io(`${window.location.origin}`, {
        auth: {
            token: accessToken
        }
    });

//     socket.on('connect', () => {
//         console.log('Successfully connected to server!');
//     });

//     socket.on('disconnect', () => {
//         console.log('Disconnected from server!');
//     });

//     socket.on('connect_error', (err) => {
//         handleLoginError(err.message).then((wasSuccessfull) => {if(wasSuccessfull)startSocket();});
//         console.error('Connection error:', sanitize(err.message));
//     });

//     socket.on('message', (message) => {
//         console.log('Received message from server:', sanitize(message));
//         //getChatHistory(otwartyChat.id);
//     });

//     socket.on('messageHistory', (messages) => {
//         console.log('Otrzymano historię wiadomości:', sanitize(messages));
//         //pokazCzat(messages);
//     });

//     socket.on('listOfAllUsers', (listOfAllUsers) => {
//         console.log(sanitize(listOfAllUsers));
//     });

//     socket.on('chatHistory', (listOfChats) => {
//         //wyswietlanieCzatow(listOfChats); //Dlaczego lista czatów nie jest listą tylko obiektem? :(
//         console.log("Lista czatów:", sanitize(listOfChats));
//     });

//     socket.on('idReturn', (id) => {
//         console.log("Moje ID: ", sanitize(id));
//         //uzytkownik.id = id;
//     });
}

/**
 * Wysyła wiadomość do innego użytkownika
 * @param {string} receiverId - ID odbiorcy
 * @param {string} content - treść wiadomości
 */
function sendMessage(receiverId, content){
    socket.emit('message', { receiverId, content });
    console.log('sent message');
}

/**
 * Pobiera historię czatu z wybranym użytkownikiem
 * @param {string} withUserId - ID użytkownika, z którym prowadzona jest rozmowa
 */
function getChatHistory(withUserId){
    socket.emit('getMessages', {withUserId});
}

function deleteMessage(id){
    socket.emit("deleteMessage", {id});
}

/**
 * Pobiera listę wszystkich rozmów użytkownika
 */
function getAllChats(){
    socket.emit('getChats');
}
function fetchId(){
    socket.emit('fetchId');
}
/**
 * Pobiera listę wszystkich użytkowników
 */
function getUserList(){
    socket.emit('getAllUsers');
}