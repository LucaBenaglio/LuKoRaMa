
//usamos fetch para traer sonidos de un json local, los sonidos se ejecutan con funciones que iremos dejando dentro del codigo dependiendo de las acciones del usuario

async function buscarSonidos() {
    const sonidos = await fetch(`./json/sounds.json`)
    const sonidosParseados = await sonidos.json()
    return sonidosParseados
}



//Inicializacion de variables, algunas ya tienen su valor y algunas se los demas mediante avance el juego

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



//Documento html

let mostrarMovimientos = document.getElementById(`movimientos`);
let mostrarAciertos = document.getElementById(`aciertos`);
let mostrarTiempo = document.getElementById(`t-restante`);




//Generamos un boton para intercambiar entre modo oscuro y modo claro, dentro del boton creamos un local storage mediante (classlist y remove) de clases

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



//Generamos un array de numeros aleatorios para nuestro juego 

let numeros = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8,];
numeros = numeros.sort(() => { return Math.random() - 0.5 });
console.log(numeros);



//Funcion para contar tiempo

function contarTiempo() {
    tiempoRegresivoId = setInterval(() => {
        timer--;
        mostrarTiempo.innerHTML = `Tiempo: ${timer}s`;


        if (timer == 0) {

            //Si el timer llega a 0 el usuario pierde, entonces ejecutamos una funcion que bloquee las tarjetas
            clearInterval(tiempoRegresivoId)
            bloquearTarjetas();


            //Funcion de sonido (cuando al usuario se le acaba el tiempo)
            const sonidoPerder = buscarSonidos().then(sonidos => {
                sonidos.forEach((sonido) => {
                    let perderAudio = new Audio(sonido.perder)
            
                    perderAudio.play()
                })
            })


            //Mensaje de sweet alert
            Swal.fire({
                icon: 'error',
                title: 'Perdiste',
                text: 'Se acabo tu tiempo :(',
            })
        }
    }, 1000)
}



//Funcion para bloquear tarjetas

function bloquearTarjetas() {
    for (let i = 0; i <= 15; i++) {
        let tarjetaBloqueada = document.getElementById(i);
        tarjetaBloqueada.innerHTML = numeros[i];
        tarjetaBloqueada.disabled = true;
    }
}



//Funcion principal

function destapar(id) {


    //Si temporizador es falso ejecutamos la funcion contarTiempo
    if (temporizador == false) {
        contarTiempo();
        temporizador = true;
    }

    tarjetasDestapadas++;
    console.log(tarjetasDestapadas);

    if (tarjetasDestapadas == 1) {

        //mostramos la primera tarjeta (primer numero)
        tarjeta1 = document.getElementById(id);
        primerResultado = numeros[id];
        tarjeta1.innerHTML = primerResultado;


        //Funcion de sonido (cuando el usuario hace click)
        const sonidoClick = buscarSonidos().then(sonidos => {
            sonidos.forEach((sonido) => {
                let clickAudio = new Audio(sonido.click)
        
                clickAudio.play()
            })
        })


        //Usamos el metodo disabled para que no pueda volver a presionar la misma tarjeta
        tarjeta1.disabled = true;

    } else if (tarjetasDestapadas == 2) {

        //Mostramos la segunda tarjeta (segundo numero)
        tarjeta2 = document.getElementById(id);
        segundoResultado = numeros[id];
        tarjeta2.innerHTML = segundoResultado;


        //Desabilitamos la segunda tarjeta
        tarjeta2.disabled = true;


        //Aumentamos los movimientos y los mostramos
        movimientos++;
        mostrarMovimientos.innerHTML = `Movimientos: ${movimientos}`;


        //Consultamos si la primera tarjeta es igual a la segunda
        if (primerResultado == segundoResultado) {

            //Si ambas tarjetas son iguales, reiniciamos la variable trajetas destapadas y asi podemos volver a destapar otras 2 tarjetas
            tarjetasDestapadas = 0;


            //Aumentamos los aciertos y los mostramos
            aciertos++;
            mostrarAciertos.innerHTML = `Aciertos: ${aciertos}`;


            //Funcion de sonido (cuando el usuario destapa 2 tarjetas iguales)
            const sonidoAcierto = buscarSonidos().then(sonidos => {
                sonidos.forEach((sonido) => {
                    let aciertoAudio = new Audio(sonido.acierto)
            
                    aciertoAudio.play()
                })
            })


            //Si los aciertos son = 8 (significa que el usuario termino el juego)
            if (aciertos == 8) {


                //Funcion de sonido (cuando el usuario gana el juego)
                const sonidoGanar = buscarSonidos().then(sonidos => {
                    sonidos.forEach((sonido) => {
                        let ganarAudio = new Audio(sonido.ganar)
                
                        ganarAudio.play()
                    })
                })


                //Mostramos los mensajes finales con la informacion de su partida
                clearInterval(tiempoRegresivoId);
                mostrarAciertos.innerHTML = `Has completado el LuKoRaMa!`;
                mostrarTiempo.innerHTML = `Te demoraste ${timerInicial - timer} segundos`;
                mostrarMovimientos.innerHTML = `Lo has hecho en ${movimientos} movimientos`;
            }

            //caso contrario las 2 tarjetas no son iguales
        } else {


            //Funcion de sonido (cuando el usuario destapa 2 tarjetas distintas)
            const sonidoError = buscarSonidos().then(sonidos => {
                sonidos.forEach((sonido) => {
                    let errorAudio = new Audio(sonido.error)
            
                    errorAudio.play()
                })
            })


            //Mostramos los valores de las tarjetas momentaneamente, las volvemos a tapar y se repite el ciclo
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
