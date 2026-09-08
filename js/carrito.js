document.addEventListener("DOMContentLoaded", () => {
  renderizarCarrito();
  configurarEventos();
});

function configurarEventos() {
  document.getElementById("btn-vaciar-carrito").addEventListener("click", () => {
    const hayProductos = leerCarrito().length > 0;
    if (!hayProductos) return;

    const confirmado = confirm("¿Seguro que quieres vaciar el carrito?");
    if (!confirmado) return;

    vaciarCarrito();
    document.getElementById("cupon-codigo").value = "";
    limpiarError(document.getElementById("cupon-codigo"));
    renderizarCarrito();
  });

  document.getElementById("form-cupon").addEventListener("submit", (evento) => {
    evento.preventDefault();
    const inputCupon = document.getElementById("cupon-codigo");

    if (!validarRequerido(inputCupon, "El código de cupón")) return;

    const resultado = validarCupon(inputCupon.value.trim());
    if (!resultado.valido) {
      mostrarError(inputCupon, resultado.motivo);
      return;
    }

    limpiarError(inputCupon);
    guardarCuponAplicado(resultado.cupon.codigo);
    renderizarTotales();
  });


  document.getElementById("btn-ir-checkout").addEventListener("click", (evento) => {
    if (leerCarrito().length === 0) {
      evento.preventDefault();
      alert("Tu carrito está vacío. Agrega productos antes de continuar.");
    }
  });
}

function renderizarCarrito() {
  const lineas = leerCarrito();
  const tabla = document.getElementById("tabla-carrito");
  const carritoVacio = document.getElementById("carrito-vacio");
  const cuerpoTabla = document.getElementById("carrito-lineas");

  const hayProductos = lineas.length > 0;
  tabla.hidden = !hayProductos;
  document.getElementById("btn-vaciar-carrito").hidden = !hayProductos;
  carritoVacio.hidden = hayProductos;

  cuerpoTabla.innerHTML = "";

  if (hayProductos) {
    const { lineasDetalladas } = calcularTotalesCarrito();
    lineasDetalladas.forEach((linea) => {
      cuerpoTabla.appendChild(crearFilaCarrito(linea));
    });
  }

  renderizarTotales();
}

function crearFilaCarrito(linea) {
  const { producto, cantidad, precioUnitario, subtotal } = linea;
  const fila = document.createElement("tr");

  const celdaProducto = document.createElement("td");
  const enlaceProducto = document.createElement("a");
  enlaceProducto.href = `detalle.html?id=${producto.id}`;
  enlaceProducto.textContent = producto.nombre;
  celdaProducto.appendChild(enlaceProducto);
  fila.appendChild(celdaProducto);

  const celdaPrecio = document.createElement("td");
  celdaPrecio.textContent = formatearCLP(precioUnitario);
  fila.appendChild(celdaPrecio);

  const celdaCantidad = document.createElement("td");
  const inputCantidad = document.createElement("input");
  inputCantidad.type = "number";
  inputCantidad.min = "1";
  inputCantidad.max = String(producto.stock);
  inputCantidad.value = String(cantidad);
  inputCantidad.setAttribute("aria-label", `Cantidad de ${producto.nombre}`);
  inputCantidad.addEventListener("change", () => {
    
    let nuevaCantidad = Number(inputCantidad.value);
    if (Number.isNaN(nuevaCantidad) || nuevaCantidad < 1) nuevaCantidad = 1;
    if (nuevaCantidad > producto.stock) nuevaCantidad = producto.stock;

    inputCantidad.value = String(nuevaCantidad);
    actualizarCantidadCarrito(producto.id, nuevaCantidad);
    renderizarCarrito();
  });
  celdaCantidad.appendChild(inputCantidad);
  fila.appendChild(celdaCantidad);

  const celdaSubtotal = document.createElement("td");
  celdaSubtotal.textContent = formatearCLP(subtotal);
  fila.appendChild(celdaSubtotal);

  const celdaAcciones = document.createElement("td");
  const botonQuitar = document.createElement("button");
  botonQuitar.type = "button";
  botonQuitar.className = "boton boton-secundario";
  botonQuitar.textContent = "Quitar";
  botonQuitar.addEventListener("click", () => {
    quitarDelCarrito(producto.id);
    renderizarCarrito();
  });
  celdaAcciones.appendChild(botonQuitar);
  fila.appendChild(celdaAcciones);

  return fila;
}

function renderizarTotales() {
  const { subtotal, descuento, total } = calcularTotalesCarrito();

  document.getElementById("resumen-subtotal").textContent = formatearCLP(subtotal);
  document.getElementById("resumen-descuento").textContent = `-${formatearCLP(descuento)}`;
  document.getElementById("resumen-total").textContent = formatearCLP(total);
}
