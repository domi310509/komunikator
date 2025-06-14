const uzytkownik = { id: null, nazwa: null };
const otwartyChat = { id: null, nazwa: null };
let wszyscyUzytkownicy = [];
let znajomeChaty = [];
let otwartyEkran;
function startStrony() {
    startSocket();

    socket.on('connect', () => {
        console.log("Started and connected")
        getUserList();
        fetchId();
        getAllChats();
        document.getElementById("czat").style.display = 'none';
        document.getElementById("pusto").style.display = 'block';
    });

    socket.on('connect_error', (err) => {
        console.error(err.message)
        handleLoginError(err.message).then((wasSuccessfull) => {
            if (wasSuccessfull) { startStrony(); }
            else {

            }
        });
    });

    socket.on('pong', () => {
        console.log("pong");
    });

    socket.on('message', (message) => {
        message = sanitize(message);
        console.log('Received message from server:', message);
        getChatHistory(otwartyChat.id);
    });

    socket.on('messageHistory', (messages) => {
        messages = sanitize(messages);
        console.log('Otrzymano historię wiadomości:', messages);
        pokazCzat(messages);
    });

    socket.on('chatHistory', (listOfChats) => {
        listOfChats = sanitize(listOfChats);
        wyswietlanieCzatow(listOfChats);
        console.log("Lista czatów:", listOfChats);
    });

    socket.on('idReturn', (id) => {
        id = sanitize(id);
        console.log("Moje ID: ", id);
        uzytkownik.id = id;
        getUserList();
    });
    socket.on('listOfAllUsers', (listOfAllUsers) => {
        listOfAllUsers = sanitize(listOfAllUsers);
        console.log(listOfAllUsers);
        wszyscyUzytkownicy = listOfAllUsers;
    });

}

function ping() {
    console.log("ping");
    socket.emit("ping");
}

function nazwaUzytkownika() {
    for (let i of wszyscyUzytkownicy) {
        if (i.id == otwartyChat.id) {
            otwartyChat.nazwa = i.username;
            break;
        }
    }
}


function wyloguj() {
    logout();
    //alert('Pomyślnie wylogowano');
    window.location.href = "/index.html"; // wyjdz po wylogowaniu
}

/*
function pokazCzat(wiadomosci) {
    if (document.getElementById("ustawienia").style.display != 'none' && document.getElementById("ustawienia").style.display != '')
        document.getElementById("ustawienia").style.display = 'none';

    document.getElementById('wiadomosci').innerHTML = '';
    nazwaUzytkownika();

    if (wiadomosci.length != 0) {
        for (let i of wiadomosci) {
            const kontener = document.createElement('div');
            kontener.style.display = 'flex';
            kontener.style.alignItems = 'flex-start';
            kontener.style.gap = '1vw';
            kontener.style.margin = '1vh 0';
            kontener.style.maxWidth = '80vw';
            const img = document.createElement('img');
            img.src = 'sciezka/do/zdjecia.jpg';
            img.alt = 'sas';
            img.style.width = '4vw';
            img.style.height = '4vw';
            img.style.borderRadius = '50%';
            img.style.objectFit = 'cover';
            const dymek = document.createElement('div');
            dymek.innerText = i.content;
            dymek.style.padding = '1vh 1.5vw';
            dymek.style.borderRadius = '1.5vh';
            dymek.style.maxWidth = 'calc(100% - 5vw)';
            dymek.style.wordBreak = 'break-word';
            if (i.receiver_id == uzytkownik.id) {
                dymek.className = 'dymekZnajomego';
            } else {
                dymek.className = 'dymekMoj';
            }
            kontener.appendChild(img);
            kontener.appendChild(dymek);
            document.getElementById('wiadomosci').appendChild(kontener);
        }
    }

    document.getElementById('nazwaUzytkownikaCzat').innerText = otwartyChat.nazwa;
    document.getElementById('wiadomosci').scrollBy(0, document.body.scrollHeight);
}
*/

