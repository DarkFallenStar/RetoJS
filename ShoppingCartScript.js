document.addEventListener("DOMContentLoaded",()=>{

    const contenedor = document.getElementById("containergrande");
    let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    let total = 0;

    carrito.forEach(producto => {
    const contenedor = document.getElementById("listaproductos");
    const productoDiv = document.createElement("div");
    productoDiv.classList.add("producto");

    productoDiv.innerHTML = `
        <h3>${producto.nombre} : </h2>
        <p> Precio: $${producto.precio}</p>
        <p>,  Cantidad: ${producto.cantidad}</p>
    `; 

    contenedor.appendChild(productoDiv);
    total += producto.precio * producto.cantidad;
});



    document.getElementById("payresult").innerText = `Total: $${total}`;
});