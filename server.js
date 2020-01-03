//---------- Frameworks y Middlewares ------------
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
var io = require('socket.io');
//DataBase
var db = require('./backend/connection/database');
// Importo servicio de WebSocket
require('./backend/connection/WebSockets');
//Ajuste chino de api XD
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
// -------- Complements -------------
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json({limit: '50mb'}));
app.use(cors());
app.use(function(req,res,next){
    req.SqlQuery = db.createQuery;
    req.io = io;
    next();
});
app.use('/api/services', require('./backend/routes/client.routes'));
// --- uso socket envevido sobre el servicio
//db.createQuery("SELECT * FROM [odbc].[REP_Embarques_Proceso]");
//------------- connect Server -------------

app.listen(4000,() => {
    console.log("Servidor en linea!");
});