document.addEventListener("DOMContentLoaded", () => {
    const totalGuardado = sessionStorage.getItem("totalAPagar") || "0";
    
    const metodoPagoContenedor = document.getElementById("Metodo");
    const metodos = [
        {id: "Efectivo", nombre: "Efectivo",img: "https://cdn-icons-png.flaticon.com/512/1041/1041971.png" },
        {id: "Nequi", nombre: "Nequi", img:"https://images.seeklogo.com/logo-png/40/2/nequi-logo-png_seeklogo-404357.png"},
        {id: "Debe", nombre: "Debe", img:"https://cdn-icons-png.flaticon.com/512/4090/4090236.png"}
    ];
    
    metodos.forEach(metodo => {
        const botonMetodo = document.createElement("button");
        botonMetodo.classList.add("metodoPagoBoton");
        botonMetodo.innerHTML = `
        ${metodo.img ? `<img src="${metodo.img}" class="imgMetodo">` : ''}
        <p>${metodo.nombre}</p>
        `;
        botonMetodo.addEventListener("click", () => {
            mostrarBotonPagar(metodo.nombre)
        });
        metodoPagoContenedor.appendChild(botonMetodo);
        
        
        
    });
    const montoDisplay = document.getElementById("montoTotal");
    if (montoDisplay) {
        montoDisplay.innerText = `$${totalGuardado}`;
        window.totalGlobal = parseFloat(totalRecuperado);
    }
}); 
const total = parseFloat(sessionStorage.getItem("totalAPagar")) || 0;
function mostrarBotonPagar(nombreMetodo) {
    const contenedor = document.getElementById("VentasContainer");
    let mensajeEl = document.getElementById("mensajeInstrucciones");
    if (!mensajeEl) {
        mensajeEl = document.createElement("div");
        mensajeEl.id = "mensajeInstrucciones";
        contenedor.appendChild(mensajeEl);
    }
    if (nombreMetodo === "Efectivo") {
        mensajeEl.innerHTML = `
            <div class="pago-efectivo-caja">
            <h3>Pago en Efectivo</h3>
            <p>¿Con cuánto vas a pagar?</p>
            <input type="number" id="montoEfectivo" placeholder="Monto en cop">
            </div>
            `;
        } else {
            mensajeEl.innerHTML = `<h3>Has seleccionado: ${nombreMetodo}</h3>`;
        }
        let btnFinal = document.getElementById("btnConfirmarFinal");
        if (!btnFinal) {
            btnFinal = document.createElement("button");
            btnFinal.id = "btnConfirmarFinal";
            contenedor.appendChild(btnFinal);
        }
        btnFinal.innerHTML = `Confirmar Pedido`;
        btnFinal.onclick = () => {
            if (nombreMetodo === "Efectivo") {
                const monto = document.getElementById("montoEfectivo").value;
                if (!monto || monto <= 0) {
                    alert("Por favor, dinos con cuánto pagas para darte el cambio.");
                    return;
                }
                else if (monto < total) {
                    alert(`El monto ingresado es insuficiente. El total a pagar es $${total}.`);
                    return;
                }
                else if(monto > total) {
                    const vueltas = monto - total;
                    alert(`El monto ingresado es mayor al total. El cambio es $${vueltas}.`);

                    if (confirm(`¿Confirmar monto de $${monto}? 
                        Costo total: $${total}`) == true){
                        alert(`Pago confirmado ($${monto}).
                        Costo total: $${total}.
                        Cambio: $${vueltas}.`);
                    }
                    else{
                        return
                    }
                }
            } else {
                alert(`Pedido confirmado con ${nombreMetodo}.`);
            }
            sessionStorage.removeItem("carrito"); 
            sessionStorage.removeItem("totalAPagar");
            window.close();
        };
}