import React from "react";
import Header from "../components/header";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, Card, Container, TextField, Typography, LinearProgress, Box } from "@mui/material";
import "./styles/leftmessagestyle.css";
import { useEffect } from 'react';


function LeftMessage (props) {

    useEffect(async() => {
        if (props.path) {
            const result = await fetch("http://localhost:5000/file?"+new URLSearchParams({file: props.path}).toString(), {
                method: "GET",
                credentials: "include"
            });
            const blob = await result.blob();
            console.log("BLOOB");
            console.log(blob);
        }
    }, []);

    return (
        <Container  sx={{
            marginRight: 32, 
            backgroundColor: 'primary.dark',
            borderBottomRightRadius: 17,
            borderTopRightRadius: 17,
            borderBottomLeftRadius: 25,
            borderTopLeftRadius: 5,
            marginBottom: 1,
            paddingLeft: 1.5,
            paddingRight: 1,
            paddingBottom: 1.5,
            paddingTop: 1.5,

           }}>
        { props.path ? 
        <object>DIOCAEN</object>
        :
        <p id="messageLeft">{props.message}</p>
        }
        <Card sx={{backgroundColor: "primary.light", width: "3em"}}>{props.time}</Card>
        </Container>
    );

}

export default LeftMessage;