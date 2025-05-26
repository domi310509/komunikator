function walidacjaLogowania() {
    let loginU = document.getElementById('logowanieLogin');
    let haslo = document.getElementById('logowanieHaslo');
    let czyPoprawneDane = true;
    if (loginU.value == '') {
        loginU.style.borderColor = '#ff8274';
        if (!loginU.classList.toggle("podajDane")) loginU.classList.toggle("podajDane");
        loginU.placeholder = 'Podaj login';
        czyPoprawneDane = false;
    }
    if (haslo.value == '') {
        haslo.style.borderColor = '#ff8274';
        if (!haslo.classList.toggle("podajDane")) haslo.classList.toggle("podajDane");
        haslo.placeholder = 'Podaj haslo';
        czyPoprawneDane = false;
    }
    if (czyPoprawneDane) login(loginU, haslo);
}

function walidacjaRejestracji() {
    let loginU = document.getElementById('rejestracjaLogin');
    let haslo = document.getElementById('rejestracjaHaslo');
    let haslo2 = document.getElementById('rejestracjaHaslo2');
    let rozneHasla = document.getElementById('rozneHasla');
    let czyPoprawneDane = true;

    if (loginU.value == '') {
        loginU.style.borderColor = '#ff8274';
        if (!loginU.classList.toggle("podajDane")) loginU.classList.toggle("podajDane");

        loginU.placeholder = 'Podaj login';
        czyPoprawneDane = false;
    }
    if (haslo.value == '') {
        haslo.style.borderColor = '#ff8274';
        if (!haslo.classList.toggle("podajDane")) haslo.classList.toggle("podajDane");
        haslo.placeholder = 'Podaj haslo';
        czyPoprawneDane = false;
    }

    if (haslo.value != haslo2.value) {
        haslo2.style.borderColor = '#ff8274';
        if (!haslo2.classList.toggle("podajDane")) haslo2.classList.toggle("podajDane");
        rozneHasla.style.display = 'block';
        czyPoprawneDane = false;
    }
    if (czyPoprawneDane) register(loginU, haslo);
}
function zresetujStyleInputow(input) {
    if (input.style.borderColor == 'rgb(255, 130, 116)') input.style.borderColor = '#7c183c';
    if (input.classList.toggle("podajDane")) input.classList.toggle("podajDane");
    if (input.placeholder == 'Powtórz hasło') document.getElementById('rozneHasla').style.display = 'none';
}

let inputy = document.querySelectorAll('input');
for (let i of inputy) {
    i.addEventListener('click', () => zresetujStyleInputow(i));
}
function zmianaEkranuLogowanie(idZnikajace, idPojawiajace){
    ekranZnikajacy=document.getElementById(idZnikajace);
    ekranPojawiajacy=document.getElementById(idPojawiajace);
    ekranPojawiajacy.style.display='flex';
    ekranZnikajacy.style.display='none';
}
function stworzKontoPrzycisk(){
    ekranLogowania = document.getElementById('ekranLogowania');
    ekranRejestracji= document.getElementById('ekranRejestracji');
    ekranLogowania.style.display='none';
    ekranRejestracji.style.display='flex';
}

function mamJuzKontoPrzycisk(){
    ekranLogowania = document.getElementById('ekranLogowania');
    ekranRejestracji= document.getElementById('ekranRejestracji');
    ekranLogowania.style.display='flex';
    ekranRejestracji.style.display='none';
}

function skillIssuePrzycisk(){
    ekranLogowania = document.getElementById('ekranLogowania');
    ekranRejestracji = document.getElementById('ekranRejestracji');
    ekranLogowania.style.display='none';
    ekranRejestracji.style.display='flex';
}