document.addEventListener("DOMContentLoaded", () => {
  const contenedorPlatos = document.querySelector(".contenedor-platos");
  const contenedorExtras = document.querySelector(".contenedor-extras");
  const contenedorBebidas = document.querySelector(".contenedor-bebidas");

  if (!contenedorPlatos || !contenedorExtras || !contenedorBebidas) {
    console.error("Faltan uno o más contenedores: .contenedor-platos, .contenedor-extras, .contenedor-bebidas");
    return;
  }

  const modalHTML = `
    <div class="modal-overlay" id="productModal" style="display: none;">
      <div class="modal-container">
        <div class="modal-header-product">
          <h3 id="modalProductName"></h3>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <div class="modal-image-container">
            <img id="modalProductImage" src="" alt="" class="modal-product-image">
          </div>
          <div class="modal-details">
            <p class="product-description" id="modalProductDescription"></p>
            <div class="modal-quantity">
              <p>Cantidad</p>
              <div class="quantity-selector">
                <button class="quantity-btn minus">-</button>
                <span class="quantity">2 PROD.</span>
                <button class="quantity-btn plus">+</button>
              </div>
            </div>
            <div class="modal-price">
              <p>Precio</p>
              <p class="temperature" id="modalProductPrice"></p>
            </div>
          </div> 
          <button id="btnAddToCart" class="btn-confirm">Añadir al pedido</button>

        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modal = document.getElementById("productModal");
  const closeModal = document.querySelector(".close-modal");
  const modalProductName = document.getElementById("modalProductName");
  const modalProductImage = document.getElementById("modalProductImage");
  const modalProductDescription = document.getElementById("modalProductDescription");
  const modalProductPrice = document.getElementById("modalProductPrice");
  const quantityElement = document.querySelector(".modal-quantity .quantity");
  const minusBtn = document.querySelector(".modal-quantity .minus");
  const plusBtn = document.querySelector(".modal-quantity .plus");
  const btnAddToCart = document.getElementById("btnAddToCart");
  const cartItemsContainer = document.getElementById("cartItemsContainer");
  const cartTotalElements = document.querySelectorAll(".cartTotal");

  let quantity = 2;
  let currentProduct = null;
  let carrito = [];

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  minusBtn.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      quantityElement.textContent = `${quantity} PROD.`;
      updateTotalPrice();
    }
  });

  plusBtn.addEventListener("click", () => {
    quantity++;
    quantityElement.textContent = `${quantity} PROD.`;
    updateTotalPrice();
  });

  function updateTotalPrice() {
    const pricePerUnit = currentProduct ? currentProduct.precio_venta : 0;
    const totalPrice = pricePerUnit * quantity;
    modalProductPrice.textContent = `Bs. ${totalPrice.toFixed(2)}`;
  }

  function agregarAlCarrito(producto, cantidad) {
    const index = carrito.findIndex(p => p.id_producto === producto.id_producto);
    if (index !== -1) {
      carrito[index].cantidad += cantidad;
    } else {
      carrito.push({ ...producto, cantidad });
    }
  }

  btnAddToCart.addEventListener("click", () => {
    if (currentProduct) {
      agregarAlCarrito(currentProduct, quantity);
      renderResumenCarrito();
      modal.style.display = "none";
    }
  });


  class ItemRenderer {
    constructor(producto) {
      this.producto = producto;
    }
  
    render() {
      const subtotal = this.producto.cantidad * this.producto.precio_venta;
      const item = document.createElement("li");
      item.className = "list-group-item d-flex justify-content-between lh-sm align-items-center";
  
      item.innerHTML = `
        <div>
          <h6 class="my-0">${this.producto.nombre}</h6>
          <small class="text-body-secondary">Cantidad: ${this.producto.cantidad}</small>
          <br><span class="badge bg-info">${this.producto.categoria}</span>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-danger btn-adjust" data-id="${this.producto.id_producto}" data-action="decrease">
            <i class="ri-subtract-line"></i>
          </button>
          <button class="btn btn-sm btn-outline-success btn-adjust" data-id="${this.producto.id_producto}" data-action="increase">
            <i class="ri-add-line"></i>
          </button>
          <span class="text-body-secondary">Bs. ${subtotal.toFixed(2)}</span>
        </div>
      `;
      return item;
    }
  }
  
  class PlatosRenderer extends ItemRenderer {}
  class ExtrasRenderer extends ItemRenderer {}
  class BebidasRenderer extends ItemRenderer {}
  
  function ItemRendererFactory(producto) {
    switch ((producto.categoria || "").toLowerCase()) {
      case "platos":
        return new PlatosRenderer(producto);
      case "extras":
        return new ExtrasRenderer(producto);
      case "bebidas":
        return new BebidasRenderer(producto);
      default:
        return new ItemRenderer(producto);
    }
  }
  

  function renderResumenCarrito() {
    cartItemsContainer.innerHTML = "";
    let totalCompra = 0;
    let totalCantidad = 0;
  
    const categoriasAgrupadas = {};
    carrito.forEach(prod => {
      const cat = (prod.categoria || "otros").toLowerCase();
      if (!categoriasAgrupadas[cat]) {
        categoriasAgrupadas[cat] = [];
      }
      categoriasAgrupadas[cat].push(prod);
    });
  
    const ordenCategorias = ["platos", "extras", "bebidas"];
  
    ordenCategorias.concat(Object.keys(categoriasAgrupadas).filter(cat => !ordenCategorias.includes(cat)))
      .forEach(cat => {
        const productos = categoriasAgrupadas[cat];
        if (!productos) return;
  
        const header = document.createElement("li");
        header.className = "list-group-item active";
        header.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        cartItemsContainer.appendChild(header);
  
        productos.forEach(prod => {
          const renderer = ItemRendererFactory(prod);
          const item = renderer.render();
          cartItemsContainer.appendChild(item);
  
          const subtotal = prod.cantidad * prod.precio_venta;
          totalCompra += subtotal;
          totalCantidad += prod.cantidad;
        });
      });
  
    cartTotalElements.forEach(element => {
      element.textContent = `Bs. ${totalCompra.toFixed(2)}`;
    });
  
    const cartItemCount = document.getElementById("cartItemCount");
    if (cartItemCount) {
      cartItemCount.textContent = totalCantidad;
      cartItemCount.style.display = totalCantidad > 0 ? "inline-block" : "none";
    }
  
    cartItemsContainer.querySelectorAll(".btn-adjust").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id);
        const action = btn.dataset.action;
        const producto = carrito.find(p => p.id_producto === id);
  
        if (producto) {
          if (action === "increase") producto.cantidad++;
          else if (action === "decrease" && producto.cantidad > 1) producto.cantidad--;
          else if (action === "decrease" && producto.cantidad === 1) {
            carrito = carrito.filter(p => p.id_producto !== id);
          }
          renderResumenCarrito();
        }
      });
    });
  }
  

  

  document.querySelector(".modal-footer .btn-confirm").addEventListener("click", () => {
    if (carrito.length === 0) {
      Swal.fire({
        title: '¡Carrito Vacío!',
        text: 'No puedes confirmar un pedido con el carrito vacío.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#e98305',
        customClass: { 
          confirmButton: 'my-custom-confirm-button' 
        }
      });
      event.preventDefault();
      return;
    }

    const detalles = carrito.map(producto => ({
      id_producto: producto.id_producto,
      cantidad: producto.cantidad,
      precio_unitario: parseFloat(producto.precio_venta),
      subtotal: parseFloat((producto.precio_venta * producto.cantidad).toFixed(2))
    }));

    const total = detalles.reduce((sum, item) => sum + item.subtotal, 0);

    const payload = {
      descripcion: "Pedido generado desde el frontend",
      pedidos: [
        {
          estado: "Pendiente",
          total,
          detalles
        }
      ]
    };


    fetch("http://127.0.0.1:8000/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })


    .then(res => {
      if (!res.ok) throw new Error("Error al enviar el pedido");
      return res.json();
    })

    .then(data => {
      carrito = [];
      renderResumenCarrito();
      modal.style.display = "none";
    })

    .catch(err => {
      console.error("Error al registrar el pedido:", err);
      alert("Hubo un error al registrar el pedido");
    });
    
  });


  function obtenerContenedorPorCategoria(categoria) {
    const cat = categoria?.toLowerCase();
    switch (cat) {
      case "platos":
        return contenedorPlatos;
      case "extras":
        return contenedorExtras;
      case "bebidas":
        return contenedorBebidas;
      default:
        console.warn(`Categoría no reconocida: ${categoria}`);
        return contenedorPlatos;
    }
  }
  


  fetch("http://127.0.0.1:8000/productos")
    .then((res) => res.json())
    .then((productos) => {
      productos.forEach((producto) => {
        const card = document.createElement("div");
        card.className = "col";

        // Truncar descripción a 100 caracteres
        const descripcionTruncada = producto.descripcion.length > 40
        ? producto.descripcion.substring(0, 40) + "..."
        : producto.descripcion;

        card.innerHTML = `
        <div class="product-item">
            <figure>
                <div class="product-image-container">
                    <img src="${producto.imagen || 'assets/img/default-food.png'}"
                         alt="${producto.nombre}"
                         class="product-image"
                         onerror="this.src='assets/img/default-food.png'">
                </div>
            </figure>
            <h3 class="product-title">${producto.nombre}</h3>
            <p class="product-description">${descripcionTruncada}</p>

            <span class="rating">

                <span class="price">Bs. ${producto.precio_venta}</span>

                <div class="d-flex align-items-center justify-content-center">
                    <button class="w-100 btn-lg add-to-cart-btn" data-id="${producto.id_producto}">
                        <i class="ri-shopping-cart-2-line cart-icon"></i>
                        <p class="add-to-cart-text">Seleccionar</p>
                    </button>
                </div>

            </span>
        </div>
    `;

        const categoria = producto.categoria?.toLowerCase();
        if (categoria === "platos") {
          contenedorPlatos.appendChild(card);
        } else if (categoria === "extras") {
          contenedorExtras.appendChild(card);
        } else if (categoria === "bebidas") {
          contenedorBebidas.appendChild(card);
        } else {
          console.warn(`Categoría no reconocida: ${producto.categoria}`);
          contenedorPlatos.appendChild(card);
        }


        const addButton = card.querySelector(".add-to-cart-btn");
        addButton.addEventListener("click", () => {
          currentProduct = producto;
          quantity = 1;

          modalProductName.textContent = producto.nombre;
          if (producto.imagen && producto.imagen.trim() !== "") {
            modalProductImage.src = producto.imagen.trim();
          } else {
            modalProductImage.src = "assets/img/default-food.png";
          }
          modalProductImage.onerror = () => modalProductImage.src = "assets/img/default-food.png";

          modalProductDescription.textContent = producto.descripcion;

          modalProductPrice.textContent = `Bs. ${(producto.precio_venta * quantity).toFixed(2)}`;
          quantityElement.textContent = `${quantity} PROD.`;
          modal.style.display = "flex";
        });
      });
    })
    .catch((error) => {
      console.error("Error al obtener los productos:", error);
    });
});




document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const scrollThreshold = 50;

  function handleScroll() {
      if (window.scrollY > scrollThreshold) {
          header.classList.add('scrolled');
      } else {
          header.classList.remove('scrolled');
      }
  }

  window.addEventListener('scroll', handleScroll);

  handleScroll();
});