// Set new default font family and font color to mimic Bootstrap's default styling
document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:8000/top-vendidos")  // Cambiá esto si usás prefijo tipo /api/
    .then(response => response.json())
    .then(data => {
      const ctx = document.getElementById("myPieChart").getContext("2d");

      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: data.labels,
          datasets: data.datasets.map(dataset => ({
            ...dataset,
            hoverBackgroundColor: dataset.backgroundColor, // Opcional
            hoverBorderColor: "rgba(234, 236, 244, 1)"
          }))
        },
        options: {
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            caretPadding: 10,
          },
          legend: {
            display: true
          },
          cutoutPercentage: 80,
        }
      });
    })
    .catch(error => {
      console.error("Error al cargar los datos del gráfico:", error);
    });
});