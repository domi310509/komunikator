translate();

const ustawienia = document.getElementById("ustawieniaPasekBoczny");
const poleUstawien = document.getElementById("ustawienia");

ustawienia.addEventListener('click', () => {
      if (poleUstawien.style.display === 'none') {
        poleUstawien.style.display = 'flex';
      } else {
        poleUstawien.style.display = 'none';
      }
    });