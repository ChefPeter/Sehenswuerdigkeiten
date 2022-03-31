import "../routes/styles/contact.css";
import Sidebar from "../components/Sidebar";
import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, Container, TextField, Typography, LinearProgress, Box, Card } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import GroupItem from "../components/GroupItem";
import List from '@mui/material/List';
import { useState } from 'react';
import { useEffect } from 'react';

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
    });
  }

  const [groups, setGroups] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/groups", {
      method: "GET",
      credentials: "include"
    }).then(res => res.json())
    .then(res => setGroups(res));
  }, []);

  return (
    
    <ThemeProvider theme={createTheme(props.t1 === "dark" ? dark : light)}>
      <Card style={{minHeight: "100vh", borderRadius:"0px"}} >

      <Sidebar t1={props.t1} t2={props.t2} l1={props.l1} l2={props.l2}/>
      <Card  style={{marginTop: "calc(16.5px + 3.2em)"}}>
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

      <div id="freunde">
      
        <List>

          {groups.map((e,i) =>  <GroupItem name={e.groupname} groupID={e.group_id} key={"group_"+i} profilePicture={null}></GroupItem>)}
         
        </List>
        
      </div>
      </Card>
    </ThemeProvider>

  );
  
}
export default Groups;