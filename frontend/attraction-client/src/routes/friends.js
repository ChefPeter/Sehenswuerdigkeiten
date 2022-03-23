import Header from "../components/header";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSelector } from 'react-redux';
import React from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import "../routes/friends.css";
import { Accordion, Button, Container, Divider, TextField, Typography } from "@mui/material";
import FriendItem from "../components/FriendItem";
import SearchFriend from "../components/SearchFriend";


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

function Friends(props) {
  const theme = useSelector(state => {
    try{
      return state.theme;
    }catch(e){
      return "dark";
    }
  });
  const language = useSelector(state => {
    try{
      return state.language;
    }catch(e){
      return "de";
    }
  });

  const handleSearchFriendInput = (event)=>{
    searchFriendInput = event.target.value;
  };

    return (
      <ThemeProvider theme={createTheme(theme === "dark" ? dark : light)}>
      <Header/>
      <div>
        <TextField id="filled-basic" label= {<SearchFriend/>} variant="filled" onChange={handleSearchFriendInput} />
        <Button variant="contained" onClick={() => handleAddFriend()}>ADD</Button>
      </div>
      
      <div id="freunde">
        
        <List>
          <FriendItem name="Sara" description="Ich heiße Sara und bin 10 Jahre alt." ></FriendItem>
          <FriendItem name="Erich" description="Hallo ich bin Erich und bin 20 Jahre alt." ></FriendItem>
        </List>
        
      </div>
    </ThemeProvider>
    );
  
}

function handleAddFriend(){

  console.log(searchFriendInput);

}


export default Friends;