// ============================================================
//  DATA LAYER — productos guardados en localStorage
// ============================================================

const DEFAULT_PRODUCTS = [
    { id: "papel",      nombre: "Papel resma",      stock: 10,  precio: 16000, costo: 11000, categoria: "Papelaría",    imagen: "https://tauro.com.co/wp-content/uploads/2020/02/Papel-resma-Marfil-430x490.jpg" },
    { id: "Tijeras",    nombre: "Tijeras",           stock: 20,  precio: 6100,  costo: 3200,  categoria: "Papelaría",    imagen: "https://officemax.vtexassets.com/arquivos/ids/1347697/35697_1.jpg?v=638158814488200000" },
    { id: "Legajador",  nombre: "Legajador carta",   stock: 5,   precio: 7750,  costo: 4500,  categoria: "Organización", imagen: "https://tauro.com.co/wp-content/uploads/2019/12/83525-430x490.png" },
    { id: "lapicero",   nombre: "Lapicero",          stock: 99,  precio: 700,   costo: 350,   categoria: "Escritura",    imagen: "https://tauro.com.co/wp-content/uploads/2019/12/11635.png" },
    { id: "Cinta",      nombre: "Cinta",             stock: 32,  precio: 5700,  costo: 3000,  categoria: "Papelaría",    imagen: "https://tauro.com.co/wp-content/uploads/2019/12/131723-430x490.png" },
    { id: "Colores",    nombre: "Colores",           stock: 18,  precio: 1200,  costo: 600,   categoria: "Arte",         imagen: "https://tauro.com.co/wp-content/uploads/2019/12/139867-300x300.png" },
    { id: "Bond",       nombre: "Papel bond",        stock: 10,  precio: 2400,  costo: 1200,  categoria: "Papelaría",    imagen: "https://tauro.com.co/wp-content/uploads/2020/05/PAPEL-BOND.jpg" },
    { id: "Borrador",   nombre: "Borrador",          stock: 210, precio: 550,   costo: 250,   categoria: "Escritura",    imagen: "https://tauro.com.co/wp-content/uploads/2021/02/10502-430x490.jpg" },
    { id: "Cuaderno",   nombre: "Cuaderno",          stock: 22,  precio: 700,   costo: 400,   categoria: "Organización", imagen: "https://tauro.com.co/wp-content/uploads/2025/01/CUADERNO-COSIDO-DOBLE-RAYADO-SURT-FAMA-430x490.jpg" },
    { id: "Grapas",     nombre: "Grapas",            stock: 4,   precio: 4050,  costo: 2200,  categoria: "Organización", imagen: "https://tauro.com.co/wp-content/uploads/2019/12/11484.png" },
    { id: "Temperas",   nombre: "Temperas",          stock: 8,   precio: 2300,  costo: 1100,  categoria: "Arte",         imagen: "https://tauro.com.co/wp-content/uploads/2025/01/Tempera-Marfil-6-colores-430x490.jpg" },
    { id: "Sacapuntas", nombre: "Sacapuntas",        stock: 50,  precio: 1500,  costo: 700,   categoria: "Escritura",    imagen: "https://tauro.com.co/wp-content/uploads/2022/01/36733-430x490.jpg" },
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
            ${producto.categoria ? `<span class="categoriaBadge">${producto.categoria}</span>` : ''}
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
    if (elementosComprados.length === 0) return;
    metodoPagoSeleccionado = null;
    abrirVentasModal();
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
    document.getElementById("formCategoriaCustom").classList.add("remove");
    cancelEditBtn.classList.add("remove");
}

document.getElementById("formCategoria").addEventListener("change", function () {
    const customInput = document.getElementById("formCategoriaCustom");
    if (this.value === "Otro") {
        customInput.classList.remove("remove");
        customInput.required = true;
    } else {
        customInput.classList.add("remove");
        customInput.required = false;
        customInput.value = "";
    }
});

productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editId    = document.getElementById("editId").value;
    const nombre    = document.getElementById("formName").value.trim();
    const precio    = parseInt(document.getElementById("formPrice").value);
    const stock     = parseInt(document.getElementById("formStock").value);
    const imagen    = document.getElementById("formImage").value.trim();
    const costo     = parseInt(document.getElementById("formCosto").value) || 0;
    const catSel    = document.getElementById("formCategoria").value;
    const catCustom = document.getElementById("formCategoriaCustom").value.trim();
    const categoria = catSel === "Otro" ? (catCustom || "Otro") : catSel;

    if (!nombre || !precio || stock < 0 || !imagen || !categoria) return;

    if (editId) {
        // EDIT existing product
        const idx = Productos.findIndex(p => p.id === editId);
        if (idx !== -1) {
            Productos[idx] = { ...Productos[idx], nombre, precio, stock, imagen, costo, categoria };
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
        Productos.push({ id: newId, nombre, precio, stock, imagen, costo, categoria });
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
                ${p.categoria ? `<span class="categoriaBadge categoriaBadgeCrud">${p.categoria}</span>` : ''}
                <span class="crudPrices">Precio: $${p.precio.toLocaleString()}${p.costo ? ` · Costo: $${p.costo.toLocaleString()} · <span class="margenLabel">Margen: $${(p.precio - p.costo).toLocaleString()}</span>` : ''}</span>
                <span>Stock: ${p.stock}</span>
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

    document.getElementById("editId").value    = prod.id;
    document.getElementById("formName").value  = prod.nombre;
    document.getElementById("formPrice").value = prod.precio;
    document.getElementById("formStock").value = prod.stock;
    document.getElementById("formImage").value = prod.imagen;
    document.getElementById("formCosto").value = prod.costo || 0;

    const selectEl    = document.getElementById("formCategoria");
    const customInput = document.getElementById("formCategoriaCustom");
    const presetVals  = Array.from(selectEl.options).map(o => o.value);
    if (prod.categoria && presetVals.includes(prod.categoria)) {
        selectEl.value = prod.categoria;
        customInput.classList.add("remove");
        customInput.required = false;
    } else if (prod.categoria) {
        selectEl.value = "Otro";
        customInput.value = prod.categoria;
        customInput.classList.remove("remove");
        customInput.required = true;
    } else {
        selectEl.value = "";
    }

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

// ============================================================
//  VENTAS MODAL
// ============================================================

const METODOS_PAGO = [
    { id: "Efectivo", nombre: "Efectivo", img: "https://cdn-icons-png.flaticon.com/512/1041/1041971.png" },
    { id: "Nequi",    nombre: "Nequi",    img: "https://images.seeklogo.com/logo-png/40/2/nequi-logo-png_seeklogo-404357.png" },
    { id: "Debe",     nombre: "Debe",     img: "https://cdn-icons-png.flaticon.com/512/4090/4090236.png" }
];

const ventasOverlay  = document.getElementById("ventasOverlay");
const closeVentasBtn = document.getElementById("closeVentas");
let metodoPagoSeleccionado = null;

function abrirVentasModal() {
    const total      = elementosComprados.reduce((s, p) => s + p.precio * p.cantidad, 0);
    const totalUnits = elementosComprados.reduce((s, p) => s + p.cantidad, 0);

    document.getElementById("ventasResumen").innerHTML = `
        <div class="ventasResumenBox">
            <div class="ventasResumenFila"><span>Productos:</span><strong>${totalUnits}</strong></div>
            <div class="ventasResumenFila ventasTotalFila"><span>Total a Pagar:</span><strong>$${total.toLocaleString()}</strong></div>
        </div>
        <div class="ventasItemsList">
            ${elementosComprados.map(p =>
                `<div class="ventasItem">
                    <span>${p.nombre} ×${p.cantidad}</span>
                    <span>$${(p.precio * p.cantidad).toLocaleString()}</span>
                </div>`
            ).join("")}
        </div>`;

    const mc = document.getElementById("metodosContainer");
    mc.innerHTML = "";
    METODOS_PAGO.forEach(m => {
        const btn = document.createElement("button");
        btn.classList.add("metodoPagoBoton");
        btn.dataset.id = m.id;
        btn.innerHTML = `<img src="${m.img}" class="imgMetodo"><p>${m.nombre}</p>`;
        btn.addEventListener("click", () => seleccionarMetodo(m.id));
        mc.appendChild(btn);
    });

    document.getElementById("ventasFormPago").innerHTML = "";
    document.getElementById("ventasAccion").innerHTML   = "";

    ventasOverlay.classList.remove("remove");
    void ventasOverlay.offsetWidth;
    ventasOverlay.classList.add("crudVisible");
}

function cerrarVentasModal() {
    ventasOverlay.classList.remove("crudVisible");
    ventasOverlay.addEventListener("transitionend", () => {
        ventasOverlay.classList.add("remove");
    }, { once: true });
    metodoPagoSeleccionado = null;
}

closeVentasBtn.addEventListener("click", cerrarVentasModal);
ventasOverlay.addEventListener("click", e => { if (e.target === ventasOverlay) cerrarVentasModal(); });

function seleccionarMetodo(idMetodo) {
    metodoPagoSeleccionado = idMetodo;
    document.querySelectorAll(".metodoPagoBoton").forEach(b =>
        b.classList.toggle("metodoSeleccionado", b.dataset.id === idMetodo)
    );

    const formDiv = document.getElementById("ventasFormPago");
    if (idMetodo === "Efectivo") {
        formDiv.innerHTML = `
            <div class="pago-efectivo-caja">
                <h3>Pago en Efectivo</h3>
                <p>¿Con cuánto vas a pagar?</p>
                <input type="number" id="montoEfectivo" placeholder="Monto en COP" min="1">
            </div>`;
    } else {
        formDiv.innerHTML = `<p class="metodoTexto">Has seleccionado: <strong>${idMetodo}</strong></p>`;
    }

    document.getElementById("ventasAccion").innerHTML =
        `<button id="btnConfirmarFinal" class="btnConfirmarFinal">Confirmar Pedido</button>`;
    document.getElementById("btnConfirmarFinal").addEventListener("click", confirmarPago);
}

function confirmarPago() {
    // FIX: capture metodo into a local const BEFORE cerrarVentasModal() resets the global to null
    const metodo = metodoPagoSeleccionado;
    const total  = elementosComprados.reduce((s, p) => s + p.precio * p.cantidad, 0);

    if (!metodo) {
        showNotification("Selecciona un método de pago.", "error");
        return;
    }

    if (metodo === "Efectivo") {
        const monto = parseFloat(document.getElementById("montoEfectivo")?.value);
        if (!monto || monto <= 0) { showNotification("Por favor ingresa el monto con el que pagas.", "error"); return; }
        if (monto < total)        { showNotification(`Monto insuficiente. El total es $${total.toLocaleString()}.`, "error"); return; }
        const vueltas = monto - total;
        const msg = vueltas > 0
            ? `Pago: $${monto.toLocaleString()}\nTotal: $${total.toLocaleString()}\nCambio: $${vueltas.toLocaleString()}`
            : `Pago exacto: $${total.toLocaleString()}`;
        if (!confirm(`¿Confirmar pago?\n${msg}`)) return;
        cerrarVentasModal();
        abrirFacturaModal(metodo, total, vueltas);

    } else if (metodo === "Debe") {
        if (!confirm(`¿Registrar esta venta como deuda?\nTotal: $${total.toLocaleString()}`)) return;
        cerrarVentasModal();
        abrirFacturaModal(metodo, total, 0);

    } else if (metodo === "Nequi") {
        if (!confirm(`¿Confirmar pago por Nequi?\nTotal: $${total.toLocaleString()}`)) return;
        cerrarVentasModal();
        abrirFacturaModal(metodo, total, 0);
    }
}

// ============================================================
//  FACTURA MODAL
// ============================================================

const facturaOverlay  = document.getElementById("facturaOverlay");
const closeFacturaBtn = document.getElementById("closeFactura");
let ventaPendiente = null;

function abrirFacturaModal(metodo, total, cambio) {
    ventaPendiente = { metodo, total, cambio, items: [...elementosComprados] };

    document.getElementById("facturaClienteForm").classList.remove("remove");
    document.getElementById("facturaContenido").classList.add("remove");
    document.getElementById("facturaAcciones").classList.add("remove");
    document.getElementById("clienteNombre").value   = "";
    document.getElementById("clienteTelefono").value = "";
    document.getElementById("clienteCorreo").value   = "";

    facturaOverlay.classList.remove("remove");
    void facturaOverlay.offsetWidth;
    facturaOverlay.classList.add("crudVisible");
}

function cerrarFacturaModal() {
    facturaOverlay.classList.remove("crudVisible");
    facturaOverlay.addEventListener("transitionend", () => {
        facturaOverlay.classList.add("remove");
    }, { once: true });
}

closeFacturaBtn.addEventListener("click", () => {
    if (ventaPendiente) {
        finalizarVenta(ventaPendiente.metodo, ventaPendiente.total, ventaPendiente.cambio, ventaPendiente.items);
        ventaPendiente = null;
    }
    cerrarFacturaModal();
});
facturaOverlay.addEventListener("click", e => {
    if (e.target === facturaOverlay) {
        if (ventaPendiente) {
            finalizarVenta(ventaPendiente.metodo, ventaPendiente.total, ventaPendiente.cambio, ventaPendiente.items);
            ventaPendiente = null;
        }
        cerrarFacturaModal();
    }
});

document.getElementById("btnGenerarFactura").addEventListener("click", () => {
    const nombre   = document.getElementById("clienteNombre").value.trim();
    const telefono = document.getElementById("clienteTelefono").value.trim();
    const correo   = document.getElementById("clienteCorreo").value.trim();
    const { metodo, total, cambio, items } = ventaPendiente;
    const fechaStr   = new Date().toLocaleString("es-CO");
    const facturaNum = "F-" + Date.now().toString().slice(-6);
    const cambioHtml = metodo === "Efectivo" && cambio > 0
        ? `<tr><td>Cambio entregado</td><td><strong>$${cambio.toLocaleString()}</strong></td></tr>` : "";

    document.getElementById("facturaContenido").innerHTML = `
        <div class="facturaDoc" id="facturaDoc">
            <div class="facturaHeader">
                <div class="facturaLogo">
                    <h2>Papelería Papel y Luna</h2>
                    <p>Recibo de Compra</p>
                </div>
                <div class="facturaNumFecha">
                    <p><strong>${facturaNum}</strong></p>
                    <p>${fechaStr}</p>
                </div>
            </div>
            ${nombre || telefono || correo ? `
            <div class="facturaSeccion">
                <h4>Datos del Cliente</h4>
                ${nombre   ? `<p><i class="fa-solid fa-user"></i> ${nombre}</p>` : ""}
                ${telefono ? `<p><i class="fa-solid fa-phone"></i> ${telefono}</p>` : ""}
                ${correo   ? `<p><i class="fa-solid fa-envelope"></i> ${correo}</p>` : ""}
            </div>` : ""}
            <div class="facturaSeccion">
                <h4>Productos</h4>
                <table class="facturaTabla">
                    <thead><tr><th>Producto</th><th>Cant.</th><th>P. Unit.</th><th>Subtotal</th></tr></thead>
                    <tbody>
                        ${items.map(p => `
                        <tr>
                            <td>${p.nombre}</td>
                            <td>${p.cantidad}</td>
                            <td>$${p.precio.toLocaleString()}</td>
                            <td>$${(p.precio * p.cantidad).toLocaleString()}</td>
                        </tr>`).join("")}
                    </tbody>
                </table>
            </div>
            <div class="facturaSeccion facturaTotales">
                <table class="facturaTabla">
                    <tr><td>Método de pago</td><td><strong>${metodo}</strong></td></tr>
                    <tr class="totalRow"><td>TOTAL</td><td><strong>$${total.toLocaleString()}</strong></td></tr>
                    ${cambioHtml}
                </table>
            </div>
            <p class="facturaGracias">¡Gracias por tu compra! 🌙</p>
        </div>`;

    document.getElementById("facturaClienteForm").classList.add("remove");
    document.getElementById("facturaContenido").classList.remove("remove");
    document.getElementById("facturaAcciones").classList.remove("remove");

    finalizarVenta(metodo, total, cambio, items, { nombre, telefono, correo, facturaNum });
    ventaPendiente = null;
});

function finalizarVenta(metodo, total, cambio, items, cliente = {}) {
    const venta = {
        id:     Date.now(),
        fecha:  new Date().toLocaleString("es-CO"),
        metodo, total, cambio,
        items:  items.map(p => ({ nombre: p.nombre, cantidad: p.cantidad, precio: p.precio })),
        cliente
    };
    const historial = JSON.parse(localStorage.getItem("historialVentas")) || [];
    historial.unshift(venta);
    localStorage.setItem("historialVentas", JSON.stringify(historial));

    const cambioMsg = metodo === "Efectivo" && cambio > 0 ? ` · Cambio: $${cambio.toLocaleString()}` : "";
    showNotification(`¡Venta confirmada! $${total.toLocaleString()} · ${metodo}${cambioMsg}`);

    elementosComprados = [];
    saveCart();
    renderCart();
    recalcularCounter();
}

// ============================================================
//  HISTORIAL DE VENTAS MODAL
// ============================================================

const historialOverlay  = document.getElementById("historialOverlay");
const openHistorialBtn  = document.getElementById("openHistorial");
const closeHistorialBtn = document.getElementById("closeHistorial");

openHistorialBtn.addEventListener("click", e => {
    e.preventDefault();
    historialOverlay.classList.remove("remove");
    void historialOverlay.offsetWidth;
    historialOverlay.classList.add("crudVisible");
    renderHistorial();
});

function cerrarHistorial() {
    historialOverlay.classList.remove("crudVisible");
    historialOverlay.addEventListener("transitionend", () => {
        historialOverlay.classList.add("remove");
    }, { once: true });
}

closeHistorialBtn.addEventListener("click", cerrarHistorial);
historialOverlay.addEventListener("click", e => { if (e.target === historialOverlay) cerrarHistorial(); });

function renderHistorial() {
    const historial = JSON.parse(localStorage.getItem("historialVentas")) || [];
    const listaEl   = document.getElementById("historialLista");
    const resumenEl = document.getElementById("historialResumenTop");

    if (historial.length === 0) {
        resumenEl.innerHTML = "";
        listaEl.innerHTML = `
            <div class="historialVacio">
                <img src="https://cdn-icons-png.flaticon.com/512/1178/1178479.png" class="nadaEncontrado">
                <p>Aún no hay ventas registradas.</p>
            </div>`;
        return;
    }

    const totalVentas   = historial.length;
    const totalIngresos = historial.filter(v => v.metodo !== "Debe").reduce((s, v) => s + v.total, 0);
    const totalDeudas   = historial.filter(v => v.metodo === "Debe").reduce((s, v) => s + v.total, 0);

    resumenEl.innerHTML = `
        <div class="historialStats">
            <div class="statBox"><span>Ventas</span><strong>${totalVentas}</strong></div>
            <div class="statBox statIngresos"><span>Ingresos</span><strong>$${totalIngresos.toLocaleString()}</strong></div>
            <div class="statBox statDeudas"><span>Por Cobrar</span><strong>$${totalDeudas.toLocaleString()}</strong></div>
        </div>
        <div class="historialAcciones">
            <button id="btnBorrarHistorial" class="btnBorrarHistorial"><i class="fa-solid fa-trash"></i> Borrar historial</button>
        </div>`;
    document.getElementById("btnBorrarHistorial").addEventListener("click", borrarHistorial);

    listaEl.innerHTML = "";
    historial.forEach(venta => {
        const div = document.createElement("div");
        div.classList.add("historialVenta");
        const metodoIcon  = { Efectivo: "💵", Nequi: "📱", Debe: "📋" }[venta.metodo] || "💰";
        const metodoLabel = venta.metodo || "Desconocido";
        const cambioHtml  = venta.metodo === "Efectivo" && venta.cambio > 0
            ? `<span class="ventaCambio">Cambio: $${venta.cambio.toLocaleString()}</span>` : "";
        const clienteHtml = venta.cliente?.nombre
            ? `<span class="ventaCliente"><i class="fa-solid fa-user"></i> ${venta.cliente.nombre}</span>` : "";

        div.innerHTML = `
            <div class="ventaEncabezado">
                <span class="ventaMetodo">${metodoIcon} ${metodoLabel}</span>
                <span class="ventaFecha">${venta.fecha}</span>
                <span class="ventaTotal">$${venta.total.toLocaleString()}</span>
            </div>
            ${clienteHtml}${cambioHtml}
            <div class="ventaItems">
                ${venta.items.map(i => `<span class="ventaItemChip">${i.nombre} ×${i.cantidad}</span>`).join("")}
            </div>
            <div class="ventaReciboBtn">
                <button class="btnVerRecibo" data-id="${venta.id}"><i class="fa-solid fa-receipt"></i> Ver Recibo</button>
            </div>`;
        listaEl.appendChild(div);
    });

    listaEl.querySelectorAll(".btnVerRecibo").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.dataset.id);
            const venta = historial.find(v => v.id === id);
            if (venta) abrirReciboHistorial(venta);
        });
    });
}

