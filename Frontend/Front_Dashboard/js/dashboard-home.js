document.addEventListener('DOMContentLoaded', function () {

    fetch('http://localhost:8000/total-ventas-dia')
        .then(res => res.json())
        .then(data => {
            document.getElementById('total_sales').textContent = `${Number(data).toLocaleString()}`;
        });
    // Ganancia del día
    fetch('http://localhost:8000/ganancia-dia')
        .then(res => res.json())
        .then(data => {
            document.getElementById('daily-sales').textContent = `$${Number(data).toLocaleString()}`;
        });

    // Hora pico de ventas
    fetch('http://localhost:8000/hora-pico-ventas')
        .then(res => res.json())
        .then(data => {
            if (data && data.hora) {
                document.getElementById('hora-pico').textContent = `${data.hora} (${data.cantidad_ventas} ventas)`;
            } else {
                document.getElementById('hora-pico').textContent = 'Sin datos';
            }
        });
    // Producto más vendido del día
    fetch('http://localhost:8000/producto-mas-vendido') 
      .then(response => response.json())
      .then(data => {
        // Selecciona la PRIMERA card-food (del día)
        const cardDia = document.querySelectorAll('.card-food')[0];
        if (!cardDia) return;
        const img = cardDia.querySelector('.img-food');
        const nombre = cardDia.querySelector('.text-title-food');
        const producto = cardDia.querySelector('.card-button-food');

        if (data) {
          nombre.textContent = data.nombre || 'Producto sin nombre';
          producto.textContent = 'Producto más vendido hoy';
          img.src = data.imagen ? `${data.imagen}` : 'img/default-food.png';
        } else {
          nombre.textContent = "";
          producto.textContent = "No hay productos vendidos hoy";
          img.src = 'img/default-food.png';
        }
      })
      .catch(error => {
        console.error('Error al cargar el producto:', error);
      });

    // Producto más vendido del mes
    fetch('http://localhost:8000/producto-mas-vendido-mes')
      .then(response => response.json())
      .then(data => {
        // Selecciona la SEGUNDA card-food (del mes)
        const cardMes = document.getElementById('card-food-mes');
        if (!cardMes) return;
        const img = cardMes.querySelector('.img-food');
        const nombre = cardMes.querySelector('.text-title-food');
        const producto = cardMes.querySelector('.card-button-food');

        if (data) {
          nombre.textContent = data.nombre || 'Producto sin nombre';
          producto.textContent = 'Producto más vendido del mes';
          img.src = data.imagen ? `${data.imagen}` : 'img/default-food.png';
        } else {
          nombre.textContent = "";
          producto.textContent = 'No hay productos vendidos este mes';
          img.src = 'img/default-food.png';
        }
      })
      .catch(error => {
        console.error('Error al cargar el producto del mes:', error);
      });
      
    let dataTable = null;

    function cargarOrdenesCocina() {
        fetch('http://localhost:8000/ordenes-cocina')
            .then(res => res.json())
            .then(data => {
                // Si ya existe el DataTable, destrúyelo antes de volver a llenarlo
                if (dataTable) {
                    dataTable.clear().destroy();
                }
                const tbody = document.getElementById('tabla-ordenes-cocina').querySelector('tbody');
                tbody.innerHTML = '';
                data.forEach(orden => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${orden.numero_ticket}</td>
                        <td>${orden.nombre_plato}</td>
                        <td>${orden.cantidad}</td>
                        <td>${orden.estado_plato}</td>
                        <td>${orden.hora ? new Date(orden.hora).toLocaleTimeString() : ''}</td>
                        <td>
                            <button class="btn btn-success btn-sm btn-aceptar" data-id="${orden.numero_ticket}">Aceptar</button>
                            <button class="btn btn-danger btn-sm btn-cancelar" data-id="${orden.numero_ticket}">Cancelar</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });

                // Inicializa DataTable con botones solo una vez
                dataTable = $('#tabla-ordenes-cocina').DataTable({
                    dom: 'Bfrtip',
                    buttons: [
                        {
                            extend: 'excelHtml5',
                            text: 'Exportar a Excel',
                            title: 'Órdenes de Cocina'
                        }
                    ],
                    language: {
                        url: "//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json"
                    }
                });

                // Asignar eventos a los botones
                document.querySelectorAll('.btn-aceptar').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        alertaAceptar(() => {
                            fetch(`http://localhost:8000/ordenes-cocina/${id}/cambiar-estado`, { method: 'PUT' })
                                .then(() => {
                                    alertaExitoAceptar();
                                    cargarOrdenesCocina();
                                });
                        });
                    });
                });
                document.querySelectorAll('.btn-cancelar').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        alertaCancelar(() => {
                            fetch(`http://localhost:8000/ordenes-cocina/${id}/cambiar-estado-cancelado`, { method: 'PUT' })
                                .then(() => {
                                    alertaExitoCancelar();
                                    cargarOrdenesCocina();
                                });
                        });
                    });
                });
            })
            .catch(error => {
                console.error('Error al cargar las órdenes de cocina:', error);
            });
    }

        cargarOrdenesCocina();

});
