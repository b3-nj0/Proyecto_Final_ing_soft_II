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
    fetch('http://localhost:8000/producto-mas-vendido') 
      .then(response => response.json())
      .then(data => {
        const img = document.querySelector('.img-food');
        const nombre = document.querySelector('.head-food');
        const descripcion = document.querySelector('.discription-food');
        const precio = document.querySelector('.price-food');

        if (data) {
          nombre.textContent = data.nombre || 'Producto sin nombre';
          descripcion.textContent = 'Producto más vendido hoy';

          precio.textContent = data.precio ? `${data.precio} Bs` : '';


          img.src = data.imagen ? `${data.imagen}` : 'img/default-food.png';
        } else {
          nombre.textContent = "No hay productos vendidos hoy";
          img.src = 'img/default-food.png';
        }
      })
      .catch(error => {
        console.error('Error al cargar el producto:', error);
      });

});
