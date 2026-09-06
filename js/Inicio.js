

document.addEventListener("DOMContentLoaded", () => {
  renderizarCategorias();
  renderizarDestacados();
});


function renderizarCategorias() {
  const contenedor = document.getElementById("lista-categorias");
  if (!contenedor) return;

  const carrusel = document.createElement("div");
  carrusel.className = "categorias-carousel";

  const viewport = document.createElement("div");
  viewport.className = "categorias-carousel__viewport";

  const track = document.createElement("ul");
  track.className = "categorias-carousel__track";
  track.id = "lista-categorias";

  CATEGORIAS.forEach((categoria) => {
    const slide = document.createElement("li");
    slide.className = "categorias-carousel__slide";

    const enlace = document.createElement("a");
    enlace.href = `catalogo.html?categoria=${encodeURIComponent(categoria.id)}`;

    const imagen = document.createElement("img");
    imagen.className = "categorias-carousel__imagen";
    imagen.src = obtenerImagenCategoria(categoria);
    imagen.alt = categoria.nombre;
    imagen.loading = "lazy";

    const nombre = document.createElement("span");
    nombre.className = "categorias-carousel__nombre";
    nombre.textContent = categoria.nombre;

    enlace.append(imagen, nombre);
    slide.appendChild(enlace);
    track.appendChild(slide);
  });

  const btnPrev = crearBotonCarrusel("prev", "‹", "Categoría anterior");
  const btnNext = crearBotonCarrusel("next", "›", "Categoría siguiente");

  const dots = document.createElement("div");
  dots.className = "categorias-carousel__dots";
  CATEGORIAS.forEach((_, i) => {
    const punto = document.createElement("button");
    punto.type = "button";
    punto.className = "categorias-carousel__dot";
    punto.setAttribute("aria-label", `Ir a categoría ${i + 1}`);
    dots.appendChild(punto);
  });

  viewport.appendChild(track);
  carrusel.append(viewport, btnPrev, btnNext, dots);

  contenedor.replaceWith(carrusel);
  iniciarCarrusel(track, dots, CATEGORIAS.length);
}

// Usa la imagen del primer producto real de esa categoría; si no hay, cae al placeholder de CATEGORIAS
function obtenerImagenCategoria(categoria) {
  const producto = PRODUCTOS.find((p) => p.categoria === categoria.id);
  return producto ? producto.imagen : categoria.imagen;
}

function crearBotonCarrusel(tipo, texto, etiqueta) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = `categorias-carousel__btn categorias-carousel__btn--${tipo}`;
  boton.setAttribute("aria-label", etiqueta);
  boton.textContent = texto;
  return boton;
}

function iniciarCarrusel(track, dots, total) {
  let actual = 0;
  const puntos = Array.from(dots.children);
  const carrusel = track.closest(".categorias-carousel");

  function irA(indice) {
    actual = (indice + total) % total;
    track.style.transform = `translateX(-${actual * 100}%)`;
    puntos.forEach((p, i) => p.classList.toggle("activo", i === actual));
  }

  puntos.forEach((p, i) => p.addEventListener("click", () => irA(i)));
  carrusel.querySelector(".categorias-carousel__btn--prev").addEventListener("click", () => irA(actual - 1));
  carrusel.querySelector(".categorias-carousel__btn--next").addEventListener("click", () => irA(actual + 1));

  let auto = setInterval(() => irA(actual + 1), 4000);
  carrusel.addEventListener("mouseenter", () => clearInterval(auto));
  carrusel.addEventListener("mouseleave", () => {
    auto = setInterval(() => irA(actual + 1), 4000);
  });

  irA(0);
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