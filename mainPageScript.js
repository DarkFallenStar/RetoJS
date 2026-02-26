//Ponemos esto pa que se ejecute despues de la carga del HTML, para que asi cargue todo fino

function Producto(id,nombre, stock, precio, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.stock = stock;
    this.precio = precio;
    this.imagen = imagen;
}

let counter = 0

const papel= new Producto("papel", "Papel resma", 10, 16000, "https://tauro.com.co/wp-content/uploads/2020/02/Papel-resma-Marfil-430x490.jpg");
const tijera= new Producto("Tijeras", "Tijeras", 20, 6100, "https://officemax.vtexassets.com/arquivos/ids/1347697/35697_1.jpg?v=638158814488200000");
const legajador= new Producto("Legajador carta", "Legajador carta", 5, 7750,"https://tauro.com.co/wp-content/uploads/2019/12/83525-430x490.png");
const lapicero= new Producto("lapicero", "lapicero", 99, 700,"https://tauro.com.co/wp-content/uploads/2019/12/11635.png");
const Cinta= new Producto("Cinta", "Cinta", 32, 5700,"https://tauro.com.co/wp-content/uploads/2019/12/131723-430x490.png");
const Colores= new Producto("Colores", "Colores", 18, 1200,"https://tauro.com.co/wp-content/uploads/2019/12/139867-300x300.png");
const Bond= new Producto("Bond", "Papel bond", 10, 2400,"https://tauro.com.co/wp-content/uploads/2020/05/PAPEL-BOND.jpg");
const Borrador= new Producto("Borrador", "Borrador", 210, 550,"https://tauro.com.co/wp-content/uploads/2021/02/10502-430x490.jpg");
const Cuaderno= new Producto("Cuaderno", "Cuaderno", 22, 700,"https://tauro.com.co/wp-content/uploads/2025/01/CUADERNO-COSIDO-DOBLE-RAYADO-SURT-FAMA-430x490.jpg");
const Grapas= new Producto("Grapas", "Grapas", 4, 4050,"https://tauro.com.co/wp-content/uploads/2019/12/11484.png");
const Temperas =new Producto("Temperas", "Temperas", 8, 2300,"https://tauro.com.co/wp-content/uploads/2025/01/Tempera-Marfil-6-colores-430x490.jpg");
const Sacapuntas =new Producto("Sacapuntas", "Sacapuntas", 50, 1500,"https://tauro.com.co/wp-content/uploads/2022/01/36733-430x490.jpg");
const Productos = [papel, tijera, legajador, lapicero,Cinta,Colores,Bond,Borrador,Cuaderno, Grapas, Temperas, Sacapuntas];

const alertaNoti = document.getElementById("alertaNoti")

let timeoutId = null

let elementosComprados = JSON.parse(sessionStorage.getItem("carrito")) || [];

document.addEventListener('DOMContentLoaded', () => {

    function crearTarjeta(producto) {
        const contenedor = document.getElementById("contenido");
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta");
        tarjeta.setAttribute("id", `tarjeta-${producto.id}`);
        tarjeta.innerHTML = `
        <div class="imgContainer"><img src="${producto.imagen}" class="imagenProducto"></div>
        <div class="info">
        <h2>${producto.nombre}</h2>
        <p id="stock-${producto.id}">Stock: ${producto.stock}</p>
        <p>Precio: $${producto.precio}</p>
        </div>
        <button class="ponerCarro" id="${producto.id}">Agregar a carrito</button>
        `;
        contenedor.appendChild(tarjeta)
    }
    Productos.forEach(producto => {
        crearTarjeta(producto);
    });
    
    const buttons = document.querySelectorAll(".ponerCarro")   
    
    buttons.forEach(butt => {
        butt.addEventListener('click', addCounter);
    });
    let resultado= document.getElementById("resultado")
    let search=document.getElementById("search")
    buscarProductos()
    recalcularCounter()
    document.getElementById("contador").innerHTML = counter;
});


function recalcularCounter(){
    counter = 0

    elementosComprados.forEach(producto => {
        counter += producto.cantidad
    });

}

function buscarProductos() {
    search.addEventListener("input", e=>{
        const inpuText= e.target.value.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const filtro = Productos.filter(i => i.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(inpuText))
        let antifiltro = Productos.filter(i => !i.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(inpuText))
        
        console.log(antifiltro)

        if (inpuText === ""){
            filtro.forEach(i => {
                const id = i.id
                child = document.getElementById(`${id}`)
                pDiv = child.parentNode
                console.log(pDiv);
                pDiv.classList.remove("remove");
                pDiv.classList.add("showDiv");
            })
        }
        else{
            filtro.forEach(i => {
                const id = i.id
                child = document.getElementById(`${id}`)
                pDiv = child.parentNode
                console.log(pDiv);
                pDiv.classList.remove("remove");
                pDiv.classList.add("showDiv");
            })

            antifiltro.forEach(i => {
                const id = i.id
                child = document.getElementById(`${id}`)
                pDiv = child.parentNode
                console.log(pDiv);
                pDiv.classList.add("remove");
            });
        }
    })
}
function addCounter(e){

    const boton = e.target;
    const idProducto = boton.id 
    const producto = Productos.find(i => i.id === idProducto);

    let productoEnCarrito = elementosComprados.find(p => p.id === producto.id);

    if (productoEnCarrito) {
            productoEnCarrito.cantidad++;
        } else {
            elementosComprados.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: producto.imagen,
                cantidad: 1
            }); 
        }
        sessionStorage.setItem("carrito", JSON.stringify(elementosComprados));

    if (producto.stock > 0){
        producto.stock--;
        document.getElementById(`stock-${producto.id}`).innerHTML = `Stock: ${producto.stock}`;

        counter++
        recalcularCounter()
        document.getElementById("contador").innerHTML = counter;

        alertaNoti.classList.remove("hide", "remove", "show");
        void alertaNoti.offsetWidth;
        alertaNoti.classList.add("show");

        

        if (producto.stock <= 0){
            document.getElementById(`${producto.id}`).innerHTML = `Agotado`;

            
            boton.classList.remove("ponerCarro")
            boton.classList.add("disabledButton")
        }

        if (timeoutId) {
        clearTimeout(timeoutId);
        }
        document.getElementById("alertMsj").innerHTML = `Se ha añadido: <strong>${producto.nombre}</strong> al carrito de compras`;
        timeoutId = setTimeout(() => {
            alertaNoti.classList.remove("show");
            alertaNoti.classList.add("hide");

            alertaNoti.addEventListener("animationend", (e) => {
                if (alertaNoti.classList.contains("show") == false){
                    alertaNoti.classList.add("remove")
                }
            }, {
                once: true,
            })
        },3000)
    }
}