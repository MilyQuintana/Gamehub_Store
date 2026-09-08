

const LLAVE_CARRITO = "gamehub_carrito";
const LLAVE_CUPON = "gamehub_cupon";
const LLAVE_ORDENES = "gamehub_ordenes";


const CUPONES = [
  { codigo: "GAMER10",      porcentaje: 10, tope: 50000,  fechaInicio: "2026-01-01", fechaFin: "2026-12-31" },
  { codigo: "BIENVENIDO15", porcentaje: 15, tope: 80000,  fechaInicio: "2026-01-01", fechaFin: "2026-08-01" },
];


function formatearCLP(monto) {
  return monto.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

function leerCarrito() {
  try {
    const datos = localStorage.getItem(LLAVE_CARRITO);
    return datos ? JSON.parse(datos) : [];
  } catch (error) {
    console.error("No se pudo leer el carrito guardado:", error);
    return [];
  }
}

function guardarCarrito(lineas) {
  localStorage.setItem(LLAVE_CARRITO, JSON.stringify(lineas));
  actualizarContadorCarrito();
}

function agregarAlCarrito(idProducto, cantidad) {
  const lineas = leerCarrito();
  const lineaExistente = lineas.find((linea) => linea.idProducto === idProducto);

  if (lineaExistente) {
   
    lineaExistente.cantidad += cantidad;
  } else {
    lineas.push({ idProducto, cantidad });
  }

  guardarCarrito(lineas);
}

function actualizarCantidadCarrito(idProducto, cantidad) {
  let lineas = leerCarrito();

  if (cantidad <= 0) {
    lineas = lineas.filter((linea) => linea.idProducto !== idProducto);
  } else {
    const linea = lineas.find((l) => l.idProducto === idProducto);
    if (linea) linea.cantidad = cantidad;
  }

  guardarCarrito(lineas);
}

function quitarDelCarrito(idProducto) {
  const lineas = leerCarrito().filter((linea) => linea.idProducto !== idProducto);
  guardarCarrito(lineas);
}

function vaciarCarrito() {
  guardarCarrito([]);
  quitarCupon();
}

function obtenerCantidadTotalCarrito() {
  return leerCarrito().reduce((total, linea) => total + linea.cantidad, 0);
}


function obtenerCuponAplicado() {
  try {
    const datos = localStorage.getItem(LLAVE_CUPON);
    return datos ? JSON.parse(datos) : null;
  } catch (error) {
    return null;
  }
}

function guardarCuponAplicado(codigo) {
  localStorage.setItem(LLAVE_CUPON, JSON.stringify({ codigo }));
}

function quitarCupon() {
  localStorage.removeItem(LLAVE_CUPON);
}


function validarCupon(codigo) {
  const cupon = CUPONES.find((c) => c.codigo.toUpperCase() === codigo.toUpperCase());

  if (!cupon) {
    return { valido: false, motivo: "Ese código de cupón no existe.", cupon: null };
  }

  const hoy = new Date().toISOString().slice(0, 10);
  if (hoy < cupon.fechaInicio || hoy > cupon.fechaFin) {
    return { valido: false, motivo: "Ese cupón está vencido o aún no está vigente.", cupon: null };
  }

  return { valido: true, motivo: "", cupon };
}

function calcularTotalesCarrito() {
  const lineas = leerCarrito();

  const lineasDetalladas = lineas
    .map((linea) => {
      const producto = PRODUCTOS.find((p) => p.id === linea.idProducto);
      if (!producto) return null;

      const precioUnitario = producto.precioDescuento ?? producto.precioNormal;
      return {
        producto,
        cantidad: linea.cantidad,
        precioUnitario,
        subtotal: precioUnitario * linea.cantidad,
      };
    })
    .filter(Boolean);

  const subtotal = lineasDetalladas.reduce((acumulado, linea) => acumulado + linea.subtotal, 0);

  let descuento = 0;
  const cuponGuardado = obtenerCuponAplicado();
  if (cuponGuardado) {
    const resultado = validarCupon(cuponGuardado.codigo);
    if (resultado.valido) {
      descuento = Math.min(subtotal * (resultado.cupon.porcentaje / 100), resultado.cupon.tope);
    }
  }

  const total = Math.max(subtotal - descuento, 0);

  return { lineasDetalladas, subtotal, descuento, total };
}


function leerOrdenes() {
  try {
    const datos = localStorage.getItem(LLAVE_ORDENES);
    return datos ? JSON.parse(datos) : [];
  } catch (error) {
    return [];
  }
}

function guardarOrden(orden) {
  const ordenes = leerOrdenes();
  ordenes.unshift(orden); // la más nueva primero
  localStorage.setItem(LLAVE_ORDENES, JSON.stringify(ordenes));
}

function actualizarOrden(numeroOrden, cambios) {
  const ordenes = leerOrdenes();
  const orden = ordenes.find((o) => o.numero === numeroOrden);
  if (!orden) return;
  Object.assign(orden, cambios);
  localStorage.setItem(LLAVE_ORDENES, JSON.stringify(ordenes));
}


function actualizarContadorCarrito() {
  const contador = document.getElementById("carrito-contador");
  if (contador) contador.textContent = obtenerCantidadTotalCarrito();
}

document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);
