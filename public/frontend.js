function validacjaLogowania(){
    let login = document.getElementById('logowanieLogin');
    let haslo = document.getElementById('logowanieHaslo');
    if(login.value==null){
        alert('Musisz podać login');
        return 0;
    }
    if(haslo.value==null){
        alert('Musisz podać hasło');
        return 0;
    }
    login(login, haslo);
}

function validacjaRejestracji(){
    let login = document.getElementById('rejestracjaLogin');
    let haslo = document.getElementById('rejestracjaHaslo');
    let haslo2 = document.getElementById('rejestracjaHaslo2');
    let imie = document.getElementById('rejestracjaImie');
    let nazwisko = document.getElementById('rejestracjaNazwisko');
    if(login.value==null){
        alert('Musisz podać login');
        return 0;
    }
    if(haslo.value==null){
        alert('Musisz podać hasło');
        return 0;
    }
    login(login, haslo);
}