function abrirReciboHistorial(venta) {
    // Close historial modal first
    cerrarHistorial();

    const facturaNum = venta.cliente?.facturaNum || "F-" + venta.id.toString().slice(-6);
    const cambioHtml = venta.metodo === "Efectivo" && venta.cambio > 0
        ? `<tr><td>Cambio entregado</td><td><strong>$${venta.cambio.toLocaleString()}</strong></td></tr>` : "";
    const cliente = venta.cliente || {};

    document.getElementById("facturaClienteForm").classList.add("remove");
    document.getElementById("facturaContenido").classList.remove("remove");
    document.getElementById("facturaAcciones").classList.remove("remove");

    document.getElementById("facturaContenido").innerHTML = `
        <div class="facturaDoc" id="facturaDoc">
            <div class="facturaHeader">
                <div class="facturaLogo">
                    <h2>Papelería Papel y Luna</h2>
                    <p>Recibo de Compra</p>
                </div>
                <div class="facturaNumFecha">
                    <p><strong>${facturaNum}</strong></p>
                    <p>${venta.fecha}</p>
                </div>
            </div>
            ${cliente.nombre || cliente.telefono || cliente.correo ? `
            <div class="facturaSeccion">
                <h4>Datos del Cliente</h4>
                ${cliente.nombre   ? `<p><i class="fa-solid fa-user"></i> ${cliente.nombre}</p>` : ""}
                ${cliente.telefono ? `<p><i class="fa-solid fa-phone"></i> ${cliente.telefono}</p>` : ""}
                ${cliente.correo   ? `<p><i class="fa-solid fa-envelope"></i> ${cliente.correo}</p>` : ""}
            </div>` : ""}
            <div class="facturaSeccion">
                <h4>Productos</h4>
                <table class="facturaTabla">
                    <thead><tr><th>Producto</th><th>Cant.</th><th>P. Unit.</th><th>Subtotal</th></tr></thead>
                    <tbody>
                        ${venta.items.map(p => `
                        <tr>
                            <td>${p.nombre}</td>
                            <td>${p.cantidad}</td>
                            <td>$${p.precio.toLocaleString()}</td>
                            <td>$${(p.precio * p.cantidad).toLocaleString()}</td>
                        </tr>`).join("")}
                    </tbody>
                </table>
            </div>
            <div class="facturaSeccion facturaTotales">
                <table class="facturaTabla">
                    <tr><td>Método de pago</td><td><strong>${venta.metodo}</strong></td></tr>
                    <tr class="totalRow"><td>TOTAL</td><td><strong>$${venta.total.toLocaleString()}</strong></td></tr>
                    ${cambioHtml}
                </table>
            </div>
            <p class="facturaGracias">¡Gracias por tu compra! 🌙</p>
        </div>`;

    const overlay = document.getElementById("facturaOverlay");
    overlay.classList.remove("remove");
    void overlay.offsetWidth;
    overlay.classList.add("crudVisible");
}

function borrarHistorial() {
    if (!confirm("¿Borrar todo el historial de ventas? Esta acción no se puede deshacer.")) return;
    localStorage.removeItem("historialVentas");
    renderHistorial();
    showNotification("Historial borrado.");
}
