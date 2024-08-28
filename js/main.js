//URL till webbtjänst
const serverUrl = 'https://moment4auth-serversida.onrender.com/api';

//Huvudfunktion som körs när DOM är laddad
document.addEventListener('DOMContentLoaded', function () {
  initEventListeners(); //Initiera alla händelsehanterare

  //Kolla om vi är på myaccount.html och skydda den sidan
  if (window.location.pathname.includes('myaccount.html')) {
    protectAccountPage(); //Skydda kontosidan när den laddas
  }
});

//Funktion för att skydda myaccount.html
function protectAccountPage() {
  const token = sessionStorage.getItem('jwtToken');

  //Döljer endast huvudinnehållet initialt
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.classList.add('hidden');
  }

  if (!token) {
    //Om ingen token finns, omdirigera till inloggningssidan
    window.location.href = 'index.html';
  } else {
    //Visa innehållet när användaren är autentiserad
    if (mainContent) {
      mainContent.classList.remove('hidden');
    }
  }
}

//Funktion som hanterar formulärskick (dvs förhindra standardbeteendet och kör registerUser)
function handleFormSubmit(event) {
  event.preventDefault();
  registerUser();
}

//Funktion för att skapa händelsehanterare när sidan har laddats
function initEventListeners() {
  //Försök hämta registreringsformuläret från DOM
  const registerForm = document.getElementById('register-form');

  //Om det finns, lägg till händelsehanterare
  if (registerForm) { 
        registerForm.addEventListener('submit', handleFormSubmit, false);

      //Rensa fel- och bekräftelsemeddelande i registreringsformuläret när användaren börjar skriva
      const registerInputs = registerForm.querySelectorAll('input');
      registerInputs.forEach(input => {
        input.addEventListener('input', function () {
          document.getElementById('errorText').innerHTML = '';
          document.querySelector('.confirm-text').textContent = '';
        });
      });
    }

  //Lägg till händelsehanterare för inloggningsformuläret
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener(
      'submit',
      function (event) {
        event.preventDefault();

        //Hämta användarnamn och lösenord från formuläret
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        //Validera att både användarnamn och lösenord är ifyllda
        if (!username || !password) {
          document.getElementById('login-error').textContent =
            'Vänligen fyll i både användarnamn och lösenord.';
          return;
        }

        //Visa laddningsanimationen och dölja inloggningsknappen
        document.getElementById('loading-spinner').style.display = 'block';
        this.querySelector('input[type="submit"]').style.display = 'none';

        loginUser(username, password); //Anropa loginUser-funktionen
      },
      false
    );

    //Rensa felmeddelande i inloggningsformuläret när användaren börjar skriva
    const loginInputs = loginForm.querySelectorAll('input');
    loginInputs.forEach(input => {
      input.addEventListener('input', function () {
        document.getElementById('login-error').textContent = '';
      });
    });
  }

  //Hitta "Logga ut"-knappen och lägg till en klickhändelse
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', logoutUser, false);
  }
}

//Funktion för att registrera en ny användare
async function registerUser() {
  //Hämta inputvärden från formulärfälten
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm_password').value;

  //Rensa tidigare felmeddelanden
  document.querySelectorAll('.error-text').forEach((error) => (error.textContent = ''));

  let isValid = true;

  //Validera varje inputfält och visa felmeddelanden
  if (!username) {
    document.getElementById('username-error').textContent = 'Vänligen ange ett användarnamn.';
    isValid = false;
  }
  if (!password) {
    document.getElementById('password-error').textContent = 'Vänligen ange ett lösenord.';
    isValid = false;
  }
  if (password !== confirmPassword) {
    document.getElementById('confirm_password-error').textContent =
      'Lösenorden matchar inte varandra';
    isValid = false;
  }

  //Om formuläret inte är giltigt, avbryt funktionen
  if (!isValid) {
    return;
  }

  //Skapa ett objekt för att skicka datan
  const userData = {
    username: username,
    password: password,
  };

  //AJAX-anrop med FetchAPI
  try {
    const response = await fetch(`${serverUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    //Om inte anropet fungerar, returnera statuskod och text
    if (!response.ok) {
      throw new Error(`Ett fel uppstod: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    document.getElementById('register-form').reset(); //Töm formuläret
    console.log('Success:', responseData);
    document.querySelector('.confirm-text').textContent = 'Ny användare registrerad!';

    window.scrollTo({ top: 0, behavior: 'smooth' }); //Scrolla till toppen av sidan när användaren är tillagd

  } catch (error) {
    console.error('Error:', error);
    document.getElementById(
      'errorText'
    ).innerHTML = `<p>Det gick inte att lägga till en ny användare.</p><p>Försök igen senare.</p>`;
  }
}

//Funktion för att logga in användaren
async function loginUser(username, password) {
  //Skapa ett objekt för att skicka datan
  const userData = {
    username: username,
    password: password,
  };

  //AJAX-anrop med FetchAPI
  try {
    const response = await fetch(`${serverUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    //Om inte anropet fungerar, returnera statuskod och text
    if (!response.ok) {
      throw new Error(`Ett fel uppstod: ${response.status} ${response.statusText}`);
    }

    //Extrahera JWT-token från svaret
    const responseData = await response.json();
    const token = responseData.response.token;

    //Spara JWT-token i sessionStorage för senare användning
    sessionStorage.setItem('jwtToken', token);

    //Omdirigera användaren till myaccount.html
    window.location.href = 'myaccount.html';
  } catch (error) {
    console.error('Error:', error);

const errorEl = document.getElementById('login-error');
if (errorEl) {
  errorEl.textContent = 'Fel användarnamn och/eller lösenord. Vänligen försök igen.';
}

  } finally {
    //Dölj laddningsanimationen och visa inloggningsknappen igen
    document.getElementById('loading-spinner').style.display = 'none';
    document.querySelector('input[type="submit"]').style.display = 'block';
  }
}

//Funktion för att logga ut användaren
async function logoutUser() {
  sessionStorage.removeItem('jwtToken'); //Ta bort JWT-token från sessionStorage

  window.location.href = 'index.html'; //Omdirigera användaren tillbaka till inloggningssidan
}
