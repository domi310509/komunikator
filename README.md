# komunikator
Projekt do szkoły

Tutorial jak to odpalić:

Stwórz plik .env
Zawartość:

#Database login
DB_HOST=<host>
DB_USER=<user>
DB_PASSWORD=<password>
DB_NAME=<dbName>

#Access tokens
JWT_SECRET=<128 losowych znakow i cyferek (wszystko zmalej bez znakow specjalnych)>
JWT_REFRESH_SECRET=<inne 128 losowych znakow i cyferek (wszystko zmalej bez znakow specjalnych)>

Terminal:
```npm install```
```npm run dev```

W przypadku jakichkolwiek błędów prosze zrobić nowy issue na githubie albo zwrócić się do Wiesława