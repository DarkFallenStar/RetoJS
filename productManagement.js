//Bueno cracks en este javascript vamos a manejar todo lo que tiene que ver productos
function Producto(nombre, stock, precio) {
    this.nombre = nombre;
    this.stock = stock;
    this.precio = precio;
}

const coca= new Producto("Coca-cola", 10, 1500);
const pepsi= new Producto("Pepsi", 15, 1400);
const sprite= new Producto("Sprite", 20, 1300);
const fanta= new Producto("Fanta", 25, 1200);

const Productos = [coca, pepsi, sprite, fanta];