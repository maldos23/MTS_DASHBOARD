import React, { Fragment, useState, useEffect } from 'react';
import {makeStyles ,Card, CardContent, Typography, TextField, Button, CardHeader, LinearProgress} from '@material-ui/core';
import { useSnackbar } from 'notistack';
// ------- Creo hook principal --------

const useStyle = makeStyles(theme => ({
    root:{
        background:'linear-gradient(to right, #232526, #414345)',
        position:'fixed',
        left:0,
        top:0,
        width:'calc(100vw)',
        height:'calc(100vh)'
    },
    margin:{
        margin:theme.spacing(1)
    },
    custombutton:{
        background:'linear-gradient(to right, #ee0979, #ff6a00)',
    },
    title:{
        background: 'linear-gradient(to right, #ee0979, #ff6a00)',
        textAlign:'center'
    },
    card:{
        textAlign:'center',
        width:'400px',
        position:'fixed',
        top:'50%',
        left:'50%',
        transform:'translate(-50%, -50%)',
        zIndex:1000,
    }
}));

//Funcion principal con componente de formulario
export default function Index(props){
    const [values, setValues] = useState(null); //Valores especificos de form
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyle();
    //Capturo los valores como estado del formulario
    function handleChanges(e){
        const {name,value} = e.currentTarget;
        setValues(prevState => ({
            ...prevState,
            [name]:value
        }));
    }
    //Envio datos de formulario
    function sendData(){
        if(typeof values === 'object'){
        setLoading(true);
        //Envio datos a api Walmart
        fetch(`http://${window.location.hostname}:4000/api/services/login`, {
            method:'POST',
            body: JSON.stringify(values),
            headers:{
                "Content-Type":"application/json",
                "Accept":"application/json"
            }
            })
            .then(res => res.json())
            .then((data) => {
                if(typeof data === 'object'){
                    if(typeof data.error !== 'undefined'){
                        enqueueSnackbar(data.text,{
                            variant:"error"
                        });
                    }else {
                        sessionStorage.setItem('walmextoken',data.walmextoken);
                        sessionStorage.setItem('kulutoken',data.kulutoken);
                        sessionStorage.setItem('userData',JSON.stringify(data.detailluser));
                        window.location.pathname = "/";
                    }
                }else {
                    enqueueSnackbar("Error en inicio de sesion",{
                        variant:"error"
                    });
                }
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                enqueueSnackbar("Error en inicio de sesion",{
                    variant:"error"
                });
            });
            
        }else {
            alert("Error en datos de envio");
        }

    }

    function verify(){
        if(sessionStorage.getItem("walmextoken") !== null && sessionStorage.getItem("kulutoken") !== null){
            window.location.pathname = "/";
        }
    }

    useEffect(()=> {
        verify();
    },[]);

    return(
        <Fragment>
            <div className={classes.root}>
            <Card className={classes.card}>
                <CardHeader
                className={classes.title}
                title={
                <div>
                <Typography
                    variant="h5"
                    style={{color:"#FFF"}} 
                    className={classes.margin}>
                        <b>MTS</b>KULU
                </Typography>
                <Typography 
                style={{
                    position:'absolute',
                    top:'50px',
                    textAlign:'center',
                    color:'#FFF',
                    fontSize:"11px"
                }}
                variant="caption">
                    by Gino Missael
                </Typography>
                </div>
                }/>
                {loading === true &&
                    <LinearProgress variant="indeterminate"/>
                }
                <CardContent>
                    <Typography 
                    style={{
                        textAlign:'center',
                        fontWeight:'bold',
                        color:'#444'
                    }}
                    variant="body1">
                        Bienvenido al centro de reportes
                    </Typography>
                    <form onSubmit={(e) => {
                        sendData();
                        e.preventDefault();
                    }}>
                        <div className={classes.margin}>
                        <TextField
                        autoFocus
                        required
                        name="user"
                        fullWidth
                        variant="outlined"
                        label="Usuario"
                        onChange={handleChanges}/>
                        </div>
                        <div className={classes.margin}>
                        <TextField
                        required
                        type="password"
                        name="pass"
                        fullWidth
                        variant="outlined"
                        label="Contraseña"
                        onChange={handleChanges}
                        helperText="Para poder ingresar favor de utilizar el usuario de windows"/>
                        </div>
                        <br/>
                        <Button
                        disabled={loading}
                        type="submit"
                        className={classes.custombutton} 
                        color="primary"
                        variant="contained">
                            Ingresar
                        </Button>
                    </form>
                </CardContent>
            </Card>
            </div>
        </Fragment>
    )
}