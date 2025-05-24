console.log("frontend.js się wczytuje");

function walidacjaLogowania(){
    let loginU = document.getElementById('logowanieLogin');
    let haslo = document.getElementById('logowanieHaslo');
    if(loginU.value==''){
        alert('Musisz podać login');
        return 0;
    }
    if(haslo.value==''){
        alert('Musisz podać hasło');
        return 0;
    }
}

function walidacjaRejestracji(){
    let loginU = document.getElementById('rejestracjaLogin');
    let haslo = document.getElementById('rejestracjaHaslo');
    let haslo2 = document.getElementById('rejestracjaHaslo2');
    let imie = document.getElementById('rejestracjaImie');
    let nazwisko = document.getElementById('rejestracjaNazwisko');
    if(imie.value==''){
        alert('Musisz podać imie');
        return 0;
    }
    if(loginU.value==''){
        alert('Musisz podać login');
        return 0;
    }
    if(haslo.value==''){
        alert('Musisz podać hasło');
        return 0;
    }


    if(haslo.value!=haslo2.value){
        alert("Podane hasła nie zgadzają się");
        return 0;
    }
    register(loginU, haslo);
}