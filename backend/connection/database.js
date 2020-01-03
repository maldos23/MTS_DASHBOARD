var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
require('dotenv').config();
//configuracion de servicios MTS
var config = {
    server: process.env.MTS_SERVER,
    authentication: {
        type: 'default',
        options: {
            userName: process.env.MTSDB_USER,
            password: process.env.MTSDB_PASS
        }
    },
    options: {
        database: process.env.MTSDB,
        port: Number(process.env.MTSDB_PORT),
    }
  }

var connect = new Connection(config);
//Bloque de conexxion asincrona
connect.on('connect',connected);
connect.on('infoMessage',infoError);
connect.on('errorMessage',infoError);
connect.on('end',end);
connect.on('debug',debug);
connect.on('',(err) => {
    console.log(err);
})
/*  
    Creo funcciones para poder operar base de datos sin que se
    colapse el servicio de base de datos ante cada evento
*/

function connected(err){
    if(err){
        console.log("Error en base de datos MTS" + err);
        process.exit(1);
    }else{
        console.log("Base de dato MTS conectada");
        
    process.stdin.resume();

    process.stdin.on('data', function (chunk) {
        execsql(chunk);
    });

    process.stdin.on('end', function () {
        process.exit(0);
    });
    }
}

function infoError(info){
    console.log(info.number + ' : ' + info.message);
}

function end(){
    console.log('Connection closed');
    process.exit(0);
}

function debug(message,err) {
    if(err){
        console.log("err:"+err);
    }else{
    console.log("Proccess:"+message);
    }
}

function statuscomplete(err,rowCount){
    if(err){
        console.log("Error detectado: "+err);
    }else{
        console.log("Filas: "+ rowCount);
    }
}

//Ejecucion de querys
async function execsql(sql,res){
    let query = sql.toString();
    var request = new Request(query,statuscomplete);
    request.on('columnMetadata',columnMetadata);
    request.on('done', requestDone);
    connect.execSql(request);
}

function columnMetadata(columnsMetadata) {
    columnsMetadata.forEach(function(column) {
      //console.log(column);
    });
  }

function requestDone(rowCount, more) {   
    console.log(rowCount + ' rows');
}

module.exports = {
    createQuery:execsql
};
