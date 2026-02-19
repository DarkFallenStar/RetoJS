//Ponemos esto pa que se ejecute despues de la carga del HTML, para que asi cargue todo fino

function Producto(id,nombre, stock, precio) {
    this.id = id;
    this.nombre = nombre;
    this.stock = stock;
    this.precio = precio;
}

const coca= new Producto("Coca-cola", 10, 1500);
const pepsi= new Producto("Pepsi", 15, 1400);
const sprite= new Producto("Sprite", 20, 1300);
const fanta= new Producto("Fanta", 25, 1200);

const Productos = [coca, pepsi, sprite, fanta];

document.addEventListener('DOMContentLoaded', () => {

    function crearTarjeta(producto) {
        const contenedor = document.getElementById("contenido");
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta");
        tarjeta.innerHTML = `
        <h2>${producto.nombre}</h2>
        <p>Stock: ${producto.stock}</p>
        <p>Precio: $${producto.precio}</p>
        `;
        contenedor.appendChild(tarjeta)
    }
    Productos.forEach(producto => {
        crearTarjeta(producto);
    });


});

