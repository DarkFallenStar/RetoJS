// ============================================================
//  DATA LAYER — productos guardados en localStorage
// ============================================================

const DEFAULT_PRODUCTS = [
    { id: "papel",      nombre: "Papel resma",      stock: 10, precio: 16000, imagen: "https://tauro.com.co/wp-content/uploads/2020/02/Papel-resma-Marfil-430x490.jpg" },
    { id: "Tijeras",    nombre: "Tijeras",           stock: 20, precio: 6100,  imagen: "https://officemax.vtexassets.com/arquivos/ids/1347697/35697_1.jpg?v=638158814488200000" },
    { id: "Legajador",  nombre: "Legajador carta",   stock: 5,  precio: 7750,  imagen: "https://tauro.com.co/wp-content/uploads/2019/12/83525-430x490.png" },
    { id: "lapicero",   nombre: "Lapicero",          stock: 99, precio: 700,   imagen: "https://tauro.com.co/wp-content/uploads/2019/12/11635.png" },
    { id: "Cinta",      nombre: "Cinta",             stock: 32, precio: 5700,  imagen: "https://tauro.com.co/wp-content/uploads/2019/12/131723-430x490.png" },
    { id: "Colores",    nombre: "Colores",           stock: 18, precio: 1200,  imagen: "https://tauro.com.co/wp-content/uploads/2019/12/139867-300x300.png" },
    { id: "Bond",       nombre: "Papel bond",        stock: 10, precio: 2400,  imagen: "https://tauro.com.co/wp-content/uploads/2020/05/PAPEL-BOND.jpg" },
    { id: "Borrador",   nombre: "Borrador",          stock: 210, precio: 550,  imagen: "https://tauro.com.co/wp-content/uploads/2021/02/10502-430x490.jpg" },
    { id: "Cuaderno",   nombre: "Cuaderno",          stock: 22, precio: 700,   imagen: "https://tauro.com.co/wp-content/uploads/2025/01/CUADERNO-COSIDO-DOBLE-RAYADO-SURT-FAMA-430x490.jpg" },
    { id: "Grapas",     nombre: "Grapas",            stock: 4,  precio: 4050,  imagen: "https://tauro.com.co/wp-content/uploads/2019/12/11484.png" },
    { id: "Temperas",   nombre: "Temperas",          stock: 8,  precio: 2300,  imagen: "https://tauro.com.co/wp-content/uploads/2025/01/Tempera-Marfil-6-colores-430x490.jpg" },
    { id: "Sacapuntas", nombre: "Sacapuntas",        stock: 50, precio: 1500,  imagen: "https://tauro.com.co/wp-content/uploads/2022/01/36733-430x490.jpg" },
];

function loadProducts() {
    const stored = localStorage.getItem("productos");
    if (stored) return JSON.parse(stored);
    // First time: seed from defaults
    localStorage.setItem("productos", JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
}

function saveProducts(products) {
    localStorage.setItem("productos", JSON.stringify(products));
}

let Productos = loadProducts();

// ============================================================
//  CART — stored in sessionStorage
// ============================================================

let elementosComprados = JSON.parse(sessionStorage.getItem("carrito")) || [];

function saveCart() {
    sessionStorage.setItem("carrito", JSON.stringify(elementosComprados));
}

// ============================================================
//  NOTIFICATION
// ============================================================

const alertaNoti = document.getElementById("alertaNoti");
let timeoutId = null;

function showNotification(mensaje, tipo = "success") {
    alertaNoti.classList.remove("hide", "remove", "show");
    void alertaNoti.offsetWidth;
    alertaNoti.classList.add("show");
    document.getElementById("alertMsj").innerHTML = mensaje;

    // Change icon color based on type
    const iconBg = document.getElementById("alertIcon");
    iconBg.style.backgroundColor = tipo === "error" ? "#e53e3e" : "#17a34a";

    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        alertaNoti.classList.remove("show");
        alertaNoti.classList.add("hide");
        alertaNoti.addEventListener("animationend", () => {
            if (!alertaNoti.classList.contains("show")) {
                alertaNoti.classList.add("remove");
            }
        }, { once: true });
    }, 3000);
}

document.getElementById("alertClose").addEventListener("click", () => {
    if (timeoutId) clearTimeout(timeoutId);
    alertaNoti.classList.remove("show");
    alertaNoti.classList.add("hide");
    alertaNoti.addEventListener("animationend", () => {
        alertaNoti.classList.add("remove");
    }, { once: true });
});

// ============================================================
//  RENDER PRODUCT CARDS
// ============================================================

