import React, { Fragment, useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Chip, IconButton, SwipeableDrawer, List, ListItem, ListItemAvatar, Avatar, Card, CardContent, CardHeader, Grid, TextField, MenuItem, Divider, ListItemText, LinearProgress, Fade } from '@material-ui/core';
import { Settings, Dashboard, SupervisedUserCircle } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyle = makeStyles(theme => ({
    '@global': {
        '*::-webkit-scrollbar': {
          width: '0.5em'
        },
        '*::-webkit-scrollbar-track': {
            backgroundColor: '#fff',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#485563',
          borderRadius:'5px',
          margin: '2px'
        }
    },
    charts:{
        display:'block',
        height:'calc( 50vh - 200px)'
    },
    barchart:{
        height:'calc( 50vh - 120px)'
    },
    appbar:{
        background:'linear-gradient(to right, #232526, #414345)'
    },
    sidebar:{
        width:'300px'
    },
    subtitle:{
        color:'#FFF',
        background:'linear-gradient(to right, #ee0979, #ff6a00)'
    },
    containerTitle:{
        margin:'5px'
    },
    chart:{
        height:'calc(100vh - 250px)',
        display:'block'
    },
    card:{
        borderRadius:0,
        boxShadow:'none',
        width:'250px'
    },
    content:{
        margin:"15px",
        fontSize:"25px",
        fontWeight:"lighter"
    },
    minicard:{
        margin:'5px',
        color:'#FFF',
        background:'linear-gradient(to top, #ee0979, #ff6a00)',
        boxShadow:'none',
    },
    minicard2:{
        color:'#FFF',
        background:'linear-gradient(to bottom, #8e2de2, #4a00e0)',
        boxShadow:'none',
        marginBottom:'10px'
    },
    titles:{
        color:'#FFF',
        background:'linear-gradient(to top, #ee0979, #ff6a00)',
        boxShadow:'none',
        borderRadius:'5px',
        margin:'10px'
    },
    cardcontainer:{
        height:'290px'
    },
    cardcontainer2:{
        overflowY:'visible',
        height:'calc( 100vh - 590px )'

    },
    containerLoading:{
        textAlign:'center',
        display:'block',
        margin:'5px',
        height:'calc(100vh - 85px)'
    },
    listavatar:{
        fontSize:'24px',
        background:'linear-gradient(to bottom, #00c6ff, #0072ff)', 
        height:50, 
        width:50
    },
    totalavatar:{
        background:"#FFF",
        fontSize:"20px",
        color:"#8e2de2"
    }
}));

const typeCDS = [
    {name:"Cuautitlan",value:"CUAU"},
    {name:"Santa Barbara",value:"STB"},
    {name:"San Martin Obispo",value:"SMO"},
    {name:"Chalco",value:"CH"},
    {name:"Culiacan",value:"CUL"},
    {name:"Monterrey",value:"MTY"},
    {name:"Guadalajara",value:"GDL"},
    {name:"Villahermosa",value:"VHSA"},
];

export default function ComponentDefault(props){

    const [hour, setHour] = useState("00:00"),classes = useStyle();
    const {cds, setCds, fetchData, data} = props,[draw,setDraw] = useState(false);

    function getTime(){
            setInterval(() => {
                var time = new Date().toLocaleString();
                setHour(time);
            }, 1000);
    }

    useEffect(() => {
        fetchData();
        getTime();
    },[]);

    return(
        <Fragment>
                <AppBar className={classes.appbar}>
                    <Toolbar>
                        <Dashboard/>
                        <Typography variant="h5">
                            <b>MTS</b> {cds}
                        </Typography>
                        <div style={{flexGrow:1}}/>
                        <div style={{borderRadius:'38px',background:'linear-gradient(to top, #00c9ff, #92fe9d)',color:'#445'}}>
                        <Typography style={{margin:'5px', fontWeight:'lighter'}} variant="h6">
                            {hour}
                        </Typography>
                        </div>
                        <div style={{flexGrow:1}}/>
                        <Chip
                        style={{
                            background:"linear-gradient(to top, #00c9ff, #92fe9d)", 
                            color:"#445", 
                            fontWeight:"lighter"
                        }}
                        label="EN LINEA"/>
                        <IconButton onClick={() => {
                            sessionStorage.removeItem("walmextoken");
                            sessionStorage.removeItem("kulutoken");
                            window.location.pathname = "/login";
                        }}>
                            <SupervisedUserCircle style={{color:"#FFF"}}/>
                        </IconButton>
                        <IconButton onClick={() => setDraw(true)}>
                            <Settings style={{color:"#FFF"}}/>
                        </IconButton>
                        
                    </Toolbar>
                </AppBar>
                <SwipeableDrawer
                anchor="right"
                open={draw} 
                className={classes.sidebar}
                onOpen={() => setDraw(true)} 
                onClose={() => setDraw(false)}>
                  <Card className={classes.card}>
                      <CardHeader
                        avatar={<Settings/>}
                        className={classes.subtitle}
                        title={  
                        <Typography variant="h5">
                            Ajustes
                        </Typography>
                        }
                      />
                      <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="caption">
                                    Selecciona la opcion requerida
                                </Typography>
                                <Divider/>
                                <br/>
                                <TextField
                                select
                                label="Cedis"
                                fullWidth
                                value={cds}
                                onChange={async(e) => {
                                    await setCds(e.target.value);
                                    await fetchData();
                                }}
                                variant="outlined">
                                    {
                                        typeCDS.map((option, index)=>{
                                            return(
                                            <MenuItem key={index} value={option.value}>
                                                {option.name}
                                            </MenuItem>
                                            )
                                        })
                                    }
                                </TextField>
                            </Grid>
                        </Grid>
                      </CardContent>
                  </Card>
                </SwipeableDrawer>
                <div style={{padding:'30px'}}/>
                {data.count_hours.length === 0 &&
                    <Fade in={data.count_hours.length > 0?false:true} timeout={{
                        enter:1000,
                        exit:1000
                    }}>
                        <Card className={classes.containerLoading}>
                            <CardContent>
                                <div style={{marginTop:'calc(50vh - 115px)'}}/>
                                <Typography variant="h4" color="primary">
                                    Cargando Datos
                                </Typography>
                                <LinearProgress variant="indeterminate" color="secondary" style={{height:'20px', borderRadius:'10px', background:"linear-gradient(to right, #8e2de2, #4a00e0)"}}/>
                            </CardContent>
                        </Card> 
                    </Fade>    
                }
                {data.count_hours.length > 0 &&
                    <Fade in={data.count_hours.length !== 0?true:false} timeout={{
                        enter:1000,
                        exit:1000
                    }}>
                        <ContentChart data={data} cds={cds}/>
                    </Fade>
                }
        </Fragment>
    )
}

