// NIE MOJE
async function generateKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",  // Algorytm szyfrowania RSA-OAEP (dla bezpiecznego szyfrowania)
            modulusLength: 2048,  // Długość klucza (2048 bitów)
            publicExponent: new Uint8Array([1, 0, 1]),  // Publiczny wykładnik (e = 65537)
            hash: "SHA-256",  // Algorytm haszujący, używany w algorytmie RSA-OAEP
        },
        true,  // Określa, że klucze będą mogły być używane do operacji szyfrowania i odszyfrowywania
        ["encrypt", "decrypt"]  // Operacje, które mogą być wykonywane na kluczu (szyfrowanie i odszyfrowywanie)
    );

    return keyPair;  // Zwraca wygenerowaną parę kluczy (publiczny i prywatny)
}

async function encryptPrivateKey(privateKey, password) {
    // Generujemy losową sól
    const salt = window.crypto.getRandomValues(new Uint8Array(16)); // 16-bajtowa losowa sól

    const passwordKey = await window.crypto.subtle.importKey(
        "raw", 
        new TextEncoder().encode(password),  // Hasło użytkownika jako ciąg bajtów
        { name: "PBKDF2" },  // Algorytm PBKDF2 do uzyskania klucza AES z hasła
        false, 
        ["deriveKey"]
    );
    
    const aesKey = await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",  // Algorytm PBKDF2
            salt: salt,  // Unikalna sól
            iterations: 100000,  // Liczba iteracji
            hash: "SHA-256",  // Algorytm haszujący
        },
        passwordKey,
        { name: "AES-GCM", length: 256 },  // Generowanie klucza AES-GCM (256-bitowy)
        false,
        ["encrypt", "decrypt"]  // Klucz będzie używany do szyfrowania i odszyfrowywania
    );

    // Szyfrowanie klucza prywatnego za pomocą AES-GCM
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Wektor inicjalizacyjny (IV) dla AES-GCM
    const encryptedPrivateKey = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },  // Wektor inicjalizacyjny dla AES-GCM
        aesKey,  // AES key wygenerowany z hasła
        privateKey  // Klucz prywatny do zaszyfrowania
    );

    return encryptedPrivateKey, salt, iv;  // Zwracamy zaszyfrowany klucz prywatny
}

async function sendEncryptedPrivateKeyToServer(encryptedData) { ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const url = '/api/uploadEncryptedKey';  // Adres endpointa serwera

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                encryptedPrivateKey: Array.from(encryptedData.encryptedPrivateKey),
                salt: Array.from(encryptedData.salt),
                iv: Array.from(encryptedData.iv)
            })
        });

        if (response.ok) {
            console.log('Encrypted private key sent to server successfully!');
        } else {
            console.error('Failed to send encrypted private key:', await response.text());
        }
    } catch (error) {
        console.error('Error during the request:', error);
    }
}
// NIE MOJE ^^^

async function register(username, password, passwordForKey){ ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
        const data = await response.text();
        if(response.ok){
            console.log('Rejestracja zakończona pomyślnie');
            // send rsa keys
            const keyPair = await generateKeyPair();

            const [encryptedPrivateKey, salt, iv] = await encryptPrivateKey(keyPair.privateKey, password);

            const encryptedData = {
                encryptedPrivateKey: encryptedPrivateKey,
                salt: salt,
                iv: iv
            }

            await sendEncryptedPrivateKeyToServer(encryptedData);
        } else {
            console.error(`Błąd rejestracji: ${data}`);
        }
    } catch(error){
        console.error('Błąd połączenia z serwerem: ' + error);
    }
}

async function login(username, password){
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
        const data = await response.text();
        if(response.ok){
            console.log('Zalogowano pomyślnie');
        } else {
            console.error(`Błąd logowania: ${data}`);
        }
    } catch(error){
        console.error('Błąd połączenia z serwerem: ' + error);
    }
}

async function logout() {
    const url = `${window.location.origin}/api/logout`;
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
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // automatically sends cookies send by server
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