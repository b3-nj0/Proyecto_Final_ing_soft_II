function alertaAceptar(callback) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Deseas marcar este pedido como ACEPTADO?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, aceptar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
    });
}

function alertaCancelar(callback) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Deseas marcar este pedido como CANCELADO?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'Volver'
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
    });
}

// NUEVAS FUNCIONES DE ÉXITO
function alertaExitoAceptar() {
    Swal.fire({
        icon: 'success',
        title: '¡Pedido aceptado!',
        showConfirmButton: false,
        timer: 1200
    });
}

function alertaExitoCancelar() {
    Swal.fire({
        icon: 'success',
        title: '¡Pedido cancelado!',
        showConfirmButton: false,
        timer: 1200
    });
}