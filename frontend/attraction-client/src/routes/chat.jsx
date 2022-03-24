import React from "react";
import Header from "../components/header";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, Card, Container, TextField, Typography, LinearProgress, Box } from "@mui/material";
import "./styles/chat.css"
import LeftMessage from "../components/LeftMessage";
import RightMessage from "../components/RightMessage"
import ChatSendbar from "../components/ChatSendbar"

let searchFriendInput = "";
// Define theme settings
const light = {
  palette: {
    mode: "light",
  },
};

const dark = {
  palette: {
    mode : "dark",

    // Add your custom colors if any
  },
};


function Chat () {


    return (
        <ThemeProvider theme={createTheme(light)}>
            <Header />
                
                <Card elevation={4}>
                    <LeftMessage message ="Hallo" time="13:00"></LeftMessage>
                    <RightMessage message ="Tschüss" time="13:01"></RightMessage>
                    <LeftMessage></LeftMessage>
                    <RightMessage></RightMessage>

                    <LeftMessage></LeftMessage>
                    <LeftMessage></LeftMessage>
                    <RightMessage></RightMessage>
                    <LeftMessage></LeftMessage>
                    <LeftMessage></LeftMessage>
                    <RightMessage></RightMessage>
                    <LeftMessage></LeftMessage>
                    <LeftMessage></LeftMessage>
                    <RightMessage></RightMessage>
                    <LeftMessage></LeftMessage>
                    <LeftMessage></LeftMessage>
                    <RightMessage></RightMessage>
                    <LeftMessage></LeftMessage>
                    <LeftMessage></LeftMessage>
                    <RightMessage></RightMessage>
                    <LeftMessage></LeftMessage>
                    <LeftMessage></LeftMessage>
                    <RightMessage></RightMessage>
                    <LeftMessage></LeftMessage>
                    <LeftMessage></LeftMessage>
                    <RightMessage></RightMessage>

                    
                </Card>
                <ChatSendbar></ChatSendbar>
        </ThemeProvider>
    );

}

export default Chat;