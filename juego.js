var ctx;
var sx, sy, sw, sh, dx, dy, dw, dh, p = 0, paso = 8;
var frameIndex = 0, totalFrames = 8;
sx = 0 //Source  x. Frame index times frame width
sy = 0 //Source y
sw = 71; //Frame width
sh = 112; //Frame height
dx = 0; //Destination x
dy = 480; //Destination y
dw = 71; //Destination width
dh = 112; // Destination height
var ssx = 0;

var img = new Image();
img.src = 'sprite.png';
var img2 = new Image();
img2.src = "fondo.jpg";
var v = [];
var moneda = new Array();
var explosion = new blast(100, 100);
var refreshIntervalId;
var r;
var colision = false;
let playerRole = "";

//Conexion al socket
const socket = new WebSocket('ws://localhost:8080/');
socket.onopen;

// socket.onmessage = (message) => {
//     const data = JSON.parse(message);
//
// }

//---------------------------------------------------------------------------
function cargaContextoCanvas(idCanvas) {
    var elemento = document.getElementById(idCanvas);
    if (elemento && elemento.getContext) {
        var contexto = elemento.getContext('2d');
        if (contexto) {
            return contexto;
        }
    }
    return FALSE;
}



//---------------------------------------------------------------------------
function azar(h) { return parseInt(Math.random() * h); }
//---------------------------------------------------------------------------
function blast(xPos, yPos)//posicion x,y y numero de fotograma
{
    //Atributos
    this.xPos = xPos;
    this.yPos = yPos;
    this.imagen = new Image();
    this.imagen.src = "blast.png";
    this.frameIndex = 0;
    this.totalFrames = 14;
    this.pintar = function (a) {
        this.xPos = a;
        this.yPos = 377;
        ssx = 170 * this.frameIndex;
        ctx.drawImage(img2, this.xPos, this.yPos, 170, 233, this.xPos, this.yPos, 170, 233);
        ctx.drawImage(this.imagen, ssx, 0, 170, 233, this.xPos, this.yPos, 170, 233);
        this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
    }

}



function coin(xPos, yPos)//posicion x,y y numero de fotograma
{
    //Atributos
    this.xPos = xPos;
    this.yPos = yPos;
    this.imagen = new Image();
    this.imagen.src = "coin.png";
    this.frameIndex = azar(19);
    this.totalFrames = 19;
    this.size = 50;
    this.pintar = function () {
        ssx = 100 * this.frameIndex;
        ctx.drawImage(img2, this.xPos, this.yPos - 5, this.size, this.size, this.xPos, this.yPos - 5, this.size, this.size);
        ctx.drawImage(this.imagen, ssx, 0, 100, 100, this.xPos, this.yPos, this.size, this.size);
        this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
        this.yPos += 5
        if (this.yPos > 700) { this.yPos = -1400; this.xPos = azar(700); }
    }

}
function e() { colision = false; }
function bomba(xPos, yPos)//posicion x,y y numero de fotograma
{
    //Atributos
    this.xPos = xPos;
    this.yPos = yPos;
    this.imagen = new Image();
    this.imagen.src = "bomba.png";
    this.frameIndex = azar(19);
    this.totalFrames = 19;
    this.size = 42//azar(5) * 10 + 22;

    this.pintar = function (alfa) {
        ssx = 72 * this.frameIndex;
        ctx.drawImage(img2, this.xPos, this.yPos - 5, this.size, this.size, this.xPos, this.yPos - 5, this.size, this.size);
        ctx.drawImage(this.imagen, ssx, 0, 72, 72, this.xPos, this.yPos, this.size, this.size);
        this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
        this.yPos += 5
        if (this.yPos > 500 - this.size) {
            if (((this.xPos > dx + p) && (this.xPos < dx + p + 72)) ||
                ((this.xPos + this.size > dx + p) && (this.xPos + this.size < dx + p + 72))) //colision
            {
                //clearInterval(refreshIntervalId);
                colision = true;



                r = dx + p - 30;
                ctx.drawImage(img2, 0, 0, 800, 600, 0, 0, 800, 600);// el fondo es de 800*600
                d();
                setTimeout(d, 100);
                setTimeout(d, 200);
                setTimeout(d, 300);
                setTimeout(d, 400);
                setTimeout(d, 500);
                setTimeout(d, 600);
                setTimeout(d, 700);
                setTimeout(d, 800);
                setTimeout(d, 900);
                setTimeout(d, 1000);
                setTimeout(d, 1100);
                setTimeout(d, 1200);
                setTimeout(d, 1300);
                setTimeout(e, 1350);

                this.yPos = -1300; //this.xPos = azar(725);

            }

        }
        if (this.yPos > 600) {

            this.yPos = -300; //this.xPos = azar(725);
        }
    }

}
function d() {
    explosion.pintar(r);
}
{
    function c() {
        if (!colision) {
            for (let i = 0; i < v.length; i++) {
                if (v[i]) { // Asegúrate de que hay una bomba en el índice
                    v[i].pintar();
                }
            }
        }
    }
}
function a() {
    //FUNCION DE IR A LA IZQUIERDA
    ctx.drawImage(img2, p, 480, sw, sh, p, 480, dw, dh);// el fondo es de 800*600
    p -= paso;
    if (p < 0) { p = 0; }
    frameIndex = (frameIndex + 1) % totalFrames;
    sx = sw * frameIndex;
    ctx.drawImage(img, sx, sy, sw, sh, dx + p, dy, dw, dh);
    //Despues de que se redibuje, se envía la información al servidor
    console.log("Enviando la posición del jugador:");
    console.log(p);
    socket.send(JSON.stringify({ type: "posPlayer", posPlayerX: p }))
    //Idea loca, en vez de publicar la posicioon publico el lado al que va, así
    //en el otro lado solo habría que llamar a la funcion del lado correcto
    // 0 izquierda y 1 derecha
    //socket.send(JSON.stringify({ type: "movePlayer", side: 0 }))
}
function b() {
    //FUNCION DE IR A LA DERECHA
    ctx.drawImage(img2, p, 480, sw, sh, p, 480, dw, dh);// el fondo es de 800*600
    p += paso;
    if (p > 729) { p = 729; }//800-71 ancho del fondo menos ancho del sprite
    frameIndex = (frameIndex + 1) % totalFrames;
    sx = sw * frameIndex;
    ctx.drawImage(img, sx, sy, sw, sh, dx + p, dy, dw, dh);
    //Despues de que se redibuje, se envía la información al servidor
    console.log("Enviando la posición del jugador:");
    console.log(p);
    socket.send(JSON.stringify({ type: "posPlayer", posPlayerX: p }))
    //Idea loca, en vez de publicar la posicioon publico el lado al que va, así
    //en el otro lado solo habría que llamar a la funcion del lado correcto
    // 0 izquierda y 1 derecha

}
function checkKeyPressed(e) {
  
  if (playerRole=="player") {

    if ((e.keyCode == "37") && (!colision)) {

        sy = 112;


        setTimeout(a, 0);
        socket.send(JSON.stringify({ type: "movePlayer", side: 0, username: playerRole }))
        setTimeout(a, 100);
        socket.send(JSON.stringify({ type: "movePlayer", side: 0, username: playerRole }))
        setTimeout(a, 200);
        socket.send(JSON.stringify({ type: "movePlayer", side: 0, username: playerRole }))
        setTimeout(a, 300);
        socket.send(JSON.stringify({ type: "movePlayer", side: 0, username: playerRole }))
        //setTimeout(a,400);


    }
    if ((e.keyCode == "39") && (!colision)) {
        sy = 0;
        setTimeout(b, 0);
        socket.send(JSON.stringify({ type: "movePlayer", side: 1, username: playerRole }))
        setTimeout(b, 100);
        socket.send(JSON.stringify({ type: "movePlayer", side: 1, username: playerRole }))
        setTimeout(b, 200);
        socket.send(JSON.stringify({ type: "movePlayer", side: 1, username: playerRole }))
        setTimeout(b, 300);
        socket.send(JSON.stringify({ type: "movePlayer", side: 1, username: playerRole }))
        //setTimeout(b,400);


    }
  }



}
refreshIntervalId = setInterval(c, 50);

