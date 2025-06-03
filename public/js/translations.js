window.translations = {
  pl: {
    zalogujsie: "Zaloguj się",
    login: "Login:",
    haslo: "Hasło:",
    powtorzhaslo: "Powtórz hasło:",
    zarejestrujsie: "Zarejestruj się",
    roznehasla: "Podane hasła nie zgadzają się",
    hasloprzewodnie: "SkrzydLink",
    stworzKonto: "Stwórz konto",
    mamJuzKonto: "Mam już konto",
    skillIssue: "Nie pamiętasz hasła?",
    copyright: "© 2025 Skrzydlink. Wszelkie prawa zastrzeżone.",
    pomoc: "Pomoc",
    politykaPrywatnosci: "Polityka Prywatnosci",
    cele: "Cele",
    tworcy: "Twórcy",
    przypominanieHasla: "Przypomnij Hasło",
    jednakPamietamHaslo: "Jednak pamiętasz hasło?",
    Wyslij: "Wyślij",
    poleWiadomosci: "Napisz wiadomość",
    zajetyLogin: "Podany login jest już używany. Wybierz inny.",
    stronaGlowna: "Strona Glowna",
    daneLogowaniaNieZgadzajaSie: "Dane logowania nie zgadzają się. Spróbuj ponownie.",
    nieUdaloSieZarejestrowac: "Nie udało się zarejestrować. Spróbuj ponownie.",
    wyloguj: "Wyloguj",
    ustawienia: "Ustawienia",
    krotkiOpis: "Nowy komunikator, łączący ludzi.",
    Domyslny: "Domyślny",
    Zielony: "Zielony",
    Niebieski: "Niebieski",
    Polski: "Polski",
    Angielski: "Angielski",
    kolorStrony: "Kolor Strony:",
    jezyk: "Język:",
    usunKonto: "Usuń Konto",
    errors: {
        //Błędy kodu
        NETWORK_ERROR: "Błąd połączenia z serwerem. Spróbuj ponownie później.",
        INVALID_INPUT: "Błędne dane wejściowe.",
        REGISTRATION_ERROR: "Błąd rejestracji.",
        LOGIN_ERROR: "Błąd logowania.",
        DB_CONSTRAINT_FAILED: "Błąd bazy danych.",
        SERVER_ERROR: "Wystąpił błąd serwera.",
        LOGOUT_ERROR: "Błąd wylogowywania.",
        ACCOUNT_DELETION_ERROR: "Błąd usuwania konta.",
        
        //Błędy użytkownika
        INVALID_CREDENTIALS: "Nieprawidłowy login lub hasło.",
        LOGIN_EMPTY: "Nie podano danych wejściowych.",
        PASSWORDS_DIFFERENT: "Hasła nie są identyczne.",
        LOGIN_TAKEN: "Login jest już zajęty.",
        USER_NOT_FOUND: "Nie znaleziono użytkownika.",
        MESSAGE_EMPTY: "Wiadomość nie może być pusta.",
        MESSAGE_TOO_LONG: "Wiadomość jest za długa.",
        NOT_AUTHENTICATED: "Musisz być zalogowany.",
        ALREADY_AUTHENTICATED: "Jesteś już zalogowany.",
        ACCOUNT_DOESNT_EXIST: "Konto o podanym loginie nie istnieje.",

        // Tokeny
        MISSING_ACCESS_TOKEN: "Brak tokenu uwierzytelniającego.",
        INVALID_ACCESS_TOKEN: "Token uwierzytelniający jest nieprawidłowy.",
        EXPIRED_ACCESS_TOKEN: "Token uwierzytelniający jest wygasły.",
        MISSING_REFRESH_TOKEN: "Brak tokenu odnowienia.",
        INVALID_REFRESH_TOKEN: "Token odnowienia jest nieprawidłowy.",
    },
  },
  en: {
    zalogujsie: "Log in",
  login: "Login:",
  haslo: "Password:",
  powtorzhaslo: "Repeat password:",
  zarejestrujsie: "Register",
  roznehasla: "Passwords do not match",
  hasloprzewodnie: "SkrzydLink",
  stworzKonto: "Create account",
  mamJuzKonto: "I already have an account",
  skillIssue: "Forgot your password?",
  copyright: "© 2025 Skrzydlink. All rights reserved.",
  pomoc: "Help",
  politykaPrywatnosci: "Privacy Policy",
  cele: "Goals",
  tworcy: "Creators",
  przypominanieHasla: "Password reminder",
  jednakPamietamHaslo: "Actually, I remember",
  Wyslij: "Send",
  poleWiadomosci: "Write a message",
  zajetyLogin: "The provided login is already in use. Please choose another.",
  stronaGlowna: "Home",
  daneLogowaniaNieZgadzajaSie: "Login details do not match. Please try again.",
  nieUdaloSieZarejestrowac: "Registration failed. Please try again.",
  wyloguj: "Log out",
  ustawienia: "Settings",
  krotkiOpis: "A new communicator connecting people.",
  Czerwony: "Deafult",
  Zielony: "Green",
  Niebieski: "Blue",
  Polski: "Polish",
  Angielski: "English",
  kolorStrony: "Website Color:",
  jezyk: "Language:",
  usunKonto: "Delete Account",
  errors: {
    // Code errors
    NETWORK_ERROR: "Network connection error. Please try again later.",
    INVALID_INPUT: "Invalid input.",
    REGISTRATION_ERROR: "Registration error.",
    LOGIN_ERROR: "Login error.",
    DB_CONSTRAINT_FAILED: "Database error.",
    SERVER_ERROR: "A server error occurred.",
    LOGOUT_ERROR: "Logout error.",
    ACCOUNT_DELETION_ERROR: "Account deletion error.",

    // User errors
    INVALID_CREDENTIALS: "Invalid login or password.",
    LOGIN_EMPTY: "No input provided.",
    PASSWORDS_DIFFERENT: "Passwords do not match.",
    LOGIN_TAKEN: "Login is already taken.",
    USER_NOT_FOUND: "User not found.",
    MESSAGE_EMPTY: "Message cannot be empty.",
    MESSAGE_TOO_LONG: "Message is too long.",
    NOT_AUTHENTICATED: "You must be logged in.",
    ALREADY_AUTHENTICATED: "You are already logged in.",
    ACCOUNT_DOESNT_EXIST: "No account exists with the provided login.",

    // Tokens
    MISSING_ACCESS_TOKEN: "Missing access token.",
    INVALID_ACCESS_TOKEN: "Invalid access token.",
    EXPIRED_ACCESS_TOKEN: "Access token has expired.",
    MISSING_REFRESH_TOKEN: "Missing refresh token.",
    INVALID_REFRESH_TOKEN: "Invalid refresh token.",
  }
  }
};