function crearTarjeta(producto) {
    const contenedor = document.getElementById("contenido");
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta");
    tarjeta.setAttribute("id", `tarjeta-${producto.id}`);
    tarjeta.innerHTML = `
        <div class="imgContainer"><img src="${producto.imagen}" class="imagenProducto" onerror="this.src='https://cdn-icons-png.flaticon.com/512/1178/1178479.png'"></div>
        <div class="info">
            <h2>${producto.nombre}</h2>
            <p id="stock-${producto.id}">Stock: ${producto.stock}</p>
            <p>Precio: $${producto.precio.toLocaleString()}</p>
        </div>
        <button class="ponerCarro ${producto.stock <= 0 ? 'disabledButton' : ''}" 
                id="btn-${producto.id}" 
                data-id="${producto.id}"
                ${producto.stock <= 0 ? 'disabled' : ''}>
            ${producto.stock <= 0 ? 'Agotado' : 'Agregar a carrito'}
        </button>
    `;
    contenedor.appendChild(tarjeta);

    if (producto.stock > 0) {
        tarjeta.querySelector(`#btn-${producto.id}`).addEventListener("click", addToCart);
    }
}

function renderAllCards() {
    document.getElementById("contenido").innerHTML = "";
    Productos.forEach(p => crearTarjeta(p));
    buscarProductos();
}

// ============================================================
//  CART LOGIC
// ============================================================

function addToCart(e) {
    const idProducto = e.target.dataset.id;
    const producto = Productos.find(p => p.id === idProducto);
    if (!producto || producto.stock <= 0) return;

    // Decrease stock
    producto.stock--;
    saveProducts(Productos);

    // Update stock display
    document.getElementById(`stock-${producto.id}`).innerHTML = `Stock: ${producto.stock}`;

    if (producto.stock <= 0) {
        const btn = document.getElementById(`btn-${producto.id}`);
        btn.innerHTML = "Agotado";
        btn.classList.remove("ponerCarro");
        btn.classList.add("disabledButton");
        btn.disabled = true;
    }

    // Add to cart array
    const existente = elementosComprados.find(p => p.id === idProducto);
    if (existente) {
        existente.cantidad++;
    } else {
        elementosComprados.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }
    saveCart();

    renderCart();
    recalcularCounter();

    showNotification(`Se añadió: <strong>${producto.nombre}</strong> al carrito`);
}

// ============================================================
//  LIVE CART RENDER
// ============================================================

