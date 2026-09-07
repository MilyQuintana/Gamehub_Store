const PRODUCTOS_POR_PAGINA = 15;
let paginaActual = 1 ;

document.addEventListener("DOMContentLoaded", () => {
    precargarFiltrosDesdeURL();
    configurarEventos();
    renderizarCatalogo();
});

function precargarFiltrosDesdeURL() {
    const parametros = new URLSearchParams(window.location.search);
    const categoria = parametros.get("categoria");
    if(!categoria) return;

    const selectCategoria = document.getElementById("filtro-categoria");
    const existeOpcion = Array.from(SelectCategoria.options).some(option => option.value === categoria);
    if(existeOpcion) 
        selectCategoria.value = categoria;
}

function configurarEventos() {
    const formulario= document.getElementById("form-filtros");
    const botonLimpiar= document.getElementById("btn-limpiar-filtros");
    const botonCargarMas= document.getElementById("btn-cargar-mas");
    const precioMin= documet.getElementById("filtro-precio-min");
    const precioMax= document.getElementById("filtro-precio-max");

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
 
    
    const rangoValido = validarCoherencia(
      precioMin,
      precioMax,
      "El precio máximo no puede ser menor que el precio mínimo."
    );
    if (!rangoValido) return;
 
    paginaActual = 1;
    renderizarCatalogo();
  });
 

  botonLimpiar.addEventListener("click", () => {
    limpiarError(precioMax);
    setTimeout(() => {
      paginaActual = 1;
      renderizarCatalogo();
    }, 0);
  });
 
  botonCargarMas.addEventListener("click", () => {
    paginaActual += 1;
    renderizarCatalogo();
  });
}
 

function obtenerProductosFiltrados() {
  const categoria = document.getElementById("filtro-categoria").value;
  const marca = document.getElementById("filtro-marca").value;
  const precioMin = Number(document.getElementById("filtro-precio-min").value) || 0;
  const precioMax = Number(document.getElementById("filtro-precio-max").value) || Infinity;
  const orden = document.getElementById("filtro-orden").value;
 
  let resultado = PRODUCTOS.filter((producto) => {
    const precioFinal = producto.precioDescuento ?? producto.precioNormal;
    const coincideCategoria = categoria === "todas" || producto.categoria === categoria;
    const coincideMarca = marca === "todas" || producto.marca === marca;
    const coincidePrecio = precioFinal >= precioMin && precioFinal <= precioMax;
    return coincideCategoria && coincideMarca && coincidePrecio;
  });
 
  const precioDe = (producto) => producto.precioDescuento ?? producto.precioNormal;
 
  switch (orden) {
    case "precio-asc":
      resultado.sort((a, b) => precioDe(a) - precioDe(b));
      break;
    case "precio-desc":
      resultado.sort((a, b) => precioDe(b) - precioDe(a));
      break;
    case "nombre-asc":
      resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
      break;
    default:
      
      break;
  }
 
  return resultado;
}

function renderizarCatalogo() {
  const contenedor = document.getElementById("lista-productos");
  const contadorTexto = document.getElementById("catalogo-contador-resultados");
  const botonCargarMas = document.getElementById("btn-cargar-mas");
 
  const productosFiltrados = obtenerProductosFiltrados();
  const cantidadAMostrar = PRODUCTOS_POR_PAGINA * paginaActual;
  const productosAMostrar = productosFiltrados.slice(0, cantidadAMostrar);
 
  contenedor.innerHTML = "";
  productosAMostrar.forEach((producto) => {
    contenedor.appendChild(crearTarjetaProducto(producto));
  });
 
  contadorTexto.textContent = `${productosFiltrados.length} producto(s) encontrado(s)`;
 
  
  botonCargarMas.hidden = cantidadAMostrar >= productosFiltrados.length;
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
  precio.textContent = formatearCLP(producto.precioDescuento ?? producto.precioNormal);
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