let currentLang = localStorage.getItem("lang") || "pl";

/**
 * Tłumaczy wszystkie elementy HTML na podstawie bieżącego języka (`currentLang`)
 * i danych tłumaczeń znajdujących się w `window.translations`.
 *
 * Obsługiwane atrybuty:
 * - `data-i18n`: tłumaczy tekst zawarty w elemencie (np. &lt;span&gt;, &lt;div&gt;).
 * - `data-i18n-placeholder`: tłumaczy placeholder (np. &lt;input&gt;, &lt;textarea&gt;).
 * - `data-i18n-value`: tłumaczy value (np. &lt;input type="submit"&gt;).
 *
 * Elementy z atrybutem `translate="no"` są pomijane.
 *
 * @example
 * <span data-i18n="hello">Hello</span>
 * <input data-i18n-placeholder="search" placeholder="Search...">
 * <input data-i18n-value="search" value="Search...">
 */
function translate(){
    document.querySelectorAll('[data-i18n]').forEach(el => { // normal text
        if(el.getAttribute("translate") == "no") return;

        let translationId = el.getAttribute('data-i18n');
        let translatedText = window.translations[currentLang][translationId];

        if (translatedText) {
            el.textContent = translatedText;
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { // input placeholder
        if(el.getAttribute("translate") == "no") return;

        let translationId = el.getAttribute('data-i18n-placeholder');
        let translatedText = window.translations[currentLang][translationId] || translationId;

        if (translatedText) {
            el.placeholder = translatedText;
        }
    });

    document.querySelectorAll('[data-i18n-value]').forEach(el => { // input placeholder
        if(el.getAttribute("translate") == "no") return;

        let translationId = el.getAttribute('data-i18n-value');
        let translatedText = window.translations[currentLang][translationId];

        if (translatedText) {
            el.value = translatedText;
        }
    });
}