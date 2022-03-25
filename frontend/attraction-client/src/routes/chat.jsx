import React from "react";
import Header from "../components/header";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, Card, Container, TextField, Typography, LinearProgress, Box } from "@mui/material";
import "./styles/chat.css"
import LeftMessage from "../components/LeftMessage";
import RightMessage from "../components/RightMessage"
import ChatSendbar from "../components/ChatSendbar"
import { useSearchParams } from "react-router-dom";
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



function Chat (props) {
  
  const [searchParams, setSearchParams] = useSearchParams();
  const name = searchParams.get("name");

    const [messages, setMessages] = useState([]);

    const friend = name;
    
    useEffect(async() => {
      const respone = await fetch("http://localhost:5000/conversation?"+new URLSearchParams({friend: friend}).toString(), {
        method: "GET",
        credentials: "include"
      });
      const json = await respone.json();
      setMessages(json);
    });

    fetch("http://localhost:5000/conversation?"+new URLSearchParams({friend: friend}).toString(), {
      method: "GET",
      credentials: "include"
    })
    .then(res => res.json())
    .then(res => {
      console.log("ANFRAGE WIRD GESCHICKT!");
      setMessages(res)
    });


    return (
        <ThemeProvider theme={createTheme(light)}>
            <Header />
            <p> prop {name}</p>
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
                    
                    {messages.map(message => {
                      if (message.sender === friend) {
                        <LeftMessage message={message.content} time={message["message_timestamp"]}></LeftMessage>
                      } else {
                        <RightMessage message={message.content} time={message["message_timestamp"]}></RightMessage>
                      }
                    })}

                    
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