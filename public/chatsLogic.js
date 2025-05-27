//Nie mam pojęcia jak funkcje z backendu przekazują dane do frontendu, jak się dowiem to zrobię żeby działało
// testAccessToken();
// startSocket();
// getAllChats();
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
function pokazCzat(id) {
    let nazwa//Muszę dowiedzieć jak pobrać nazwę użytkownika z id
    //document.getElementById('wiadomosci').innerHTML = '';
    //getChatHistory(id);
    let wiadomosci = [
        new Wiadomosc('Janek', 'Skibidi', '2023-10-01 12:00', 0),
        new Wiadomosc('Kasia', 'Skibidi Toaleta', '2023-10-01 12:01', 1),
        new Wiadomosc('Kasia', 'Sigma', '2023-10-01 12:02', 1),
        new Wiadomosc('Janek', 'SASASASASASASASASASASASASA', '2023-10-01 12:03', 0),
        new Wiadomosc('Kasia', 'SKIBIDI!', '2023-10-01 12:04', 1)
    ]

    for (let i of wiadomosci) {
        let wiadomosc = document.createElement('div');
        if (i.nadawcaId == id) wiadomosc.className = 'dymekZnajomego';
        else wiadomosc.className = 'dymekMoj';
        wiadomosc.innerText = i.tresc;
        document.getElementById('wiadomosci').appendChild(wiadomosc);
    }
    document.getElementById('nazwaUzytkownikaCzat').innerText = nazwa;

}

function wyswietlanieCzatow(osoby) {    
       osoby = [
        new Osoba('Janek', 1),
        new Osoba('Kasia', 2),
        new Osoba('Marek', 3),
        new Osoba('Ania', 4),
        new Osoba('Tomek', 5)
    ];
    
    for (let chatId in osoby) {
        let osoba = document.createElement('div');
        osoba.className = 'okienkoOsoby flexPoziom';
        osoba.onclick = () => pokazCzat(chatId);
        osoba.innerHTML = '<img src="placeholder.png" alt="Ni ma profilowego T-T" class="profilowePasekBoczny">' +
            '<div class="nazwaUzytkownikaPaskeBoczny">' + chatId + '</div>';
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
    zawartosc=document.getElementById('wyszukajOsobe').value.toUpperCase();
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