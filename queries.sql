create table users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    public_key TEXT NOT NULL, -- Klucz publiczny w base64
    encrypted_private_key TEXT NOT NULL -- Zaszyfrowany klucz prywatny w base64
);