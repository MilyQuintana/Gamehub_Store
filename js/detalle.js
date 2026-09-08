let productoActual = null;

document.addEventListener("DOMContentLoaded", () => {
  productoActual = obtenerProductoDesdeUrl();

  if (!productoActual) {
    mostrarProductoNoEncontrado();
    return;
  }

  renderizarProducto(productoActual);
  renderizarResenas(productoActual);
  configurarFormularioCantidad(productoActual);
});

function obtenerProductoDesdeUrl() {
  const parametros = new URLSearchParams(window.location.search);
  const id = Number(parametros.get("id"));
  return PRODUCTOS.find((producto) => producto.id === id) || null;
}

function mostrarProductoNoEncontrado() {
  document.getElementById("producto-nombre").textContent = "Producto no encontrado";
  document.getElementById("producto-categoria").textContent = "";
  document.getElementById("form-agregar-carrito").hidden = true;
}


function renderizarProducto(producto) {
  document.getElementById("producto-categoria").textContent = producto.categoria;
  document.getElementById("producto-nombre").textContent = producto.nombre;

  
  const imagenPrincipal = document.getElementById("producto-imagen-principal");
  imagenPrincipal.src = producto.imagenes[0];
  imagenPrincipal.alt = producto.nombre;

  const contenedorMiniaturas = document.getElementById("producto-miniaturas");
  contenedorMiniaturas.innerHTML = "";
  producto.imagenes.forEach((rutaImagen) => {
    const miniatura = document.createElement("img");
    miniatura.src = rutaImagen;
    miniatura.alt = `Vista adicional de ${producto.nombre}`;
    miniatura.addEventListener("click", () => {
      imagenPrincipal.src = rutaImagen;
    });
    contenedorMiniaturas.appendChild(miniatura);
  });

  // Precio: si hay descuento, se muestra el precio actual en
  // grande y el normal tachado al lado.
  const spanPrecioDescuento = document.getElementById("producto-precio-descuento");
  const spanPrecioNormal = document.getElementById("producto-precio-normal");

  if (producto.precioDescuento) {
    spanPrecioDescuento.textContent = formatearCLP(producto.precioDescuento);
    spanPrecioNormal.textContent = formatearCLP(producto.precioNormal);
  } else {
    spanPrecioDescuento.textContent = formatearCLP(producto.precioNormal);
    spanPrecioNormal.textContent = "";
  }

  // Stock
  const parrafoStock = document.getElementById("producto-stock");
  if (producto.stock === 0) {
    parrafoStock.textContent = "Sin stock disponible";
  } else if (producto.stock <= 3) {
    parrafoStock.textContent = `¡Últimas ${producto.stock} unidades!`;
  } else {
    parrafoStock.textContent = `${producto.stock} unidades disponibles`;
  }

  // Especificaciones técnicas
  const listaEspecificaciones = document.getElementById("producto-especificaciones");
  listaEspecificaciones.innerHTML = "";
  producto.especificaciones.forEach((especificacion) => {
    const item = document.createElement("li");
    item.textContent = especificacion;
    listaEspecificaciones.appendChild(item);
  });
}


function renderizarResenas(producto) {
  const contenedor = document.getElementById("lista-resenas");
  contenedor.innerHTML = "";

  if (producto.resenas.length === 0) {
    const vacio = document.createElement("p");
    vacio.textContent = "Este producto todavía no tiene reseñas.";
    contenedor.appendChild(vacio);
    return;
  }

  const resenasOrdenadas = [...producto.resenas].sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha)
  );

  const promedio =
    producto.resenas.reduce((suma, resena) => suma + resena.puntuacion, 0) / producto.resenas.length;

  const encabezado = document.createElement("p");
  encabezado.innerHTML = `<strong>Promedio: ${promedio.toFixed(1)} / 5</strong> (${producto.resenas.length} reseña(s))`;
  contenedor.appendChild(encabezado);

  resenasOrdenadas.forEach((resena) => {
    const item = document.createElement("article");
    item.innerHTML = `
      <strong>${resena.autor}</strong> — ${"⭐".repeat(resena.puntuacion)}
      <p>${resena.comentario}</p>
      <small>${resena.fecha}</small>
    `;
    contenedor.appendChild(item);
  });
}


function configurarFormularioCantidad(producto) {
  const formulario = document.getElementById("form-agregar-carrito");
  const inputCantidad = document.getElementById("producto-cantidad");
  const botonAgregar = formulario.querySelector("button[type='submit']");

  inputCantidad.max = producto.stock;

  if (producto.stock === 0) {
    inputCantidad.disabled = true;
    botonAgregar.disabled = true;
    botonAgregar.textContent = "Sin stock";
    return;
  }

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const cantidadValida = validarNumeroEnRango(inputCantidad, {
      minimo: 1,
      maximo: producto.stock,
      etiqueta: "La cantidad",
    });
    if (!cantidadValida) return;

    agregarAlCarrito(producto.id, Number(inputCantidad.value));

    const textoOriginal = botonAgregar.textContent;
    botonAgregar.textContent = "¡Agregado!";
    botonAgregar.disabled = true;
    setTimeout(() => {
      botonAgregar.textContent = textoOriginal;
      botonAgregar.disabled = false;
    }, 1200);
  });
}
