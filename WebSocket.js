const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let players = [];

wss.on('connection', (ws) => {

    let id_player = players.length + 1

    if (id_player === 1) {
        ws.send(JSON.stringify({ type: 'welcome', message: 'Bienvenido', role: "player" }));
        role = "player";
    } else if (id_player === 2) {
        ws.send(JSON.stringify({ type: 'welcome', message: 'Bienvenido', role: "stone" }));
        role = "stone"
    }

    //nota frany: No tenía muy claro a que te refieres con username, voy a
    //asumir que es el rol para saber a quien hay que reenviar los datos porque
    //actualmente el if del username no funciona bien porque no existe el
    //atributo username

    const player = { id:id_player ,username:role , ws };
    players.push(player);

    if (players.length == 2) {
        // Informar a ambos jugadores que están listos para jugar
        players.forEach(player => {
            player.ws.send(JSON.stringify({ type: 'ready', message: 'Los dos jugadores están conectados.' }));
        });
    }

    console.log('Un jugador se ha conectado.');
    // Cuando se recibe un mensaje del cliente
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        //Procesa el mensaje de invocaciuon de piedra
        if (data.type == "stone") {
            // data debería ser: {type: "stone", stone: (posición de la piedra), username: (nombre del jugador)}
            console.log('Se ha informado de una piedra invocada en: ',data);
            const xStone = data.stone;
            // Informar a todos los jugadores menos el que está enviando la información
            players.forEach(player => {
                if (player.username !== data.username) {
                    player.ws.send(JSON.stringify({ type: "stone", stone: xStone }));
                }
            });
        }
        //Procesa el mensaje de posicion del jugador
        if (data.type == "movePlayer") {

            // data debería ser: {type: "stone", stone: (posición de la piedra), username: (nombre del jugador)}
            console.log('Se ha informado de que el jugador se ha movida hacia la: ');
            if (data.side == 0) {
              console.log("Izquierda")
            }
            else if (data.side == 1) {
              console.log("Derecha")
            } else {
              console.log("Desconocido")
              console.log(data)
            }
            // Informar a todos los jugadores menos el que está enviando la información
            players.forEach(player => {
                if (player.username !== data.username) {
                    console.log("Antes de enviar el dato");
                    player.ws.send(JSON.stringify({ type: "movePlayer", side: data.side }));
                }
            });
        }
    });

    ws.on('close', () => {
        players = players.filter(player => player.ws !== ws);
        console.log('Un jugador se ha desconectado.');
    });
});
