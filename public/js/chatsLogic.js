//Nie mam pojęcia jak funkcje z backendu przekazują dane do frontendu, jak się dowiem to zrobię żeby działało
const uzytkownik = { id: null, nazwa: null };

function startStrony() {
    testAccessToken();
    startSocket();
    fetchId();
    getAllChats();
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
    let nazwa = uzytkownik.id;
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
    console.log("Wyświetlanie czatów:", osoby);
    //document.getElementById('osoby').innerHTML = ''; // Czyści listę osób
    for (let chatId in osoby) {
        let osoba = document.createElement('div');
        osoba.className = 'okienkoOsoby flexPoziom';
        const chat = osoby[chatId];
        let idChatu;
        if(chat[0].sender_id == uzytkownik.id)idChatu = chat[0].receiver_id;
        else idChatu = chat[0].sender_id;
        osoba.onclick = () => getChatHistory(idChatu);
        osoba.innerHTML = '<img src="images/placeholder.png" alt="Ni ma profilowego T-T" class="profilowePasekBoczny">' +
            '<div class="nazwaUzytkownikaPaskeBoczny">' + idChatu + '</div>';
        document.getElementById('osoby').appendChild(osoba);
    }
}

function wyslijWiadomosc(idOdbiorcy) {
    let wiadomosc = document.getElementById('polePisania').value.trim();
    if (wiadomosc == '') {
        alert('Nie możesz wysłać pustej wiadomości!');
        return;
    }
    //sendMessage(idOdbiorcy, wiadomosc);
    document.getElementById('polePisania').value = '';
    pokazCzat(idOdbiorcy);
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