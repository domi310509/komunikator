async function walidacjaLogowania() {
    let loginU = document.getElementById('logowanieLogin');
    let haslo = document.getElementById('logowanieHaslo');
    let czyPoprawneDane = true;
    if (loginU.value == '') {
        loginU.style.borderColor = '#ff8274';
        loginU.placeholder = 'Podaj login';
        czyPoprawneDane = false;
    }
    if (haslo.value == '') {
        haslo.style.borderColor = '#ff8274';
        haslo.placeholder = 'Podaj haslo';
        czyPoprawneDane = false;
    }
    

    if (czyPoprawneDane) {
        let error = await login(loginU.value, haslo.value);
        //if(isLoggedIn())przejdzDoCzatow(); może tworzyć błędy
        if(error=='ALREADY_AUTHENTICATED')przejdzDoCzatow();
        else if(error instanceof Error || typeof error === Error){
            document.getElementById('blad').style.display='block';
            document.getElementById('blad').innerText=error.message;
        }    
        else{
            await login(loginU.value, haslo.value);
            przejdzDoCzatow();
        }
    }
}

async function walidacjaRejestracji() {
    let loginU = document.getElementById('rejestracjaLogin');
    let haslo = document.getElementById('rejestracjaHaslo');
    let haslo2 = document.getElementById('rejestracjaHaslo2');
    let rozneHasla = document.getElementById('rozneHasla');
    let czyPoprawneDane = true;

    if (loginU.value == '') {
        loginU.style.borderColor = '#ff8274';
        loginU.placeholder = 'Podaj login';
        czyPoprawneDane = false;
    }
    if (haslo.value == '') {
        haslo.style.borderColor = '#ff8274';
        haslo.placeholder = 'Podaj haslo';
        czyPoprawneDane = false;
    }
    rozneHasla.style.display = 'none';
    if (haslo.value != haslo2.value) {
        haslo2.style.borderColor = '#ff8274';
        rozneHasla.style.display = 'block';
        czyPoprawneDane = false;
    }
    if (czyPoprawneDane) {
        let error = await register(loginU.value, haslo.value);
        //if(isLoggedIn())przejdzDoCzatow(); Może tworzyć błędy
        if(error instanceof Error || typeof error === Error){
            document.getElementById('nieUdaloSieZarejestrowac').style.display='block';
            document.getElementById('nieUdaloSieZarejestrowac').innerText=error.message;
        }else{
            login(loginU.value, haslo.value);
            przejdzDoCzatow();
        }
    }
}
function zresetujStyleInputow(input) {
    if (input.style.borderColor == 'rgb(255, 130, 116)') input.style.borderColor = '#7c183c';
    input.placeholder = '';
    if (input.placeholder == 'Powtórz hasło') document.getElementById('rozneHasla').style.display = 'none';
}

let inputy = document.querySelectorAll('input');
for (let i of inputy) {
    i.addEventListener('click', () => zresetujStyleInputow(i));
}

function zmianaEkranuLogowanie(idZnikajace, idPojawiajace) {
    ekranZnikajacy = document.getElementById(idZnikajace);
    ekranPojawiajacy = document.getElementById(idPojawiajace);
    ekranPojawiajacy.style.display = 'flex';
    ekranZnikajacy.style.display = 'none';
}
function przejdzDoCzatow() {
    window.location.href = '/html/chats.html';
}
