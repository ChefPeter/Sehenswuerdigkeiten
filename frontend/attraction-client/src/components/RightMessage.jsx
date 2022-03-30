import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, Card, Container, TextField, Typography, LinearProgress, Box } from "@mui/material";
import "./styles/rightmessagestyle.css"
import { useEffect, useState } from 'react';

function RightMessage (props) {

    const [file, setFile] = useState("");

    useEffect(async() => {
        if (props.path) {
            console.log("BLALBALBLAB");
            const result = await fetch("http://localhost:5000/file?"+new URLSearchParams({file: props.path}).toString(), {
                method: "GET",
                credentials: "include"
            });
            if (result.status === 200) {
                const blob = await result.blob();
                setFile(URL.createObjectURL(blob));
            }
        }
    }, []);

    const t = props.time.replace("T", " ").slice(0, 19);
    const formattedTime = t;

    return (

        <Container  sx={{
            marginLeft: 32, 
            backgroundColor: 'primary.light',
            borderBottomRightRadius: 25,
            borderTopRightRadius: 5,
            borderBottomLeftRadius: 17,
            borderTopLeftRadius: 17,
            marginBottom: 1,
            paddingLeft: 1,
            paddingRight: 1,
            paddingBottom: 1.5,
            paddingTop: 1.5,
            
            
           }}>
        {
            props.path ? 
                <object data={file}></object>
                :
                <p>{props.message}</p>
        }
        
        <Card sx={{backgroundColor: "primary.dark", width: "19ch"}}>{formattedTime}</Card>
        </Container>

    );

}

export default RightMessage;