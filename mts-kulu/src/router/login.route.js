import React from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import Login from '../views/home';
import Dashboard from '../views/dashoard';
import { SnackbarProvider } from 'notistack';

function Main(){
    const PrivateComponent = ({component:Component, ...rest}) => (
        <Route
        {...rest}
        render={(props) => (
            verify() === true?
            <Component {...props}/>:
            <Redirect
            to="/login"/>
        )}
        />
    );
    
    function verify(){
        
        if(sessionStorage.getItem("walmextoken") === null || sessionStorage.getItem("kulutoken") === null){
            sessionStorage.removeItem("walmextoken");
            sessionStorage.removeItem("kulutoken");
            return false
        }else {
            return true
        }
    }

    return(
        <BrowserRouter>
            <Route
            path="/login"
            component={Login}
            exact/>
            <PrivateComponent
            path="/"
            component={Dashboard}
            exact/>
        </BrowserRouter>
    )
}

export default function AuthComponent(){
    return(
        <SnackbarProvider>
            <Main/>
        </SnackbarProvider>
    )
}