function pokazCzat(wiadomosci) {
    if (document.getElementById("ustawienia").style.display != 'none' && document.getElementById("ustawienia").style.display != '') document.getElementById("ustawienia").style.display = 'none';
    document.getElementById('wiadomosci').innerHTML = '';
    nazwaUzytkownika();
    if (wiadomosci.length != 0) {
        for (let i of wiadomosci) {
            let kontener = document.createElement('div');
            let godzina = document.createElement('span');
            godzina.className = 'godzinaWiadomosci';
            godzina.innerText= new Date(i.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            let smietnik = document.createElement('div');
            smietnik.className = 'usunWiadomosc';
            smietnik.dataset.id = i.id;
            let wiadomosc = document.createElement('div');
            wiadomosc.className = 'dymek';
            if (i.receiver_id == uzytkownik.id) {
                kontener.className = 'wiadomoscKontenerZnajomego';
                kontener.appendChild(wiadomosc);
                kontener.appendChild(smietnik);
                kontener.appendChild(godzina);
            }
            else {
                kontener.className = 'wiadomoscKontenerMoj';
                kontener.appendChild(godzina);
                kontener.appendChild(smietnik);
                kontener.appendChild(wiadomosc);
            }
            wiadomosc.innerText = i.content;
            document.getElementById('wiadomosci').appendChild(kontener);
        }
    }
    document.getElementById('nazwaUzytkownikaCzat').innerText = otwartyChat.nazwa;
    document.getElementById('wiadomosci').scrollBy(0, document.body.scrollHeight);
    for (let i of document.getElementsByClassName("usunWiadomosc")) {
        i.addEventListener('click', () => {
            deleteMessage(i.dataset.id);
            i.parentElement.remove();
        });
    }

}

function wyswietlanieCzatow(osoby) {
    document.getElementById('osoby').innerHTML = '';
    console.log(osoby)
    for (let chatId in osoby) {
        let osoba = document.createElement('div');
        osoba.className = 'okienkoOsoby flexPoziom';
        const chat = osoby[chatId];
        let idChatu;
        if (chat[0].sender_id == uzytkownik.id) idChatu = chat[0].receiver_id;
        else idChatu = chat[0].sender_id;
        otwartyChat.id = idChatu;
        znajomeChaty.push(idChatu);
        osoba.onclick = () => {
            if (document.getElementById("czat").style.display == 'none') {
                document.getElementById("czat").style.display = 'flex';
                document.getElementById("pusto").style.display = 'none';
            }
            otwartyChat.id = idChatu;
            nazwaUzytkownika();
            getChatHistory(idChatu);
        };

        nazwaUzytkownika();

        console.log("Chat ID: ", otwartyChat.nazwa);
        osoba.innerHTML = '<img src="/images/domyslna ikona uzytkownika.svg" alt="Zdjęcie profilowe" class="profilowePasekBoczny">' +
            '<div class="nazwaUzytkownikaPaskeBoczny">' + otwartyChat.nazwa + '</div>';
        document.getElementById('osoby').appendChild(osoba);
    }
    wyswietlanieWszystkichUzytkownikow();
}
function wyswietlanieWszystkichUzytkownikow() {
    for (let chat of wszyscyUzytkownicy) {
        if (chat.id == uzytkownik.id) continue; // Nie pokazuj samego siebie
        if (znajomeChaty.includes(chat.id)) continue; // Nie pokazuj znajomych z czatów
        let osoba = document.createElement('div');
        osoba.className = 'okienkoOsoby2 flexPoziom';
        otwartyChat.id = chat.id;
        osoba.onclick = () => {
            if (document.getElementById("czat").style.display == 'none') {
                document.getElementById("czat").style.display = 'flex';
                document.getElementById("pusto").style.display = 'none';
            }
            otwartyChat.id = chat.id;
            nazwaUzytkownika();
            getChatHistory(chat.id);
        };
        console.log("Chat ID: ", chat.username);
        osoba.innerHTML = '<img src="/images/domyslna ikona uzytkownika.svg" alt="Zdjęcie profilowe" class="profilowePasekBoczny">' +
            '<div class="nazwaUzytkownikaPaskeBoczny">' + chat.username + '</div>';
        document.getElementById('osoby').appendChild(osoba);
    }
}

function wyslijWiadomosc() {
    document.getElementById('wiadomosci').scrollBy(0, document.body.scrollHeight);
    let wiadomosc = document.getElementById('polePisania').value.trim();
    if (wiadomosc == '') {
        return;
    }
    console.log("wyslij wiadomosc");
    sendMessage(otwartyChat.id, wiadomosc);
    document.getElementById('polePisania').value = '';
    console.log("Wysłano wiadomość do: ", otwartyChat.id);
}

function szukajOsoby() {

    let zawartosc = document.getElementById('wyszukajOsobe').value;
    let lista = document.getElementsByClassName('nazwaUzytkownikaPaskeBoczny');
    if (zawartosc == '') {
        for (let i of lista) {
            i.parentElement.style.display = "";
        }
        return;
    }
    zawartosc = zawartosc.toUpperCase();

    for (let i of lista) {
        if (i.innerText.toUpperCase().indexOf(zawartosc) > -1) {
            i.parentElement.style.display = "";
        }
        else {
            i.parentElement.style.display = "none";
        }
    }
}
document.getElementById('wyszukajOsobe').addEventListener('input', () => szukajOsoby());


document.getElementById("polePisania").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("wyslij").click();
    }
});

document.getElementById("ustawieniaPasekBoczny").addEventListener('click', () => {
    let ustawienia = document.getElementById("ustawienia");
    let ekrany = document.getElementsByClassName('ekranCzat');
    for (let i of ekrany) {
        if (i.id != 'ustawienia') {
            if (i.style.display != 'none') {
                otwartyEkran = i;
                break;
            }
        }

    }

    if (ustawienia.style.display == 'none' || ustawienia.style.display == '') {
        console.log("Ustawienia otwarte");
        otwartyEkran.style.display = 'none';
        ustawienia.style.display = 'block';
    } else {
        ustawienia.style.display = 'none';
        otwartyEkran.style.display = 'flex';
    }
});




document.getElementById("wylogujZeWyszystkichUrzadzen").addEventListener('click', () => {
    logoutFromAllDevices();
    logout();
    window.location.href = "/index.html";
})

document.getElementById("usunKonto").addEventListener('click', () => {
    document.getElementById("ustawienia").style.display = 'none';
    document.getElementById("pusto").style.display = 'flex';
    document.getElementById("ekranUsuwania").style.display = 'flex';
})

document.getElementById("nieusuwajKonta").addEventListener('click', () => {
    document.getElementById("ustawienia").style.display = 'flex';
    document.getElementById("ekranUsuwania").style.display = 'none';
    document.getElementById("pusto").style.display = 'none';
})
function usunKonto() {
    deleteAccount(document.getElementById("usunKontoLogin").value, document.getElementById("usunKontoHaslo").value);
    logout();// to tu jest specjalnie, jakby użytkownik usunął nie to konto na którym jest obcenie zalogowany to zostanie wylogowany. Nie chce mi się robć wyjątku na taką sytuację
    window.location.href = "/index.html";
}
document.getElementById("polski").addEventListener('click', () => {
    console.log("Ustawiono język polski");
    localStorage.setItem("lang", "pl");
    location.reload();
})
document.getElementById("angielski").addEventListener('click', () => {
    console.log("Ustawiono język angielski");
    localStorage.setItem("lang", "en");
    location.reload();
})