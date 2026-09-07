let  ordenSeleccionada= null;

document.addEventListener("DOMContentLoaded", () => {
    renderizarListadoOrdenes();
    configurarAccionesDetalle();
});

function renderizarListadoOrdenes() { 
    const ordenes= leerOrdenes();
    const tabla= document.getElementById("tabla-ordenes");
    const vacio= document.getElementById("ordenes-vacio");
    const cuerpoTabla=document.getElementById("odenes-filas");

    const hayOrdenes= ordenes.length>0;
    tabla.hidden= !hayOrdenes;
    vacio.hidden= hayOrdenes;
    cuerpoTabla.innerHTML= "";

    ordenes.forEach((orden) =>{
        const fila= document.createElement("tr");
        fila.innerHTML= `
          <td>${orden.numero}</td>
          <td>${orden.fecha}</td>
          <td>${orden.estado}</td>
          <td>${formatearCLP(orden.total)}</td>
          <td><button class="boton boton-secundario">Ver detalle</button></td>
        `;
        fila.querySelector("button").addEventListener("click",() => mosatrarDetalleOrden(orden));
        cuerpoTabla.appendChild(fila);
    });
}

function mosatrarDetalleOrden(orden) {
    ordenSeleccionada= orden;
    const seccionDetalle= document.getElementById("orden-detalle");
    seccionDetalle.hidden=false;

    document.getElementById("orden-detalle-pago").textContent= `${orden.pago.estado} (${orden.pago.metodo})`;
    document.getElementById("orden-detalle-despacho").textContent= orden.despacho.estado;
    
    const listaProductos= document.getElementById("orden-detalle-productos");
    listaProductos.innerHTML="";
    orden.productos.forEach((producto)=>  {
        const item= document.createElement("li");
        item.textContent= `${producto.cantidad} x ${producto.nombre} - ${formatearCLP(producto.precio)}`;
        listaProductos.appendChild(item);

    });
     
    document.getElementById("form-garantia").hidden=true;
    seccionDetalle.scrollIntoView({behavior: "smooth"});
}

function configurarAccionesDetalle() {
    document.getElementById("btn-escribir-resena").addEventListener("click", () => {
      if (!ordenSeleccionada) return;

      const productoYaResenado=ordenSeleccionada.productos.every((p) => p.resenada);
      if (productoYaResenado){
        alert("Los productos de esta orden ya contienen una reseña.");
        return;
      }

      const productAResenar= ordenSeleccionada.productos.finds((p)=> !p.resenada);
      const comentario= prompt()
    
    });
 const productoAResenar = ordenSeleccionada.productos.find((p) => !p.resenada);
    const comentario = prompt(`Escribe tu reseña para "${productoAResenar.nombre}":`);
    if (!comentario || comentario.trim() === "") return;
 
    const puntuacion = Number(prompt("Puntuación del 1 al 5:", "5"));
    if (!Number.isInteger(puntuacion) || puntuacion < 1 || puntuacion > 5) {
      alert("La puntuación debe ser un número entero entre 1 y 5.");
      return;
    }
 
    const producto = PRODUCTOS.find((p) => p.id === productoAResenar.id);
    if (producto) {
      producto.resenas.push({
        autor: "Tú",
        puntuacion,
        comentario: comentario.trim(),
        fecha: new Date().toISOString().slice(0, 10),
      });
    }
 
    productoAResenar.resenada = true;
    actualizarOrden(ordenSeleccionada.numero, { productos: ordenSeleccionada.productos });
    alert("¡Gracias por tu reseña!");
  }
 
  document.getElementById("btn-solicitar-garantia").addEventListener("click", () => {
    document.getElementById("form-garantia").hidden = false;
  });
 
  document.getElementById("form-garantia").addEventListener("submit", (evento) => {
    evento.preventDefault();
    if (!ordenSeleccionada) return;
 
    const motivo = document.getElementById("garantia-motivo");
    if (!validarRequerido(motivo, "El motivo de la garantía")) return;
 
   
    const diasDesdeCompra = (Date.now() - new Date(ordenSeleccionada.fecha)) / (1000 * 60 * 60 * 24);
    if (diasDesdeCompra > 30) {
      mostrarError(motivo, "El plazo de garantía para esta orden ya venció (30 días).");
      return;
    }
 
    actualizarOrden(ordenSeleccionada.numero, {
      garantia: { motivo: motivo.value.trim(), estado: "En revisión" },
    });
 
    alert("Tu solicitud de garantía fue enviada y está en revisión.");
    motivo.value = "";
    document.getElementById("form-garantia").hidden = true;
  });


