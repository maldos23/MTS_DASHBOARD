const express = require('express');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const router = express.Router();
const mts_query = require('../config/querys.db');
var fancyQuery_mts = new mts_query;
//---- PROCESOS NODE ----
require("dotenv").config();
// Creo liga de API router

router.post('/login', async(req,res) => {
    try{
        function CreateError(error){
            res.json({error:true, text: typeof error === 'string'? error:`Error en Servicio: \n ${error.toString()}`});
        }
        if( typeof req.body === 'undefined' || req.body == {}){
            CreateError("Usuario y/o Contraseña requeridos")
        }else if(typeof req.body.user === 'undefined' || typeof req.body.pass === 'undefined'){
            CreateError("Usuario y/o Contraseña requeridos")
        }else {
            const data = {
                "headerRequest":{
                    "service":83,
                    "domain":100,
                    "business":1,
                    "channel":1,
                    "client":1,
                    "requestClient":123,
                    "requestDate":"2016-07-28T10:40:00"
                    },
                "businessRequest":{
                    "userDomain":"MX",
                    "userAccount":req.body.user,
	                "userPassword":req.body.pass
                }
            }
            fetch(process.env.URL_WALMEX_API_VALIDATE_USER,{
                rejectUnauthorized:false,
                method:'POST',
                body:JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then((datas) => getIndenty(datas))
            .catch((error) => CreateError(error));

            async function getIndenty(parameters){
                if(typeof parameters === 'object'){
                    if(typeof parameters.serviceEngineResponse === 'object'){
                        let responseWalmex = parameters.serviceEngineResponse;
                        if(responseWalmex.headerResponse.responseCode === "OK"){
                            const walmexToken = responseWalmex.businessResponse.ValidateUserResponse.businessResponse.DomaintItemsResult.TokenString;
                            let bodyDetailWalmex = {
                                businessRequest:{
                                    tokenString:walmexToken
                                }
                            }

                            fetch(process.env.URL_WALMEX_API_DETAILL_USER,{
                                rejectUnauthorized:false,
                                method:'POST',
                                body:JSON.stringify(bodyDetailWalmex),
                                headers: { 'Content-Type': 'application/json' }
                            })
                            .then(response => response.json())
                            .then((datas) => {
                                let detaill = datas.GetUserDetailResponse.businessResponse.DomaintItemsResult.UserDetail;
                                res.json({
                                    kulutoken:jwt.sign({employe:detaill.EmployeeNumber},process.env.PARSE_TOKEN),
                                    walmextoken: walmexToken, 
                                    detailluser:detaill
                                });
                            })
                            .catch((error) => CreateError(error));
                            
                            
                        }else {
                            CreateError("Usuario Invalido")
                        }
                    }else {
                        CreateError("Error de respuesta en servicio")
                    }
                }else {
                    CreateError("Error servicios de identificacion walmart")
                }
            } 
        }
    }catch(error){
        res.json({error:true, text: typeof error === 'string'? error:`Error en Servicio: \n ${error.toString()}`});
    }
});

router.get('/test',async(req,res)=> {
    try{
        var sql = require('mssql');
        var config = {
            server: process.env.MTS_SERVER,
            user: process.env.MTSDB_USER,
            password: process.env.MTSDB_PASS,
            database: process.env.MTSDB,
            port: Number(process.env.MTSDB_PORT),
            
        }
        await sql.connect(config, async (err)=> {
            if(err){
                res.json(err)
            }else{
                var data = new sql.Request();
                const query = `${fancyQuery_mts.getnumbertravels(req.query.cds)} ${fancyQuery_mts.getawaittravelsstatus(req.query.cds)} ${fancyQuery_mts.getcounthours(req.query.cds)} ${fancyQuery_mts.gettotalfinishtravels(req.query.cds)} `;
                await data.query(query,async(error,response) => {
                    if(error){
                        res.json({error:true, success:error});
                    }else {
                        var chart = new Array;
                        var prevField = new Object;
                        await response.recordsets[2].map(async (item) => {
                            if (typeof prevField[item.formato] === 'undefined'){
                                prevField[item.formato] = {
                                    12:item.clase === 12?item.total:0,
                                    24:item.clase === 24?item.total:0,
                                    48:item.clase === 48?item.total:0,
                                    72:item.clase === 72?item.total:0,
                                    96:item.clase === 96?item.total:0
                                }
                            }else{
                                prevField[item.formato] = {
                                    12:item.clas3e === 12?parseInt(item.total)+parseInt(prevField[item.formato][12]):item.total,
                                    24:item.clase === 24?parseInt(item.total)+parseInt(prevField[item.formato][24]):item.total,
                                    48:item.clase === 48?parseInt(item.total)+parseInt(prevField[item.formato][48]):item.total,
                                    72:item.clase === 72?parseInt(item.total)+parseInt(prevField[item.formato][72]):item.total,
                                    96:item.clase === 96?parseInt(item.total)+parseInt(prevField[item.formato][96]):item.total
                                }
                            }
                        });
                        for(var item in prevField){
                            chart.push({name:item,data:[prevField[item]['12'],prevField[item]['24'],prevField[item]['48'],prevField[item]['72'],prevField[item]['96']]})
                        }
                        const final = {
                            count_travels:response.recordsets[0],
                            pending_travels:response.recordsets[1],
                            t_pendding:response.recordsets[3][0].total,
                            t_dispach:response.recordsets[4][0].total,
                            count_hours:chart
                        };
                        
                        res.json(final);
                    }
                });
            }
        });
    }catch(err){
        res.json({error:true,text:err});
    }
});

module.exports = router;