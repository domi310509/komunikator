//Nie mam pojęcia jak funkcje z backendu przekazują dane do frontendu, jak się dowiem to zrobię żeby działało
const uzytkownik = { id: null, nazwa: null };
const otwartyChat={id: null};
function startStrony() {
    testAccessToken();
    startSocket();
    dajId();
}

class Osoba {
    constructor(nazwa, id) {
        this.nazwa = nazwa;
        this.id = id;
    }
};



function wyloguj() {
    logout();
    //alert('Pomyślnie wylogowano');
    window.location.href = "index.html"; // wyjdz po wylogowaniu
}

class Wiadomosc {
    constructor(nadawca, tresc, data, nadawcaId) {
        this.nadawca = nadawca;
        this.tresc = tresc;
        this.data = data;
        this.nadawcaId = nadawcaId;
    }
}
function pokazCzat(wiadomosci) {
    let nazwa;
    console.log("Wiadomosci: ", wiadomosci);
    if(wiadomosci[0].sender_id == uzytkownik.id)nazwa = wiadomosci[0].receiver_id;
    else nazwa = wiadomosci[0].sender_id;
    otwartyChat.id = nazwa;
    document.getElementById('wiadomosci').innerHTML = '';

    for (let i of wiadomosci) {
        let wiadomosc = document.createElement('div');
        if (i.receiver_id == uzytkownik.id) wiadomosc.className = 'dymekZnajomego';
        else wiadomosc.className = 'dymekMoj';
        wiadomosc.innerText = i.content;
        document.getElementById('wiadomosci').appendChild(wiadomosc);
    }
    document.getElementById('nazwaUzytkownikaCzat').innerText = nazwa;

}


function wyswietlanieCzatow(osoby) {
    document.getElementById('osoby').innerHTML = '';
    for (let chatId in osoby) {
        let osoba = document.createElement('div');
        osoba.className = 'okienkoOsoby flexPoziom';
        const chat = osoby[chatId];
        let idChatu;
        if(chat[0].sender_id == uzytkownik.id)idChatu = chat[0].receiver_id;
        else idChatu = chat[0].sender_id;
        otwartyChat.id = idChatu;
        osoba.onclick = () => getChatHistory(idChatu);
        osoba.innerHTML = '<img src="placeholder.png" alt="Ni ma profilowego T-T" class="profilowePasekBoczny">' +
            '<div class="nazwaUzytkownikaPaskeBoczny">' + idChatu + '</div>';
        document.getElementById('osoby').appendChild(osoba);
    }
}

function wyslijWiadomosc() {
    let wiadomosc = document.getElementById('polePisania').value.trim();
    if (wiadomosc == '') {
        alert('Nie możesz wysłać pustej wiadomości!');
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