function ContentChart(props){
    const classes = useStyle();
    const {data,cds} = props;
    return(
    <div>
        <Grid container spacing={2}>
        <Grid item xs={4}>
        <Card className={classes.minicard}>
        <Toolbar>
            <Typography variant="h5">
                Despachados
            </Typography>
            <div style={{flexGrow:1}}/>
            <Avatar className={classes.totalavatar}>
                {data.t_dispach}
            </Avatar>
        </Toolbar>
        <LinearProgress variant="determinate" style={{height:'10px'}} value={parseInt(data.t_dispach)/((parseInt(data.t_pendding)+parseInt(data.t_dispach))/100)}/>
        </Card>
        </Grid>
        <Grid item xs={4}>
        <Card className={classes.minicard}>
        <Toolbar>
            <Typography variant="h5">
                Pendientes
            </Typography>
            <div style={{flexGrow:1}}/>
            <Avatar className={classes.totalavatar}>
                {data.t_pendding}
            </Avatar>
        </Toolbar>
        <LinearProgress variant="determinate"  style={{height:'10px'}} value={parseInt(data.t_pendding)/((parseInt(data.t_pendding)+parseInt(data.t_dispach))/100)}/>
        </Card>
        </Grid>
        <Grid item xs={4}>
        <Card className={classes.minicard}>
        <Toolbar>
            <Typography variant="h5">
                Total
            </Typography>
            <div style={{flexGrow:1}}/>
            <Avatar className={classes.totalavatar}>
                {parseInt(data.t_pendding)+parseInt(data.t_dispach)}
            </Avatar>
        </Toolbar>
        <LinearProgress variant="determinate"  style={{height:'10px'}} value={100}/>
        </Card>
        </Grid>
        </Grid>  
        <CardContent>
        <Grid container spacing={2}>
            <Grid item xs={3}>
            <Card className={classes.cardcontainer}>
                <CardHeader
                titleTypographyProps={{
                    variant:"subtitle2",
                    style:{
                        color:'#888'
                    }
                }}
                title="Embarques con mayor atraso"/>
                <Divider/>
                <CardContent>
                <List>
                {
                    data.pending_travels.map((item, index) => {
                        return(
                            <ListItem key={index}>
                            <ListItemAvatar>
                                <Avatar className={classes.listavatar}>
                                    {index + 1}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={`ID Master: ${item["ID Embarque"]}`} secondary={`Horas: ${moment(item["Fecha Retiro"]).fromNow()}`}/>
                            </ListItem>           
                        )
                    })
                }
                </List>
                </CardContent>
            </Card>
            <Card style={{marginTop:'10px'}}>
                <CardHeader
                titleTypographyProps={{
                    variant:"subtitle2",
                    style:{
                        color:'#888'
                    }
                }}
                title="Aculmulado Formatos"/>
                <Divider/>
                <CardContent style={{display:'block', overflowY:'visible'}}>
                <div className={classes.cardcontainer2}>
                <List>
                {data.count_travels.map((item, index) => {
                    return(
                        <ListItem key={index}>
                            <ListItemAvatar>
                                <Avatar className={classes.listavatar}>
                                    {item.total}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText secondary={item.Referencia}/>
                        </ListItem>
                    )
                })}
                </List>
                </div>
                </CardContent>
                </Card>
            </Grid>
            <Grid item xs={5} lg={6}>
                <Card>
                <CardContent>
                <div className={classes.titles}>
                    <Typography className={classes.content}>
                        Flujo Despacho
                    </Typography>
                </div>
                <MiddleChart/>
                </CardContent>
                <CardContent>
                <div className={classes.titles}>
                    <Typography className={classes.content}>
                    Hace 1 Dia
                    </Typography>
                </div>
                <MiddleChart/>
                </CardContent>
                </Card>                       
            </Grid>
            <Grid item xs={4} lg={3}>
                <Card>
                <CardContent>
                {data.count_hours.length > 0&&
                    <ChartCard1 data={data}/>
                }
                
                    </CardContent>
                    </Card>
            </Grid>  
        </Grid>
        </CardContent>
    </div>
    )
}

