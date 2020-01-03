// --------------- FRAMEWORK ---------------
const express = require('express');
const app = express();
//------< PORT > ---------
//Modificar en caso de que el puerto se encuentre ocupado
let port = 8090;
// ------------- websocket server ------------
var io = require('socket.io').listen(app.listen(port),{
    transports:[
        'websocket',
        'polling',
        'long-polling'
    ]
});

var ResourceViews = new Object();

setInterval(() => {
    ResourceViews
},6000);
io.on('connection', (client) => {
    console.log('\x1b[32m%s\x1b[0m','\nCliente conectado\n');
    //Emito mensaje de conexion al servicio
    client.emit('WS_KULU', {
        message:'MTS-KULU en Linea',
        type:'success'
    });
});

//notificacion
console.log('\x1b[34m%s\x1b[0m','WebSocket en Linea \n\rPuerto: ' + port);