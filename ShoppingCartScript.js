let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

let productoTotal = 0
let total = 0
let contador = 0

document.addEventListener("DOMContentLoaded",()=>{

    const contenedor = document.getElementById("containergrande");

    carrito.forEach(producto => {
    const contenedor = document.getElementById("listaproductos");
    const productoDiv = document.createElement("div");
    productoDiv.classList.add("producto");

    productoDiv.innerHTML = `
        <img src='${producto.imagen}' class="imagenProducto">
        <div class="infoProducto">
            <h2>${producto.nombre}</h2>
            <p>Precio Unitario: $${producto.precio}</p>
            <p id="precio-${producto.id}">SubTotal: $${producto.cantidad*producto.precio}</p>
        </div>
        <div class="containerBotones" id="${producto.id}">
            <button class="quitar">-</button>
            <p id="cantidad-${producto.id}">Cantidad: ${producto.cantidad}</p>
            <button class="agregar">+</button>
        </div>
        <button class="eliminar">X</button>
    `; 
    contenedor.appendChild(productoDiv);

    total += producto.precio * producto.cantidad;
    productoTotal += producto.cantidad;
});
    document.getElementById("payresult").innerHTML = `<h2 id="productosTotales">Cantidad de Productos Totales: ${productoTotal}</h2><h2>Precio Total: $${total}</h2>`;

    const buttonAgregar = document.querySelectorAll(".agregar")   
    const buttonQuitar = document.querySelectorAll(".quitar")   
    const buttonEliminar = document.querySelectorAll(".eliminar");
    const payResultContenedor = document.getElementById("payresult");
    actualizarPayResult();
    
    buttonAgregar.forEach(butt => {
        butt.addEventListener('click', add);
    });
    
    buttonQuitar.forEach(butt => {
        butt.addEventListener('click', remove);
    });

    buttonEliminar.forEach(butt => {
        butt.addEventListener("click", eliminarProducto);
    });
    payResultContenedor.addEventListener("click", (e) => {
    if (e.target.classList.contains("pagar")) {
        pagar();
    }
});
});
function recalcularTotales(){

    total = 0;
    productoTotal = 0;
    contador = 0

    carrito.forEach(producto => {
        total += producto.precio * producto.cantidad;
        productoTotal += producto.cantidad;
        contador += producto.cantidad
    });

}

function eliminarProducto(e){

    const boton = e.target;
    const pDiv = boton.parentNode;
    const idProducto = pDiv.id;

    carrito = carrito.filter(producto => producto.id !== idProducto);

    sessionStorage.setItem("carrito", JSON.stringify(carrito));

    const productoDiv = pDiv.parentNode;
    productoDiv.remove();

    recalcularTotales();
    document.getElementById("payresult").innerHTML = `<h2 id="productosTotales">Cantidad de Productos Totales: ${productoTotal}</h2><h2>Precio Total: $${total}</h2>`;
    toggleEmptyMessage();
    actualizarPayResult()
}

function actualizarPayResult(){
    recalcularTotales();
    const payResult = document.getElementById("payresult");
    payResult.innerHTML = `<h2 id="productosTotales">Cantidad de Productos Totales: ${productoTotal}</h2><h2>Precio Total: $${total}</h2><button class="pagar">Pagar</button>`;
    toggleEmptyMessage();
}
function pagar(){
    sessionStorage.setItem("totalAPagar", total); 
    sessionStorage.setItem("carrito", JSON.stringify(carrito));
    window.location.href = "Ventas.html";
}

function remove(e){
    const boton = e.target;
    let pDiv = boton.parentNode
    const idProducto = pDiv.id

    const productoCarrito = carrito.find(i => i.id === idProducto);

    if (productoCarrito.cantidad > 1){
        productoCarrito.cantidad--;
        productoTotal--
        total -= productoCarrito.precio

        actualizarPayResult()
        document.getElementById(`cantidad-${productoCarrito.id}`).innerHTML = `Cantidad: ${productoCarrito.cantidad}`;
        document.getElementById(`precio-${productoCarrito.id}`).innerHTML = `SubTotal: $${productoCarrito.cantidad*productoCarrito.precio}`;

        sessionStorage.setItem("carrito", JSON.stringify(carrito));
        recalcularTotales()
    }
}

function add(e){
    
    const boton = e.target;
    let pDiv = boton.parentNode
    const idProducto = pDiv.id

    const productoCarrito = carrito.find(i => i.id === idProducto);
    
    if (productoCarrito.cantidad >= 0){
        productoCarrito.cantidad++;
        productoTotal++
        total += productoCarrito.precio
        actualizarPayResult()
        document.getElementById(`cantidad-${productoCarrito.id}`).innerHTML = `Cantidad: ${productoCarrito.cantidad}`;
        document.getElementById(`precio-${productoCarrito.id}`).innerHTML = `SubTotal: $${productoCarrito.cantidad*productoCarrito.precio}`;
        sessionStorage.setItem("carrito", JSON.stringify(carrito));
        recalcularTotales()
        
    }
}

function toggleEmptyMessage(){
    const emptyEl = document.getElementById('empty');
    const payEl = document.getElementById('payresult');
    if(carrito.length === 0){
        emptyEl.style.display = 'block';
        payEl.style.display = 'none';
    } else {
        emptyEl.style.display = 'none';
        payEl.style.display = 'block';
    }
}


toggleEmptyMessage();