# Webbapplikation för registrering och inloggning
Det här repot innehåller kod för en enklare webbapplikation som använder en REST-webbtjänst på serversidan och AJAX fetchanrop från klientsidan. Applikationen tillåter användare att registrera en ny användare och logga in på en skyddad sida. Webbapplikationen är gjord med HTML, CSS och JavaScript.

## Länkar
En liveversion av webbapplikationen finns tillgänglig på följande URL:
[https://dt207g-moment4-hjw3.onrender.com]

En liveversion av det använda APIet finns tillgänglig på följande URL:
[https://moment4auth-serversida.onrender.com]

## Installation och Konfiguration
Klona källkodsfilerna, kör kommando npm install för att installera nödvändiga npm-paket.

Om du vill nyttja repot för webbtjänsten på serversidan hittar du det på följande URL: [https://github.com/ansv88/Moment4auth_serversida.git]

## Användning
 ### Flik "Logga in"
Inloggningssida för redan registrerade användare.

 ### Flik "Skapa konto"
Registreringssida för nya användare. Användarnamn och lösenord ska fyllas i.

 ### Flik "Mitt konto"
Skyddad sida som nås efter inloggning. JWT-token och sessionStorage används.