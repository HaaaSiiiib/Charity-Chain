import Head from 'next/head'
import styles from '../styles/Home.module.css'

import React from 'react';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
    root:{
        textAlign: 'center',
        background: 'linear-gradient(to bottom, #008ecc 75%, white 25%)',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        overflowY: 'auto',
        overflowX: 'hidden',
        fontFamily: 'arial',
    },
    mainButton:{
        margin: '150px calc((100vw - 375px) / 2) 40px',
        height: '190px',
        width: '375px',
        backgroundColor: 'black',
        color: 'white',
        fontSize: '33px',
        transition: 'transform 0.4s',
        boxShadow: '10px 10px 30px #3e3e3e',
        borderRadius: '5px',
        [theme.breakpoints.down('sm')]: {
            margin: '120px calc((100vw - 280px) / 2) 40px',
            height: '150px',
            width: '280px',
            fontSize: '25px',
        },
        [theme.breakpoints.down('750')]: {
            margin: '100px calc((100vw - 280px) / 2) 20px',
        },
        [theme.breakpoints.up('750')]: {
            '&:hover': {
                transform: 'scale(1.1)',
                backgroundColor: 'black',
                boxShadow: '15px 15px 30px #3e3e3e',
            }
        },
        '&:hover': {
            backgroundColor: 'black',
        }
    },
    divGroup: {
        backgroundColor: 'white',
        height: '240px',
        width: '375px',
        boxShadow: '10px 10px 30px #3e3e3e',
        borderRadius: '5px 5px 25px 25px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.4s',
        margin: '40px 40px',
        [theme.breakpoints.down('sm')]: {
            height: '160px',
            width: '280px',
        },
        [theme.breakpoints.down('750')]: {
            margin: '20px calc((100vw - 280px) / 2)',
        },
        [theme.breakpoints.up('750')]: {
            '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '15px 15px 30px #3e3e3e',
            }
        }
    },
    title: {
        fontSize: '23px',
        padding: '12px 0',
        color: 'white',
        backgroundColor: 'black',
        [theme.breakpoints.down('sm')]: {
            fontSize: '20px',
            padding: '6px 0',
        },
    },
    image: {
        padding: '15px 0',
        height: '160px',
        width: '160px',
        [theme.breakpoints.down('sm')]: {
            height: '110px',
            width: '110px',
            padding: '7px 0',
        },
    },
}))

export default function Home(props){
    const classes = useStyles();
    const history = useHistory();

    const routeChange = (path) => (event) => {
        event.preventDefault();
        history.push(path);
    }

    return(
        <div className={classes.root} >
            <Navbar auth={props.auth} userID={props.userID} handleAuth={props.handleAuth} handleUserID={props.handleUserID}
            handleUserAddress={props.handleUserAddress} />
            <Button variant='contained' className={classes.mainButton} onClick={routeChange('/track')} >Track Delivery</Button>
            <div style={{marginBottom: '100px'}} >
                <Grid container justify='center' alignItems='center' >
                    <Grid item >
                        <div className={classes.divGroup} onClick={routeChange('/sectors')} >
                            <div className={classes.title} >SECTORS</div>
                            <div>
                                <img src={send} alt='SECTORS' className={classes.image} />
                            </div>
                        </div>
                    </Grid>
                    {!props.auth &&
                        <Grid item >
                            <div className={classes.divGroup} onClick={routeChange('/help')} >
                                <div className={classes.title} >HELP</div>
                                <div>
                                    <img src={merchant} alt='HELP' className={classes.image} />
                                </div>
                            </div>
                        </Grid>
                    }
                    <Grid item >
                        <div className={classes.divGroup} >
                            <div className={classes.title} >REGISTER</div>
                            <div>
                                <img src={REGISTER} alt='REGISTER' className={classes.image} />
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}
