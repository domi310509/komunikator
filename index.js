const express = require('express');
const app = express();
const PORT = 80;

app.use(express.static('public')); // ustaw ze public ma wszystkie pliki dla uzytkownika

app.get('/', (req, res) => {
    res.send('Serwer działa!');
});


// odpal server
app.listen(PORT, () => {
    console.log(`Serwer nasłuchuje na http://localhost:${PORT}`);
});