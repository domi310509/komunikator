window.translations = {
  pl: {
    zalogujsie: "Zaloguj się",
    login: "Login",
    haslo: "Hasło",
    powtorzhaslo: "Powtórz hasło",
    zarejestrujsie: "Zarejestruj się",
    roznehasla: "Podane hasła nie zgadzają się",
  },
  en: {
    zalogujsie: "Log in",
    login: "Login",
    haslo: "Password",
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