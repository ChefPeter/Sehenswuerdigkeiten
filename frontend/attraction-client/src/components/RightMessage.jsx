import { Card, Container } from "@mui/material";
import React, { useEffect, useState } from "react";

function RightMessage (props) {

    const [file, setFile] = useState({
        file: "",
        type: ""
    });
    useEffect(async() => {
        if (props.path) {
            const result = await fetch("https://10.10.30.18:8444/file?"+new URLSearchParams({file: props.path}).toString(), {
                method: "GET",
                credentials: "include"
            });
            if (result.status === 200) {
                const blob = await result.blob();
                setFile({
                    file: URL.createObjectURL(blob),
                    type: blob.type
                }); 
            }
        }
    }, []);

    const t = props.time.replace("T", " ").slice(0, 19);
    const formattedTime = t;

    return (

        <Container style={{width: "75%", marginLeft: "25%", wordWrap: 'break-word'}} sx={{
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
                file.type.includes("image") ? <img style={{maxWidth: "50%"}} src={file.file}></img> : <object data={file.file}></object>
                :
                <p style={{color:"black"}}>{props.message}</p>
        }
        
        <Card sx={{backgroundColor: "primary.dark", color:"black", width: "19ch", fontSize:"0.7em"}}>{formattedTime}</Card>
        </Container>

    );

}

export default RightMessage;