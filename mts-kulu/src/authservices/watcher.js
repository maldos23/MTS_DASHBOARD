import jwtDecode from 'jwt-decode';

//Sevicios de vigila de tokens
class authServices {
    getTokens(){
        //Obtengo los valores de token
        let walmextoken = sessionStorage.getItem("walmextoken");
        let kulutoken = sessionStorage.getItem("kulutoken");

        //Valido la existencia de los tokens
        if (typeof walmextoken === 'undefined'){
            this.removeTokens();
            return({
                error: true,
                text:"token walmex requerido"
            });
        }else if (typeof kulutoken === 'undefined'){
            this.removeTokens();
            return({
                error: true,
                text:"token kulu requerido"
            });
        }else {
            return({
                walmextoken: walmextoken,
                kulutoken: kulutoken
            });
        }
    }

    //Elimino tokens almacenados en el navegador
    removeTokens(){
        sessionStorage.removeItem("walmextoken");
        sessionStorage.removeItem("kulutoken");
        sessionStorage.removeItem("userData");
    }

    validateServices(){

    }

    decodeTokens(){
        const tokens = this.getTokens();
        if(typeof tokens !== 'object'){
            console.error("Error en validacion de datos");
            this.removeTokens();
        }else{
            if(typeof tokens.error === 'undefined'){
                console.warn(tokens.error);
            }else {
                return({
                    walmex: jwtDecode(tokens.walmextoken),
                    kulu: jwtDecode(tokens.kulutoken)
                });
            }
        }
    }

    //Creo una ruta capital de origen en API
    hostOrigin(){
        return `http://${window.location.hostname}:4000`
    }

    //Encabezados de validacion en rutas
    headersOffetch(){
        return({
            "Accept":"application/json",
            "Content-Type":"application/json"
        });
    }
    
}

export default authServices;