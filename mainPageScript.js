//Ponemos esto pa que se ejecute despues de la carga del HTML, para que asi cargue todo fino

function Producto(id,nombre, stock, precio, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.stock = stock;
    this.precio = precio;
    this.imagen = imagen;
}

const coca= new Producto("Coca-cola", "Coca-cola", 10, 1500, "https://bevgo.com.co/wp-content/uploads/2021/05/1535.jpg");
const pepsi= new Producto("Pepsi", "Pepsi", 15, 1400, "https://www.pepsicopartners.com/medias/300Wx300H-1-HYK-24760.jpg?context=bWFzdGVyfHJvb3R8MjQxNjB8aW1hZ2UvanBlZ3xhRGcxTDJnMVppOHhNVFV3TURrd09USTVOelk1TkM4ek1EQlhlRE13TUVoZk1TMUlXVXN0TWpRM05qQXVhbkJufDkwMzQzZjNiN2Y2MmJhODU4ZWQ0MGNlMTE1MzBlZDEyZTUyNzljNThjZDRiZTVhOWQ0MmJhNGYyNDAwNjc4ODQ");
const sprite= new Producto("Sprite", "Sprite", 20, 1300);
const fanta= new Producto("Fanta", "Fanta", 25, 1200);
const a= new Producto("Fanta", "Fanta", 25, 1200);
const b= new Producto("Fanta", "Fanta", 25, 1200);
const c= new Producto("Fanta", "Fanta", 25, 1200);
const d= new Producto("Fanta", "Fanta", 25, 1200);
const e= new Producto("Fanta", "Fanta", 25, 1200);

const Productos = [coca, pepsi, sprite, fanta,a,b,c,d,e];

document.addEventListener('DOMContentLoaded', () => {

    function crearTarjeta(producto) {
        const contenedor = document.getElementById("contenido");
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta");
        tarjeta.innerHTML = `
        <img src="${producto.imagen}" class="imagenProducto">
        <h2>${producto.nombre}</h2>
        <p>Stock: ${producto.stock}</p>
        <p>Precio: $${producto.precio}</p>
        <button class="ponerCarro">Agregar a carrito</button>
        `;
        contenedor.appendChild(tarjeta)
    }
    Productos.forEach(producto => {
        crearTarjeta(producto);
    });


});

function addCounter(){
    counter++
    document.getElementById("contador").innerHTML = counter;
}
let counter = 0

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll(".ponerCarro")   

    buttons.forEach(butt => {
        butt.addEventListener('click', addCounter)
    });

});

