async function register(username, password){
    const url = `${window.location.origin}/register`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.text();
        if(response.ok){
            console.log('Rejestracja zakończona pomyślnie');
        } else {
            console.error(`Błąd rejestracji: ${data}`);
        }
    } catch(error){
        console.error('Błąd połączenia z serwerem: ' + error);
    }
}

async function login(username, password){
    const url = `${window.location.origin}/login`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password})
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

alert("Backend working")