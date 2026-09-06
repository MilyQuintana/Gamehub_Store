/* =================================================================
   INICIO.JS — Lógica exclusiva de index.html
   Renderiza, con manipulación del DOM, la lista de categorías y los
   productos destacados a partir de los arreglos de js/data.js.
   No usa innerHTML con strings armados a mano: crea cada elemento
   con createElement y lo conecta con appendChild, que es lo que
   pide la pauta ("evitando listas escritas a mano en el HTML").
   ================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  renderizarCategorias();
  renderizarDestacados();
});

/* -----------------------------------------------------------------
   CATEGORÍAS
   Cada categoría se pinta como un <li><a>...</a></li>. El href
   apunta al catálogo con la categoría como parámetro de consulta:
   catalogo.html?categoria=notebooks. catalogo.js lee ese parámetro
   al cargar y deja el <select> de filtros ya con esa opción
   seleccionada.
   ----------------------------------------------------------------- */
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

/* -----------------------------------------------------------------
   PRODUCTOS DESTACADOS
   Filtra PRODUCTOS por "destacado: true" y limita a 4 tarjetas para
   no saturar la portada. Cada tarjeta completa es un <a> (no lleva
   botones adentro), así que no hay riesgo de anidar enlaces: un
   solo clic en cualquier parte de la tarjeta lleva al detalle.
   ----------------------------------------------------------------- */
function renderizarDestacados() {
  const contenedor = document.getElementById("lista-destacados");
  if (!contenedor) return;

  const destacados = PRODUCTOS.filter((producto) => producto.destacado).slice(0, 4);

  destacados.forEach((producto) => {
    contenedor.appendChild(crearTarjetaProducto(producto));
  });
}

/* -----------------------------------------------------------------
   crearTarjetaProducto(producto)
   Función compartida: la reutilizará también js/catalogo.js, así
   que vive aquí solo temporalmente — cuando armemos catalogo.js la
   movemos a un archivo común (por ejemplo js/tarjetas.js) para no
   duplicar código entre páginas.
   ----------------------------------------------------------------- */
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

/* -----------------------------------------------------------------
   formatearCLP(monto)
   Convierte un número a formato de precio chileno: $1.090.000
   ----------------------------------------------------------------- */
function formatearCLP(monto) {
  return monto.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}