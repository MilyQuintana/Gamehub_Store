

document.addEventListener("DOMContentLoaded", () => {
  renderizarCategorias();
  renderizarDestacados();
});


function renderizarCategorias() {
  const contenedor = document.getElementById("lista-categorias");
  if (!contenedor) return;

  CATEGORIAS.forEach((categoria) => {
    const item = document.createElement("li");

    const enlace = document.createElement("a");
    enlace.href = `catalogo.html?categoria=${encodeURIComponent(categoria.id)}`;
    enlace.textContent = `${categoria.icono} ${categoria.nombre}`;

    item.appendChild(enlace);
    contenedor.appendChild(item);
  });
}

  
function renderizarDestacados() {
  const contenedor = document.getElementById("lista-destacados");
  if (!contenedor) return;

  const destacados = PRODUCTOS.filter((producto) => producto.destacado).slice(0, 4);

  destacados.forEach((producto) => {
    contenedor.appendChild(crearTarjetaProducto(producto));
  });
}


function crearTarjetaProducto(producto) {
  const tarjeta = document.createElement("a");
  tarjeta.className = "tarjeta-producto";
  tarjeta.href = `detalle.html?id=${producto.id}`;

  const imagen = document.createElement("img");
  imagen.className = "tarjeta-producto__imagen";
  imagen.src = producto.imagen;
  imagen.alt = producto.nombre;
  tarjeta.appendChild(imagen);

  const cuerpo = document.createElement("div");
  cuerpo.className = "tarjeta-producto__cuerpo";

  const nombre = document.createElement("h3");
  nombre.className = "tarjeta-producto__nombre";
  nombre.textContent = producto.nombre;
  cuerpo.appendChild(nombre);

  const precio = document.createElement("span");
  precio.className = "tarjeta-producto__precio";
  const precioFinal = producto.precioDescuento ?? producto.precioNormal;
  precio.textContent = formatearCLP(precioFinal);
  cuerpo.appendChild(precio);

  if (producto.stock === 0) {
    const sinStock = document.createElement("span");
    sinStock.className = "tarjeta-producto__sin-stock";
    sinStock.textContent = "Sin stock";
    cuerpo.appendChild(sinStock);
  }

  tarjeta.appendChild(cuerpo);
  return tarjeta;
}


function formatearCLP(monto) {
  return monto.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}