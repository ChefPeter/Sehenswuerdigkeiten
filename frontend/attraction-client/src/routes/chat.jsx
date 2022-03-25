import React from "react";
import Header from "../components/header";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, Card, Container, TextField, Typography, LinearProgress, Box } from "@mui/material";
import "./styles/chat.css"
import LeftMessage from "../components/LeftMessage";
import RightMessage from "../components/RightMessage"
import ChatSendbar from "../components/ChatSendbar"
import {useState , setState, useEffect} from "react";

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


  const [messages, setMessages] = useState([]);

    const friend = "loberhauser3";
    
    useEffect(async() => {
      const respone = await fetch("http://localhost:5000/conversation?"+new URLSearchParams({friend: friend}).toString(), {
        method: "GET",
        credentials: "include"
      });
      const json = await respone.json();
    });
    
    

    
    
    console.log("-------------------------------------------------");

    return (
        <ThemeProvider theme={createTheme(light)}>
            <Header />
                
                <Card elevation={4} sx={{
                    marginTop: 1.5, 
                    marginLeft: 1, 
                    marginRight: 1, 
                    paddingTop: 1,
                    paddingBottom: 1,
                    paddingRight: 1,
                    paddingLeft: 1}}>
 
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

                  <Card elevation={4} sx={{
                    marginBottom: 2,
                    marginTop: 1, 
                    marginLeft: 1, 
                    marginRight: 1, 
                    paddingTop: 2,
                    paddingBottom: 2,
                    paddingRight: 1,
                    paddingLeft: 1}}>
                <ChatSendbar></ChatSendbar>
                </Card>
        </ThemeProvider>
    );

}

export default Chat;