translate();

document.getElementById("polePisania").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // zapobiega np. wysyłaniu formularza
    document.getElementById("wyslij").click(); // symuluje kliknięcie przycisku
  }
});