document.addEventListener("DOMContentLoaded",()=>{

    const contenedor = document.getElementById("containergrande");
    let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    let total = 0;

    carrito.forEach(producto => {
    const contenedor = document.getElementById("listaproductos");
    const productoDiv = document.createElement("div");
    productoDiv.classList.add("producto");

    productoDiv.innerHTML = `
        <img src='${producto.imagen}' class="imagenProducto">
        <div class="infoProducto">
        <h2>${producto.nombre}</h2>
        <p>Precio Unitario: $${producto.precio}</p>
        <p>Cantidad: ${producto.cantidad}</p>
        </div>
        <div class="containerBotones"><button class="quitar" id="${producto.id}">-</button><button class="agregar" id="${producto.id}">+</button>
        </div>
    `; 
    contenedor.appendChild(productoDiv);

    total += producto.precio * producto.cantidad;
});
    document.getElementById("payresult").innerHTML = `<h2>Precio Total: $${total}</h2>`;
});