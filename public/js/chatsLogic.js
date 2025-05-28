//Nie mam pojęcia jak funkcje z backendu przekazują dane do frontendu, jak się dowiem to zrobię żeby działało
const uzytkownik = { id: null, nazwa: null };
const otwartyChat = { id: null, nazwa: null };
let wszyscyUzytkownicy = [];
let znajomeChaty = [];
function startStrony() {
    startSocket();


    socket.on('connect', () => {
        testAccessToken();
        getUserList();
        fetchId();
        getAllChats();
    });

    socket.on('message', (message) => {
        console.log('Received message from server:', message);
        getChatHistory(otwartyChat.id);
    });

    socket.on('messageHistory', (messages) => {
        console.log('Otrzymano historię wiadomości:', messages);
        pokazCzat(messages);
    });

    socket.on('chatHistory', (listOfChats) => {
        wyswietlanieCzatow(listOfChats);
        console.log("Lista czatów:", listOfChats);
    });

    socket.on('idReturn', (id) => {
        console.log("Moje ID: ", id);
        uzytkownik.id = id;
        getUserList();
    });
    socket.on('listOfAllUsers', (listOfAllUsers) => {
        console.table(listOfAllUsers);
        wszyscyUzytkownicy = listOfAllUsers;
    });

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


function pokazCzat(wiadomosci) {

    document.getElementById('wiadomosci').innerHTML = '';
    nazwaUzytkownika();
    if (wiadomosci.length != 0) {
        for (let i of wiadomosci) {
            let wiadomosc = document.createElement('div');
            if (i.receiver_id == uzytkownik.id) wiadomosc.className = 'dymekZnajomego';
            else wiadomosc.className = 'dymekMoj';
            wiadomosc.innerText = i.content;
            document.getElementById('wiadomosci').appendChild(wiadomosc);
        }
    }
    document.getElementById('nazwaUzytkownikaCzat').innerText = otwartyChat.nazwa;

}


function wyswietlanieCzatow(osoby) {
    document.getElementById('osoby').innerHTML = '';
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
            otwartyChat.id = idChatu;
            nazwaUzytkownika();
            getChatHistory(idChatu);
        };

        nazwaUzytkownika();

        console.log("Chat ID: ", otwartyChat.nazwa);
        osoba.innerHTML = '<img src="/images/placeholder.png" alt="Ni ma profilowego T-T" class="profilowePasekBoczny">' +
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
            otwartyChat.id = chat.id;
            nazwaUzytkownika();
            getChatHistory(chat.id);
        };
        console.log("Chat ID: ", chat.username);
        osoba.innerHTML = '<img src="/images/placeholder.png" alt="Ni ma profilowego T-T" class="profilowePasekBoczny">' +
            '<div class="nazwaUzytkownikaPaskeBoczny">' + chat.username + '</div>';
        document.getElementById('osoby').appendChild(osoba);
    }
}

function wyslijWiadomosc() {
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
    zawartosc = document.getElementById('wyszukajOsobe').value.toUpperCase();
}

document.getElementById("polePisania").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("wyslij").click();
  }
});
/*
function myFunction() {
  // Declare variables
  var input, filter, ul, li, a, i;
  input = document.getElementById("mySearch");
  filter = input.value.toUpperCase();
  ul = document.getElementById("myMenu");
  li = ul.getElementsByTagName("li");

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}
*/