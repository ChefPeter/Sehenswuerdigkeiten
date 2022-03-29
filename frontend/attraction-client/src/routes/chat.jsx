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

/*class Chat extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { friend: "loberhauser3", messages: [] };
    //this.updateChat = this.updateChat.bind(this);
    this.updateChat();
    //const [searchParams, setSearchParams] = useSearchParams();
    //const name = searchParams.get("name");
    //console.log();
    //console.log(new URLSearchParams(this.props.location.search).get("name"));
    
    const [messages, setMessages] = useState([]);

    this.friend = "loberhauser3";
    this.messages = [];
    fetch("http://localhost:5000/conversation?"+new URLSearchParams({friend: friend}).toString(), {
      method: "GET",
      credentials: "include"
    })
    .then(res => res.json())
    .then(res => {
      console.log("ANFRAGE WIRD GESCHICKT!");
      setMessages(res)
      //setTimeout(() => setMessages(res), 3000);
    });


  }

  updateChat() {
    this.setState({friend: "Peter"}, () => console.log(this.state));
  }

  render() {
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
                    paddingLeft: 1}}> You are writing with: <strong>{this.state.friend}</strong></Card>
          
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
                    
                    {this.state.messages.map(message => {
                      if (message.sender === this.friend) {
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


}*/
let counter = 0;

const Chat = (props) => {
  
    const [searchParams, setSearchParams] = useSearchParams();
    const name = searchParams.get("name");

    const [messages, setMessages] = useState([]);
    const friend = name;

    function func () {
      setInterval( () => fetch("http://localhost:5000/conversation?"+new URLSearchParams({friend: friend}).toString(), {
        method: "GET",
        credentials: "include"
      })
      .then(res => res.json())
      .then(res => {
        setMessages(res);
      }), 3000);
    }

    useEffect(func, []);

    
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
                    paddingLeft: 1}}> You are writing with: <strong>{name}</strong></Card>
          
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
                
                    {messages.map((message, i) => {
                      if (message.is_file) {
                        if (message.sender === friend) {
                          return <LeftMessage key={"message_"+i} path={message.content}></LeftMessage>
                        } else {
                          return <RightMessage key={"message_"+i} path={message.content}></RightMessage>
                        }
                      } else {
                        if (message.sender === friend) {
                          return <LeftMessage key={"message_"+i} message={message.content} time={message["message_timestamp"]}></LeftMessage>
                        } else {
                          return <RightMessage key={"message_"+i} message={message.content} time={message["message_timestamp"]}></RightMessage>
                        }
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
                <ChatSendbar name={friend}></ChatSendbar>
                </Card>
        </ThemeProvider>
    );

}

export default Chat;