function renderCart() {
    const container = document.getElementById("cartItemsContainer");
    const emptyEl = document.getElementById("empty");
    const payEl = document.getElementById("payresult");

    container.innerHTML = "";

    if (elementosComprados.length === 0) {
        emptyEl.style.display = "block";
        payEl.style.display = "none";
        return;
    }

    emptyEl.style.display = "none";
    payEl.style.display = "flex";

    elementosComprados.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <div class="infoProducto">
                <h2>${producto.nombre}</h2>
                <p>Precio Unitario: $${producto.precio.toLocaleString()}</p>
                <p id="precio-${producto.id}">SubTotal: $${(producto.precio * producto.cantidad).toLocaleString()}</p>
            </div>
            <div class="containerBotones" id="cbtns-${producto.id}">
                <button class="quitar" data-id="${producto.id}">-</button>
                <p id="cantidad-${producto.id}"><strong>${producto.cantidad}</strong></p>
                <button class="agregar" data-id="${producto.id}">+</button>
                <button class="eliminar" data-id="${producto.id}">x</button>
            </div>
        `;
        container.appendChild(div);
    });

    // Attach listeners
    container.querySelectorAll(".agregar").forEach(b => b.addEventListener("click", cartAdd));
    container.querySelectorAll(".quitar").forEach(b => b.addEventListener("click", cartRemove));
    container.querySelectorAll(".eliminar").forEach(b => b.addEventListener("click", cartDelete));

    renderPayResult();
}

function renderPayResult() {
    const total = elementosComprados.reduce((s, p) => s + p.precio * p.cantidad, 0);
    const totalUnits = elementosComprados.reduce((s, p) => s + p.cantidad, 0);
    const payEl = document.getElementById("payresult");
    payEl.innerHTML = `
        <h2>Cantidad de Productos: ${totalUnits}</h2>
        <h2>Precio Total: $${total.toLocaleString()}</h2>
        <button class="pagar" id="btnPagar">Pagar</button>
    `;
    document.getElementById("btnPagar").addEventListener("click", pagar);
}

function cartAdd(e) {
    const id = e.target.dataset.id;
    const prod = Productos.find(p => p.id === id);
    const cartProd = elementosComprados.find(p => p.id === id);

    if (!cartProd) return;

    if (prod && prod.stock <= 0) {
        showNotification(`No hay más stock de <strong>${cartProd.nombre}</strong>`, "error");
        return;
    }

    cartProd.cantidad++;
    if (prod) {
        prod.stock--;
        saveProducts(Productos);
        document.getElementById(`stock-${id}`).innerHTML = `Stock: ${prod.stock}`;
        if (prod.stock <= 0) {
            const btn = document.getElementById(`btn-${id}`);
            if (btn) {
                btn.innerHTML = "Agotado";
                btn.classList.remove("ponerCarro");
                btn.classList.add("disabledButton");
                btn.disabled = true;
            }
        }
    }

    saveCart();
    renderCart();
    recalcularCounter();
}

function cartRemove(e) {
    const id = e.target.dataset.id;
    const boton = e.target;
    const cartProd = elementosComprados.find(p => p.id === id);
    const prod = Productos.find(p => p.id === id);

    if (!cartProd || cartProd.cantidad <= 1) {
        showNotification(`No se puede dejar en 0`, "error")
        /*console.log("pepe");
        boton.classList.add("disabledButton");
        boton.disabled = true;*/
        return;
    }
    else{
        /*boton.disabled = false;*/ 
    }
    
    cartProd.cantidad--;
    if (prod) {
        prod.stock++;
        saveProducts(Productos);
        document.getElementById(`stock-${id}`).innerHTML = `Stock: ${prod.stock}`;
        // Re-enable button if it was disabled
        const btn = document.getElementById(`btn-${id}`);
        if (btn && prod.stock > 0) {
            btn.innerHTML = "Agregar a carrito";
            btn.classList.add("ponerCarro");
            btn.classList.remove("disabledButton");
            btn.disabled = false;
            btn.addEventListener("click", addToCart);
        }
    }

    saveCart();
    renderCart();
    recalcularCounter();
}

function cartDelete(e) {
    const id = e.target.dataset.id;
    const cartProd = elementosComprados.find(p => p.id === id);
    const prod = Productos.find(p => p.id === id);

    if (confirm("¿Estás segur@ de que quieres quitar este producto del carrito?") == false){
        return
    };

    if (cartProd && prod) {
        prod.stock += cartProd.cantidad;
        saveProducts(Productos);
        document.getElementById(`stock-${id}`).innerHTML = `Stock: ${prod.stock}`;
        const btn = document.getElementById(`btn-${id}`);
        if (btn && prod.stock > 0) {
            btn.innerHTML = "Agregar a carrito";
            btn.classList.add("ponerCarro");
            btn.classList.remove("disabledButton");
            btn.disabled = false;
            btn.addEventListener("click", addToCart);
        }
    }

    elementosComprados = elementosComprados.filter(p => p.id !== id);
    saveCart();
    renderCart();
    recalcularCounter();
}

function pagar() {
    const total = elementosComprados.reduce((s, p) => s + p.precio * p.cantidad, 0);
    window.open("Ventas.html", "_blank");
    alert(`¡Gracias por tu compra! Total pagado: $${total.toLocaleString()}`);
    elementosComprados = [];
    saveCart();
    renderCart();
    recalcularCounter();
}

// ============================================================
//  COUNTER
// ============================================================

function recalcularCounter() {
    const counter = elementosComprados.reduce((s, p) => s + p.cantidad, 0);
    document.getElementById("contador").innerHTML = counter;
}

// ============================================================
//  SEARCH
// ============================================================

let antifiltro = [];

function buscarProductos() {
    const search = document.getElementById("search");
    search.removeEventListener("input", handleSearch); // avoid duplicate listeners
    search.addEventListener("input", handleSearch);
}

function handleSearch(e) {
    const inputText = e.target.value.toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const filtro = Productos.filter(i =>
        i.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(inputText)
    );
    antifiltro = Productos.filter(i =>
        !i.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(inputText)
    );

    filtro.forEach(i => {
        const tarjeta = document.getElementById(`tarjeta-${i.id}`);
        if (tarjeta) { tarjeta.classList.remove("remove"); tarjeta.classList.add("showDiv"); }
    });
    antifiltro.forEach(i => {
        const tarjeta = document.getElementById(`tarjeta-${i.id}`);
        if (tarjeta) { tarjeta.classList.add("remove"); }
    });

    toggleEmptyMessage();
}

function toggleEmptyMessage() {
    const emptyEl = document.getElementById("buscadorVacio");
    emptyEl.style.display = antifiltro.length === Productos.length ? "block" : "none";
}

// ============================================================
//  CRUD MODAL
// ============================================================

const crudOverlay = document.getElementById("crudOverlay");
const openCrudBtn = document.getElementById("openCrud");
const closeCrudBtn = document.getElementById("closeCrud");
const productForm = document.getElementById("productForm");
const cancelEditBtn = document.getElementById("cancelEdit");

openCrudBtn.addEventListener("click", (e) => {
    e.preventDefault();
    crudOverlay.classList.remove("remove");
    void crudOverlay.offsetWidth;
    crudOverlay.classList.add("crudVisible");
    renderCrudList();
});

function closeCrud() {
    crudOverlay.classList.remove("crudVisible");
    crudOverlay.addEventListener("transitionend", () => {
        crudOverlay.classList.add("remove");
    }, { once: true });
    resetForm();
}

closeCrudBtn.addEventListener("click", closeCrud);
crudOverlay.addEventListener("click", (e) => { if (e.target === crudOverlay) closeCrud(); });

cancelEditBtn.addEventListener("click", resetForm);

function resetForm() {
    productForm.reset();
    document.getElementById("editId").value = "";
    document.getElementById("formSubmitBtn").textContent = "Guardar Producto";
    cancelEditBtn.classList.add("remove");
}

productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editId = document.getElementById("editId").value;
    const nombre = document.getElementById("formName").value.trim();
    const precio = parseInt(document.getElementById("formPrice").value);
    const stock = parseInt(document.getElementById("formStock").value);
    const imagen = document.getElementById("formImage").value.trim();

    if (!nombre || !precio || stock < 0 || !imagen) return;

    if (editId) {
        // EDIT existing product
        const idx = Productos.findIndex(p => p.id === editId);
        if (idx !== -1) {
            Productos[idx] = { ...Productos[idx], nombre, precio, stock, imagen };
            saveProducts(Productos);
            showNotification(`Producto <strong>${nombre}</strong> actualizado`);
        }
    } else {
        // ADD new product — generate unique id from name
        const newId = nombre.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
        if (Productos.find(p => p.id === newId)) {
            showNotification("Ya existe un producto con ese nombre", "error");
            return;
        }
        Productos.push({ id: newId, nombre, precio, stock, imagen });
        saveProducts(Productos);
        showNotification(`Producto <strong>${nombre}</strong> agregado`);
    }

    resetForm();
    renderAllCards();
    renderCrudList();
});

function renderCrudList() {
    const list = document.getElementById("crudProductList");
    list.innerHTML = "<h3>Productos existentes</h3>";

    if (Productos.length === 0) {
        list.innerHTML += "<p>No hay productos.</p>";
        return;
    }

    Productos.forEach(p => {
        const row = document.createElement("div");
        row.classList.add("crudRow");
        row.innerHTML = `
            <img src="${p.imagen}" class="crudThumb" onerror="this.src='https://cdn-icons-png.flaticon.com/512/1178/1178479.png'">
            <div class="crudRowInfo">
                <strong>${p.nombre}</strong>
                <span>$${p.precio.toLocaleString()}<br>Stock: ${p.stock}</span>
            </div>
            <div class="crudRowBtns">
                <button class="btnEditar" data-id="${p.id}"><i class="fa-solid fa-pen"></i></button>
                <button class="btnEliminar" data-id="${p.id}"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        list.appendChild(row);
    });

    list.querySelectorAll(".btnEditar").forEach(b => b.addEventListener("click", startEdit));
    list.querySelectorAll(".btnEliminar").forEach(b => b.addEventListener("click", deleteProduct));
}

