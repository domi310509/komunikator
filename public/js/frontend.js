translate();

/*
Funkcja pobiera kounikat jaki ma wyświetlić i wyświetla go w elemencie o id "blad".
*/
function wyswietlanieBledow(tekstBledu){
    let poleBledu;
    try{
        poleBledu= document.getElementById("blad");
    }
    catch{
        return;
    }
    poleBledu.style.display = "block";
    poleBledu.innerText=tekstBledu;
}
//setTimeout(()=>wyswietlanieBledow('tesowy blad do testow zobacze czy dziala'),5000);
