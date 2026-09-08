document.addEventListener("DOMContentLoaded", () => {
  renderizarResumen();
  configurarFormulario();
});


function renderizarResumen() {
  const { lineasDetalladas, subtotal, descuento, total } = calcularTotalesCarrito();
  const listaResumen = document.getElementById("checkout-lineas-resumen");
  const botonConfirmar = document.querySelector("#form-checkout button[type='submit']");

  listaResumen.innerHTML = "";

  if (lineasDetalladas.length === 0) {
    const aviso = document.createElement("li");
    aviso.textContent = "Tu carrito está vacío. Vuelve al catálogo para agregar productos.";
    listaResumen.appendChild(aviso);
    botonConfirmar.disabled = true;
    return;
  }

  lineasDetalladas.forEach((linea) => {
    const item = document.createElement("li");
    item.textContent = `${linea.cantidad} x ${linea.producto.nombre} — ${formatearCLP(linea.subtotal)}`;
    listaResumen.appendChild(item);
  });

  document.getElementById("checkout-subtotal").textContent = formatearCLP(subtotal);
  document.getElementById("checkout-descuento").textContent = `-${formatearCLP(descuento)}`;
  document.getElementById("checkout-total").textContent = formatearCLP(total);
}


function configurarFormulario() {
  const formulario = document.getElementById("form-checkout");

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (leerCarrito().length === 0) {
      alert("No puedes confirmar una compra con el carrito vacío.");
      return;
    }

    const nombre = document.getElementById("checkout-nombre");
    const correo = document.getElementById("checkout-correo");
    const telefono = document.getElementById("checkout-telefono");
    const region = document.getElementById("checkout-region");
    const comuna = document.getElementById("checkout-comuna");
    const direccion = document.getElementById("checkout-direccion");

   
    const esValido = [
      validarRequerido(nombre, "El nombre completo"),
      validarEmail(correo),
      validarTelefono(telefono, { minimo: 8, maximo: 12 }),
      validarSelectRequerido(region, "Selecciona una región"),
      validarRequerido(comuna, "La comuna"),
      validarRequerido(direccion, "La dirección"),
    ].every(Boolean);

    if (!esValido) return;

    confirmarCompra({ nombre, correo, telefono, region, comuna, direccion });
  });
}


function confirmarCompra(campos) {
  const { lineasDetalladas, subtotal, descuento, total } = calcularTotalesCarrito();
  const metodoPago = document.querySelector('input[name="metodoPago"]:checked').value;
  const numeroOrden = `GH-${Date.now().toString().slice(-8)}`;

  const orden = {
    numero: numeroOrden,
    fecha: new Date().toISOString().slice(0, 10),
    estado: "Pagada",
    total,
    pago: { metodo: metodoPago, estado: "Aprobado" },
    despacho: {
      estado: "En preparación",
      nombre: campos.nombre.value.trim(),
      correo: campos.correo.value.trim(),
      telefono: campos.telefono.value.trim(),
      region: campos.region.value,
      comuna: campos.comuna.value.trim(),
      direccion: campos.direccion.value.trim(),
    },
    productos: lineasDetalladas.map((linea) => ({
      id: linea.producto.id,
      nombre: linea.producto.nombre,
      cantidad: linea.cantidad,
      subtotal: linea.subtotal,
      resenada: false,
    })),
    subtotal,
    descuento,
  };

  guardarOrden(orden);
  vaciarCarrito();

  document.getElementById("form-checkout").hidden = true;
  document.getElementById("checkout-numero-orden").textContent = numeroOrden;
  document.getElementById("checkout-confirmacion").hidden = false;
}
