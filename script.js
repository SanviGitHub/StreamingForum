function obtenerTiempoActual() {
    var ahora = new Date();
    var horas = ahora.getHours().toString().padStart(2, '0');
    var minutos = ahora.getMinutes().toString().padStart(2, '0');
    var segundos = ahora.getSeconds().toString().padStart(2, '0');
    return `${horas}:${minutos}:${segundos}`;
}

function crearForo() {
    var titulo = document.getElementById("titulo").value;
    var cabeza = document.getElementById("cabeza").value;
    var tags = document.getElementById("tags").value.split(',').map(tag => tag.trim());
    var plataforma = document.getElementById("plataforma").value;

    // Verifica si se ingresaron tags
    if (tags.length === 0) {
        mostrarAnuncioSinTags();
        return;
    }

    var fechaCreacion = new Date();

    var nuevoForo = document.createElement("div");
    nuevoForo.classList.add("foro");

    nuevoForo.innerHTML = `
        <input type="hidden" class="timestamp" value="${fechaCreacion.getTime()}">
        <h2>${titulo}</h2>
        <p>Cabeza: ${cabeza}</p>
        <p>Tags: ${tags.join(', ')}</p>
        <p>Plataforma: ${plataforma}</p>
    `;

    document.getElementById("foros").appendChild(nuevoForo);

    guardarForoEnCookies(titulo, cabeza, tags, plataforma, fechaCreacion);

    document.getElementById("formularioForo").reset();
}

function mostrarAnuncioSinTags() {
    var anuncio = document.getElementById("anuncioSinTags");
    anuncio.style.display = "block";

    // Oculta el anuncio después de 5 segundos
    setTimeout(function () {
        anuncio.style.display = "none";
    }, 5000);
}

function guardarForoEnCookies(titulo, cabeza, tags, plataforma, fechaCreacion) {
    var foro = {
        titulo: titulo,
        cabeza: cabeza,
        tags: tags,
        plataforma: plataforma,
        fechaCreacion: fechaCreacion.getTime()
    };

    var foroJSON = JSON.stringify(foro);

    document.cookie = `foro=${foroJSON}; path=/`;
}

function cargarForosDesdeCookies() {
    var cookies = document.cookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.startsWith('foro=')) {
            var foroJSON = cookie.substring(5);
            var foro = JSON.parse(foroJSON);

            var nuevoForo = document.createElement("div");
            nuevoForo.classList.add("foro");

            nuevoForo.innerHTML = `
                <input type="hidden" class="timestamp" value="${foro.fechaCreacion}">
                <h2>${foro.titulo}</h2>
                <p>Cabeza: ${foro.cabeza}</p>
                <p>Tags: ${foro.tags.join(', ')}</p>
                <p>Plataforma: ${foro.plataforma}</p>
            `;

            document.getElementById("foros").appendChild(nuevoForo);
        }
    }
}

cargarForosDesdeCookies();

function actualizarCookie(foro) {
    var titulo = foro.querySelector("h2").innerText;
    var cabeza = foro.querySelector("p:nth-child(2)").innerText.substring(8);
    var tags = foro.querySelector("p:nth-child(3)").innerText.substring(6).split(',').map(tag => tag.trim());
    var plataforma = foro.querySelector("p:nth-child(4)").innerText.substring(12);
    var timestamp = foro.querySelector(".timestamp").value;

    var foroActualizado = {
        titulo: titulo,
        cabeza: cabeza,
        tags: tags,
        plataforma: plataforma,
        fechaCreacion: timestamp
    };

    var foroActualizadoJSON = JSON.stringify(foroActualizado);

    var cookies = document.cookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.startsWith('foro=') && cookie.includes(timestamp)) {
            document.cookie = `foro=${foroActualizadoJSON}; path=/`;
            break;
        }
    }
}

function eliminarCookie(foro) {
    var timestamp = foro.querySelector(".timestamp").value;

    var cookies = document.cookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.startsWith('foro=') && cookie.includes(timestamp)) {
            document.cookie = `foro=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            break;
        }
    }
}

function mostrarMensajeError(mensaje) {
    var mensajeError = document.createElement("div");
    mensajeError.classList.add("mensaje-error");
    mensajeError.innerText = mensaje;
    document.body.appendChild(mensajeError);

    setTimeout(function () {
        mensajeError.remove();
    }, 5000);
}

function mostrarMensajeExito(mensaje) {
    var timestamp = obtenerTiempoActual();
    var mensajeExito = document.createElement("div");
    mensajeExito.classList.add("mensaje-exito");
    mensajeExito.innerHTML = `<p>${mensaje}</p><p>Timestamp: ${timestamp}</p>`;
    document.body.appendChild(mensajeExito);

    setTimeout(function () {
        mensajeExito.remove();
    }, 5000);
}