function ChartCard1(props){
    const {data} = props, classes = useStyle();
    const options = (name) => new Object({
        labels:["> 12 Horas", "> 24 horas","> 48 horas","> 72 Horas","> 96 Horas"],
        plotOptions:{
            pie:{
                donut:{
                    labels:{
                        show:true,
                        total:{
                            show:true,
                            label:name
                        }
                    }
                }
            }
        },
        dataLabels: {
            enabled: true
        },
        responsive: [{
            breakpoint: 400,
            options: {
            chart: {
                width: 100
            },
            legend: {
                show: true
            }
            }
        }],
        legend: {
            show:true,
            position: 'right',
            offsetY: 0,
            height: 230,
        }
    });

    const labelandprimary = ["#0072ff","#24fe41","#b91d73","#f12711","#8e2de2"];
    const secondarycolor = ["#00c6ff","#fdfc47","#f953c6","#f5af19","#4a00e0"];
    return(
        <div>
        {data.count_hours.length > 0 &&
        <AutoPlaySwipeableViews interval={6000}>
        {
            data.count_hours.map((item,index) => {
            return(
            <div key={index} className={classes.chart}>
            <div style={{display:'block', margin:'10px'}}>
            <div className={classes.titles}>
                <Typography className={classes.content}>
                    Por Formato
                </Typography>
            </div>
            <ReactApexChart
            options={
                options(item.name)}
            type="donut"
            series={item.data}/>
            <div className={classes.titles}>
            <Typography className={classes.content}>
                Pendientes
            </Typography>
            </div>
            <div className={classes.barchart}>
            <ReactApexChart
            height="100%"
            type="bar"
            series={[{
                name:"Pendientes",
                data:item.data
            }]}
            options={{
                colors: labelandprimary,
                chart: {
                    toolbar: {
                      show: false
                    }
                },          
                plotOptions: {
                    bar: {
                        distributed: true,
                        dataLabels: {
                            position: 'top', // top, center, bottom
                        },
                    }
                },
                dataLabels: {
                    enabled: true,
                    offsetY: -35,
                    style: {
                        fontSize: '15px',
                        colors: labelandprimary
                    }
                },
                xaxis:{
                    categories:["> 12","> 24", "> 48","> 72", "> 96"],
                    labels:{
                        style:{
                            fontSize: '15px',
                            colors: labelandprimary
                        }
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        type: 'vertical',
                        shadeIntensity: 0.5,
                        gradientToColors: secondarycolor,
                        inverseColors: true,
                        stops: [0, 100],
                    }
                },
            }}/>
            </div>
            </div>
            </div>
            )
        })}
        </AutoPlaySwipeableViews>
        }

        </div>
    )
}


function MiddleChart(props){
    const classes = useStyle();
    const {data} = props;
    const lablesCategories = ["00:00", "01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00",
                            "13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00","24:00"];
    const option = {
        markers: {
            size: 6
        },
        stroke: {
            curve: 'smooth'
        },
        chart: {
            shadow: {
              enabled: true,
              color: '#000',
              top: 18,
              left: 7,
              blur: 10,
              opacity: 1
            },
            toolbar:{
                show:false
            }
        },
        colors:["#00c6ff"],
        plotOptions: {
          bar: {
            dataLabels: {
              position: 'top', // top, center, bottom
            },
          }
        },
        dataLabels: {
          enabled: true,
          offsetY: -35,
          style: {
            fontSize: '15px',
            colors: ["#304758"]
          }
        },
        xaxis: {
          categories: lablesCategories,
          tooltip: {
            enabled: false,
          }
        },
        fill: {
            type:"gradient",
            gradient: {
                type: "horizontal",
                gradientToColors: ["#0072ff"],
                stops: [ 0, 100]
            },
        },
        yaxis: {
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
          }
        }
      }
    return(
        <div className={classes.charts}>
            <ReactApexChart type="line" height="100%" options={option} series={[{
            name: 'Inflation',
            data: [2.3, 3.1, 4.0, 6.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
          }]}/>
        </div>
    )
}