function startEdit(e) {
    const id = e.currentTarget.dataset.id;
    const prod = Productos.find(p => p.id === id);
    if (!prod) return;

    document.getElementById("editId").value = prod.id;
    document.getElementById("formName").value = prod.nombre;
    document.getElementById("formPrice").value = prod.precio;
    document.getElementById("formStock").value = prod.stock;
    document.getElementById("formImage").value = prod.imagen;
    document.getElementById("formSubmitBtn").textContent = "Actualizar Producto";
    cancelEditBtn.classList.remove("remove");

    // Scroll to top of modal
    document.getElementById("crudModal").scrollTop = 0;
}

function deleteProduct(e) {
    const id = e.currentTarget.dataset.id;
    const prod = Productos.find(p => p.id === id);
    if (!prod) return;

    if (!confirm(`¿Eliminar "${prod.nombre}"? Esta acción no se puede deshacer.`)) return;

    Productos = Productos.filter(p => p.id !== id);
    saveProducts(Productos);

    // Also remove from cart
    const wasInCart = elementosComprados.find(p => p.id === id);
    if (wasInCart) {
        elementosComprados = elementosComprados.filter(p => p.id !== id);
        saveCart();
        renderCart();
        recalcularCounter();
    }

    showNotification(`Producto <strong>${prod.nombre}</strong> eliminado`);
    renderAllCards();
    renderCrudList();
    resetForm();
}

// ============================================================
//  INIT
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    renderAllCards();
    renderCart();
    recalcularCounter();
});
