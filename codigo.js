






// fetch(`./json/sounds.json`)
// .then(response => response.json())
// .then()











let tarjetasDestapadas = 0;
let movimientos = 0;
let aciertos = 0;
let timer = 30;
let timerInicial = 30;

let tarjeta1 = null;
let tarjeta2 = null;

let primerResultado = null;
let segundoResultado = null;

let temporizador = false;
let tiempoRegresivoId = null;

let mostrarMovimientos = document.getElementById(`movimientos`);
let mostrarAciertos = document.getElementById(`aciertos`);
let mostrarTiempo = document.getElementById(`t-restante`);






const botonSwitch = document.getElementById(`switch`);

botonSwitch.addEventListener(`click`, () => {
    document.body.classList.toggle(`dark`);
    botonSwitch.classList.toggle(`active`);

    if(document.body.classList.contains(`dark`)){
        localStorage.setItem(`dark-mode`, `true`);
    } else {
        localStorage.setItem(`dark-mode`, `false`)
    }
})

if(localStorage.getItem(`dark-mode`) === `true`) {
    document.body.classList.toggle(`dark`);
    botonSwitch.classList.add(`active`);
} else {
    document.body.classList.remove(`dark`);
    botonSwitch.classList.remove(`active`);
}


let numeros = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8,];
numeros = numeros.sort(() => { return Math.random() - 0.5 });
console.log(numeros);

function contarTiempo() {
    tiempoRegresivoId = setInterval(() => {
        timer--;
        mostrarTiempo.innerHTML = `Tiempo: ${timer}s`;
        if (timer == 0) {
            clearInterval(tiempoRegresivoId)
            bloquearTarjetas();

            Swal.fire({
                icon: 'error',
                title: 'Perdiste',
                text: 'Se acabo tu tiempo :(',
            })
        }
    }, 1000)
}

function bloquearTarjetas() {
    for (let i = 0; i <= 15; i++) {
        let tarjetaBloqueada = document.getElementById(i);
        tarjetaBloqueada.innerHTML = numeros[i];
        tarjetaBloqueada.disabled = true;
    }
}

function destapar(id) {
    if (temporizador == false) {
        contarTiempo();
        temporizador = true;
    }

    tarjetasDestapadas++;
    console.log(tarjetasDestapadas);

    if (tarjetasDestapadas == 1) {
        tarjeta1 = document.getElementById(id);
        primerResultado = numeros[id];
        tarjeta1.innerHTML = primerResultado;

        tarjeta1.disabled = true;

    } else if (tarjetasDestapadas == 2) {
        tarjeta2 = document.getElementById(id);
        segundoResultado = numeros[id];
        tarjeta2.innerHTML = segundoResultado;

        tarjeta2.disabled = true;

        movimientos++;
        mostrarMovimientos.innerHTML = `Movimientos: ${movimientos}`;


        if (primerResultado == segundoResultado) {
            tarjetasDestapadas = 0;

            aciertos++;
            mostrarAciertos.innerHTML = `Aciertos: ${aciertos}`;

            if (aciertos == 8) {
                clearInterval(tiempoRegresivoId);
                mostrarAciertos.innerHTML = `Has completado el LuKoRaMa!`;
                mostrarTiempo.innerHTML = `Te demoraste ${timerInicial - timer} segundos`;
                mostrarMovimientos.innerHTML = `Lo has hecho en ${movimientos} movimientos`;
            }

        } else {
            setTimeout(() => {
                tarjeta1.innerHTML = ` `;
                tarjeta2.innerHTML = ` `;
                tarjeta1.disabled = false;
                tarjeta2.disabled = false;
                tarjetasDestapadas = 0;
            }, 800);
        }
    }
}
