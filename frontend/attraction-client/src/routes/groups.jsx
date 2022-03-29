import { useSelector } from 'react-redux';
import "../routes/styles/contact.css";
import Header from "../components/header";
import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, Container, TextField, Typography, LinearProgress, Box, Card } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import GroupItem from "../components/FriendItem";
import List from '@mui/material/List';

// Define theme settings
const light = {
  palette: {
    mode: "light",
  },
};

const dark = {
  palette: {
    mode: "dark",
  },
};

function Groups(props) {

  let createGroupInput = "";

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

  const handleCreateGroupInput = (event)=>{
    createGroupInput = event.target.value;
  };

  const createGroup = (event) => {

    let formData = new FormData();
    formData.append("groupname", createGroupInput);

    fetch("http://localhost:5000/create-group", {
      method: "POST",
      credentials: "include",
      body: formData
    })
  }

  const friendsName = ["daniel", "peter", "olli"];

  return (
    <div>
      <ThemeProvider theme={createTheme(theme === "dark" ? dark : light)}>
      <Header/>
      <Card>
        <TextField
          id="createGroupField"
          type="text"
          label="Create Group"
          variant="filled"
          onChange={handleCreateGroupInput}
        >
        </TextField>
        <Button onClick={createGroup}><AddIcon></AddIcon></Button>
      </Card>

      <div id="freunde" >
      
        <List>

          {friendsName.map((e,i) =>  <GroupItem name={e.name} description={e.description} key={"group_"+i} profilePicture={null}></GroupItem>)}
         
        </List>
        
      </div>

      </ThemeProvider>
    </div>
  );
  
}
export default Groups;