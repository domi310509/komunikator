console.log("frontend.js się wczytuje");

function walidacjaLogowania(){
    let loginU = document.getElementById('logowanieLogin');
    let haslo = document.getElementById('logowanieHaslo');
    let czyPoprawneDane=true;
    if(loginU.value==''){
        loginU.style.borderColor='red';
        if(!loginU.classList.toggle("podajDane"))loginU.classList.toggle("podajDane");
        loginU.placeholder='Podaj login';
        czyPoprawneDane=false;
    }
    if(haslo.value==''){
        haslo.style.borderColor='red';
        if(!haslo.classList.toggle("podajDane"))haslo.classList.toggle("podajDane");
        haslo.placeholder='Podaj haslo';
        czyPoprawneDane=false;
    }
    if(czyPoprawneDane)login(loginU, haslo);
}

function walidacjaRejestracji(){
    let loginU = document.getElementById('rejestracjaLogin');
    let haslo = document.getElementById('rejestracjaHaslo');
    let haslo2 = document.getElementById('rejestracjaHaslo2');
    let rozneHasla = document.getElementById('rozneHasla');
    let czyPoprawneDane=true;

    if(loginU.value==''){
        loginU.style.borderColor='red';
                if(!loginU.classList.toggle("podajDane"))loginU.classList.toggle("podajDane");

        loginU.placeholder='Podaj login';
        czyPoprawneDane=false;
    }
    if(haslo.value==''){
        haslo.style.borderColor='red';
        if(!haslo.classList.toggle("podajDane"))haslo.classList.toggle("podajDane");
        haslo.placeholder='Podaj haslo';
        czyPoprawneDane=false;
    }

    if(haslo.value!=haslo2.value){
        haslo2.style.borderColor='red';
        if(!haslo2.classList.toggle("podajDane"))haslo2.classList.toggle("podajDane");
        rozneHasla.style.display='block';
        czyPoprawneDane=false;
    }
    if(czyPoprawneDane)register(loginU, haslo);
}
function zresetujStyleInputow(input){
    if(input.style.borderColor=='red')input.style.borderColor='rgb(39, 39, 39)';
    if(input.classList.toggle("podajDane"))input.classList.toggle("podajDane");
    if(input.placeholder=='Powtórz hasło')document.getElementById('rozneHasla').style.display='none';
}
inputy=document.querySelectorAll('input');
for(let i of inputy){
    i.addEventListener('click',()=>zresetujStyleInputow(i));
}