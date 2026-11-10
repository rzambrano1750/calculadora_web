
// Obtener la pantalla de la calculadora
const pantalla = document.getElementById("pantalla");

// Variable para identificar si ya se mostró un resultado
let resultadoMostrado = false;

// Funcion para agregar numeros y operadores
function agregar(valor) {

    // Si aparece un error, reiniciar la pantalla
    if (pantalla.value === "Error") {
        pantalla.value = "0";
    }

    // Si se acaba de calcular y se ingresa un numero,
    // comenzar una nueva operacion
    if (resultadoMostrado) {
        if (/[0-9.]/.test(valor)) {
            pantalla.value = "0";
        }
        resultadoMostrado = false;
    }

    let expresion = pantalla.value;

    // Evitar dos puntos decimales en un mismo numero
    if (valor === ".") {
        const numeros = expresion.split(/[+\-*/]/);
        const ultimoNumero = numeros[numeros.length - 1];

        if (ultimoNumero.includes(".")) {
            return;
        }
    }

    // Evitar operadores repetidos
    if (/[+\-*/]/.test(valor)) {

        const ultimo = expresion.slice(-1);

        if (/[+\-*/]/.test(ultimo)) {
            if (valor === "-" && ultimo !== "-") {
                pantalla.value += valor;
                return;
            }

            pantalla.value = expresion.slice(0, -1) + valor;
            return;
        }
    }

    // Reemplazar el cero inicial por el numero ingresado
    if (expresion === "0" && /^[0-9]$/.test(valor)) {
        pantalla.value = valor;
    } else {
        pantalla.value += valor;
    }
}

// Funcion para limpiar toda la pantalla
function limpiar() {
    pantalla.value = "0";
    resultadoMostrado = false;
}

// Funcion para borrar el ultimo caracter
function borrar() {

    if (pantalla.value === "Error" || resultadoMostrado) {
        limpiar();
        return;
    }

    pantalla.value = pantalla.value.slice(0, -1);

    if (pantalla.value === "" || pantalla.value === "-") {
        pantalla.value = "0";
    }
}

// Funcion para realizar las operaciones
function calcular() {

    try {

        const expresion = pantalla.value;

        // Validar los caracteres permitidos
        if (!/^[0-9+\-*/. ]+$/.test(expresion)) {
            throw new Error("Expresion no valida");
        }

        // Verificar que la expresion no termine en un operador
        if (/[+\-*/.]$/.test(expresion)) {
            throw new Error("Operacion incompleta");
        }

        // Realizar el calculo
        const resultado = Function(
            '"use strict"; return (' + expresion + ')'
        )();

        // Verificar que el resultado sea valido
        if (!Number.isFinite(resultado)) {
            throw new Error("Resultado no valido");
        }

        // Mostrar el resultado
        pantalla.value = Number(
            resultado.toPrecision(12)
        ).toString();

        resultadoMostrado = true;

    } catch (error) {

        pantalla.value = "Error";
        resultadoMostrado = false;

    }
}