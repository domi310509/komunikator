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
    Czerwony: "Czerwony",
    Zielony: "Zielony",
    Niebieski: "Niebieski",
    Polski: "Polski",
    Angielski: "Angielski",
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
    login: "Login",
    haslo: "Password",
    errors: {
        
    },
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