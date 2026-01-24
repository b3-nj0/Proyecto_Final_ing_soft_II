document.getElementById('login-form').addEventListener('submit', async (e) => {

  e.preventDefault();

  const username = document.getElementById('username').value;

  const password = document.getElementById('password').value;

  const response = await fetch('http://localhost:8000/login', {
    method: 'POST',
    headers: {

      'Content-Type': 'application/x-www-form-urlencoded',

    },
    body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  });

if (response.ok) {
  const data = await response.json();
  localStorage.setItem('access_token', data.access_token);


  const decodedToken = parseJwt(data.access_token);
  const rol = decodedToken.rol;


  if (rol === 'admin') {

    window.location.href = '/front/Dashboard-admin/index.html';

  } else if (rol === 'cocina') {

    window.location.href = '/front/vista_cocina.html';

  } else if (rol === 'cajero') {

    window.location.href = '/front/index.html';

  } else {

    alert('Rol no reconocido');

  }
}
});


function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(base64);
}

function protegerPagina(rolRequerido) {
  const token = localStorage.getItem('access_token');
  if (!token) {
    alert("Acceso denegado: no has iniciado sesión");
    window.location.href = "/login.html";
    return;
  }

  const user = parseJwt(token);
  if (user.rol !== rolRequerido) {
    alert(`Acceso denegado: necesitas rol ${rolRequerido}`);
    window.location.href = "/login.html";
  }
}