import { Card, Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./styles/leftmessagestyle.css";


function LeftMessage (props) {

    const [file, setFile] = useState("");

    useEffect(async() => {
        if (props.path) {
            const result = await fetch("https://10.10.30.18:8444/file?"+new URLSearchParams({file: props.path}).toString(), {
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
            <object data={file}></object>
            :
            <p style={{color:"black"}}>{props.message}</p>
        }
        <Card sx={{backgroundColor: "primary.light", color:"black", width: "19ch" }}>{formattedTime}</Card>
        </Container>
    );

}

export default LeftMessage;