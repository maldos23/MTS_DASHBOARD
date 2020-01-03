
class mts_query {

    getnumbertravels(origin){
        if(typeof origin === 'string' && typeof origin !== 'undefined'){
            let querystring = `SELECT TOP 10 Referencia,total=count(Referencia)
            FROM [odbc].[REP_Embarques_Proceso]
            WHERE "ID Cedis"='${origin}'
            Group by Referencia
            Order by total desc;`;
            return querystring; 
        }else {
            throw "Error en tipo de datos 'origin'"
        }
    }

    getawaittravelsstatus(origin){
        if(typeof origin === 'string' && typeof origin !== 'undefined'){
            let querystring = `SELECT distinct Prev."ID Embarque" , Prev."Fecha Retiro"
            FROM (SELECT TOP 10 "ID Embarque","Fecha Retiro","ID Cedis" 
                    FROM [odbc].[REP_Embarques_Proceso]
                    WHERE  "Fecha Retiro" IS NOT NULL AND "ID Cedis"='${origin}'
                    order by "Fecha Retiro" desc) as Prev;`
            return querystring
        }else {
            throw "Error en tipo de datos 'origin'"
        }
    }

    gettotalfinishtravels(origin){
        if(typeof origin === 'string' && typeof origin !== 'undefined'){
            let querystring = `SELECT total=Count("ID Master")
            From [odbc].[REP_Embarques_Proceso]
            where "ID Cedis"='${origin}';
            
            SELECT total=Count("ID Master")
            From [odbc].[REP_Viajes_Despachados]
            where "ID Cedis Viaje"='${origin}' AND cast("Fecha Retiro" as date) = cast(getdate() as date);`
            return querystring
        }else {
            throw "Error en tipo de datos 'origin'"
        }
    }

    getcounthours(origin){
        if(typeof origin === 'string' && typeof origin !== 'undefined'){
            let querystring = `select formato=oncegroup.Referencia,oncegroup.clase,total=Count(oncegroup.clase)
            from(select * ,
                Case
                    when timeline.Horas < 12 and timeline.Horas >= 0 then 12
                    when timeline.Horas < 24 and timeline.Horas >= 12 then 24
                    when timeline.Horas < 48 and timeline.Horas >= 24 then 48
                    when timeline.Horas < 72 and timeline.Horas >= 48 then 72
                    else 96
                END as clase
                From(
                    SELECT Referencia,"ID Cedis",Horas = Convert(int,((3600000*Convert(numeric,GETDATE())) - (3600000*Convert(numeric,"Fecha Cierre Embarque")))/3600000)
                    From [odbc].[REP_Embarques_Proceso]
                    where "Fecha Cierre Embarque" IS NOT NULL and "ID Cedis"='${origin}'
                    ) as timeline
            ) as oncegroup
            group by oncegroup.Referencia,oncegroup.clase;`
            return querystring
        }else {
            throw "Error en tipo de datos 'origin'"
        }
    }
}
module.exports = mts_query;