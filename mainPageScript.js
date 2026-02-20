//Ponemos esto pa que se ejecute despues de la carga del HTML, para que asi cargue todo fino

function Producto(id,nombre, stock, precio, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.stock = stock;
    this.precio = precio;
    this.imagen = imagen;
}

const coca= new Producto("Plastilina", "Plastilina", 10, 8100, "https://tauro.com.co/wp-content/uploads/2020/07/102534.jpg");
const pepsi= new Producto("Tijera", "Tijera", 15, 6000, "https://officemax.vtexassets.com/arquivos/ids/1347697/35697_1.jpg?v=638158814488200000");
const sprite= new Producto("Papel", "Resma de papel", 20, 13900, "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRwgrNbzVlGirwrODFNp_FcXGa5zCtJDJouxH469MmlcIOHykzGG4zgWu9H2iU4X6LNJeMjB93q77fbfRv7GNHP1gW1i-7aisWJczLGlwKWJUDRZ7QR33eZ2GI");
const fanta= new Producto("Lapices", "Lapices x12 Und", 50, 8944,"https://cdn1.totalcommerce.cloud/normaco/product-image/es/lapices-norma-negros-de-grafito-hexagonal-x12-und-2.webp");
const a= new Producto("Borrador", "Borrador", 90, 550,"https://tauro.com.co/wp-content/uploads/2021/02/10502-300x300.jpg");
const b= new Producto("Boligrafo", "Boligrafo", 110, 700,"https://tauro.com.co/wp-content/uploads/2019/12/11635.png");
const c= new Producto("Grapadora", "Grapadora", 25, 1200,"https://tauro.com.co/wp-content/uploads/2022/06/11117.jpg");
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
        <button class="ponerCarro" id="${producto.id}">Agregar a carrito</button>
        `;
        contenedor.appendChild(tarjeta)
    }
    Productos.forEach(producto => {
        crearTarjeta(producto);
    });
    
    const buttons = document.querySelectorAll(".ponerCarro")   
    
    buttons.forEach(butt => {
        butt.addEventListener('click', addCounter)
        butt.addEventListener('click', showId)
    });
    
    
});
let counter = 0

function addCounter(){
    counter++
    document.getElementById("contador").innerHTML = counter;

    document.getElementById("Pepsi").innerHTML = (pepsi.stock)-1;
}

function showId(event) {
  const id = event.target.id
}