//---------------------------------------------------------------------------
let maxBombas = 50; // Define el máximo de bombas que puedes almacenar
let t = 0; // Índice para la generación de bombas

function generarPiedra(x, y) {
    v[t] = new bomba(x, y); // Crea una nueva bomba
    t = (t + 1) % maxBombas; // Sobrescribe la bomba más antigua
    console.log(v);
    console.log("Enviando la posición de piedra invocada:");
    console.log(x);
}


window.onload = function () {
    //Recibimos el elemento canvas
    ctx = cargaContextoCanvas('micanvas');
    if (ctx) {

        ctx.drawImage(img2, 0, 0);
        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);

    }
}

let canvas = document.getElementById('micanvas');

// Función para obtener la posición del ratón en el canvas
function getMousePos(event) {
    const rect = canvas.getBoundingClientRect();  // Obtiene el tamaño y posición del canvas
    const x = event.clientX - rect.left;  // Posición del ratón relativa al canvas (eje X)
    const y = event.clientY - rect.top;   // Posición del ratón relativa al canvas (eje Y)
    return { x, y };
}

function onCanvasClick(event) {
  if (playerRole=="stone") {
    const mousePos = getMousePos(event);  // Obtiene las coordenadas del clic
    ctx.beginPath();
    generarPiedra(mousePos.x,0);  // Dibuja un círculo en la posición del clic
    socket.send(JSON.stringify({ type: "stone", stone: mousePos.x, username: playerRole }))
  }
}

//Solo habilitamos el listener en caso de que sea el rol de piedra
canvas.addEventListener('click', onCanvasClick);

window.addEventListener("keydown", checkKeyPressed, false);


socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("Mensaje recibido:",data);

  if (data.type == "stone") {
    console.log("Mensaje de invocacion de piedra recibido...");
    generarPiedra(data.stone,0);
  }
  if (data.type === 'welcome') {
      console.log("Mensaje de bienvenida recibido...");
      playerRole = data.role;
      console.log(data.message, "Tu rol es: " + playerRole);
  }
  if (data.type === 'movePlayer') {
    if(data.side === 0){
      a()
    } else if (data.side === 1) {
      b()
    } else {
      console.log("Direccion desconocida...")
    }
  }

};
