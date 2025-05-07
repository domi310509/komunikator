# komunikator

Wymagane:
nodejs
npm

Projekt do szkoły

Tutorial jak to odpalić:

Stwórz plik .env
Zawartość (dla xampa):
```
#Database login
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=""
DB_NAME=(dbName)

#Access tokens
JWT_SECRET=(128 losowych znakow i cyferek (wszystko zmalej bez znakow specjalnych))
JWT_REFRESH_SECRET=(inne 128 losowych znakow i cyferek (wszystko zmalej bez znakow specjalnych))
```

Odpal xampa i stwórz bazę danych z pliku queries o nazwie (dbName)


Terminal:
```npm install```
```npm install nodemon```
```npm run dev```

Jak sprawdzić czy działa:
W chromie ```localhost/```
register('root', '1111')
startSocket()

Jeśli żaden błąd nie wyjdzie to działa. Jeśli wyjdzie to do Wiesława


W przypadku jakichkolwiek błędów prosze zrobić nowy issue na githubie albo zwrócić się do Wiesława
