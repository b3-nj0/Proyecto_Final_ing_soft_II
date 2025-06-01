function parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(base64);
    }

    // Verificar token y rol
    const token = localStorage.getItem('access_token');
    if (!token) {
        alert("Acceso denegado: no has iniciado sesión");
        window.location.href = "/front/Dashboard-admin/login.html";
    } else {
        const user = parseJwt(token);
        if (user.rol !== "cajero") {
            alert("Acceso denegado");        window.location.href = "/front/Dashboard-admin/login.html";
    }
}
