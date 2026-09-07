function mostrarError(input, mensaje) {
  input.classList.add("campo-invalido");
  const spanError = document.getElementById(`${input.id}-error`);
  if (spanError) spanError.textContent = mensaje;
}
 
function limpiarError(input) {
  input.classList.remove("campo-invalido");
  const spanError = document.getElementById(`${input.id}-error`);
  if (spanError) spanError.textContent = "";
}

 
function validarRequerido(input, etiqueta = "Este campo") {
  if (input.value.trim() === "") {
    mostrarError(input, `${etiqueta} es obligatorio.`);
    return false;
  }
  limpiarError(input);
  return true;
}
 
function validarSelectRequerido(select, etiqueta = "Debes seleccionar una opción") {
  if (select.value.trim() === "") {
    mostrarError(select, `${etiqueta}.`);
    return false;
  }
  limpiarError(select);
  return true;
}
 
function validarEmail(input) {
  if (!validarRequerido(input, "El correo")) return false;
 
  const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!patronCorreo.test(input.value.trim())) {
    mostrarError(input, "Ingresa un correo con formato válido (ej: nombre@correo.com).");
    return false;
  }
 
  limpiarError(input);
  return true;
}
 
function validarTelefono(input, { minimo = 8, maximo = 15 } = {}) {
  if (!validarRequerido(input, "El teléfono")) return false;
 
  const soloNumeros = input.value.replace(/[^0-9]/g, "");
  if (soloNumeros.length < minimo || soloNumeros.length > maximo) {
    mostrarError(input, `El teléfono debe tener entre ${minimo} y ${maximo} dígitos numéricos.`);
    return false;
  }
 
  limpiarError(input);
  return true;
}

function validarNumeroEnRango(input, { minimo = null, maximo = null, etiqueta = "El valor" } = {}) {
  const valor = Number(input.value);
 
  if (input.value.trim() === "" || Number.isNaN(valor)) {
    mostrarError(input, `${etiqueta} debe ser un número.`);
    return false;
  }
 
  if (!Number.isInteger(valor)) {
    mostrarError(input, `${etiqueta} debe ser un número entero.`);
    return false;
  }
 
  if (minimo !== null && valor < minimo) {
    mostrarError(input, `${etiqueta} no puede ser menor que ${minimo}.`);
    return false;
  }
 
  if (maximo !== null && valor > maximo) {
    mostrarError(input, `${etiqueta} no puede ser mayor que ${maximo}.`);
    return false;
  }
 
  limpiarError(input);
  return true;
}

function validarLongitudMinima(input, minimo, etiqueta = "Este campo") {
  if (!validarRequerido(input, etiqueta)) return false;
 
  if (input.value.trim().length < minimo) {
    mostrarError(input, `${etiqueta} debe tener al menos ${minimo} caracteres.`);
    return false;
  }
 
  limpiarError(input);
  return true;
}

function validarCoherencia(inputMenor, inputMayor, mensaje) {
  const valorMenor = Number(inputMenor.value);
  const valorMayor = Number(inputMayor.value);
 

  if (inputMenor.value.trim() === "" || inputMayor.value.trim() === "") {
    limpiarError(inputMayor);
    return true;
  }
 
  if (valorMenor > valorMayor) {
    mostrarError(inputMayor, mensaje);
    return false;
  }
 
  limpiarError(inputMayor);
  return true;
}
 

function validarCoincidencia(inputOriginal, inputConfirmacion, mensaje) {
  if (inputConfirmacion.value.trim() === "") {
    mostrarError(inputConfirmacion, "Debes confirmar este campo.");
    return false;
  }
 
  if (inputOriginal.value !== inputConfirmacion.value) {
    mostrarError(inputConfirmacion, mensaje);
    return false;
  }
 
  limpiarError(inputConfirmacion);
  return true;
}