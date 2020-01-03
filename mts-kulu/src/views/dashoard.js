import React, { Component } from 'react';
import Dashboard from '../sidebar/index';
import requirements from '../services/api';
const socket_connection = new requirements;

export default class ComponentDefault extends Component{
    constructor(props){
        super(props);
        this.state = {
            cds:"CUAU",
            data:{count_travels:[],pending_travels:[],count_hours:[]},
            timer:0
        }
    }

    fetchData = async() => {
        await clearInterval(this.state.timer);
        
        const callData = await socket_connection.dashboard(this.state.cds);
        await this.setState({
            data:{
                count_travels:[],
                pending_travels:[],
                count_hours:[]
            }
        });
        await setTimeout(async() => {
            await this.setState(prevState =>({
                data:{
                    ...prevState.data,
                    ...callData
                    }
                })
            );
        },2000);
        await this.getData();
    }

    getData = () => {
        let intern = setInterval(()=> {
            this.fetchData(this.state.cds); 
        },100000);
        this.setState({timer: intern});
    }


    render(){
        var method = {
            cds:this.state.cds,
            setCds:(value) => this.setState({cds:value}),
            fetchData: () => this.fetchData(),
            data:this.state.data
        };

        return(
            <div>
                <Dashboard {...method}/>
            </div>
        )
    }
}