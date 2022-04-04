import AddIcon from '@mui/icons-material/Add';
import { Button, Card, TextField } from "@mui/material";
import List from '@mui/material/List';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import GroupItem from "../components/GroupItem";
import Sidebar from "../components/Sidebar";
import "../routes/styles/contact.css";

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
  const [textfieldTextTag, setTextfieldTextTag] = useState("Create Group");

  useEffect(() => {
      if(props.l1 == "de") {
        setTextfieldTextTag("Gruppe erstellen");
      } else if(props.l1 == "it") {
          setTextfieldTextTag("Crea gruppo");
      } else {
        setTextfieldTextTag("Create Group");
      }

  }, [props.l1])

  const handleCreateGroupInput = (event)=>{
    console.log(event.target.value)
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
    
      <TextField
        style={{width: "40vw", minWidth:"250px", marginLeft:"0.625em", marginTop:"4.5em"}}
        id="createGroupField"
        type="text"
        label={textfieldTextTag}
        variant="filled"
        onChange={handleCreateGroupInput}
        InputProps={{endAdornment:<Button onClick={createGroup}><AddIcon></AddIcon></Button>}}
      />
 

      <div id="freunde">
      
        <List>

          {groups.map((e,i) =>  <GroupItem name={e.groupname} groupID={e.group_id} key={"group_"+i} profilePicture={e.profilePicture}></GroupItem>)}
         
        </List>
        
      </div>
      </Card>
    </ThemeProvider>

  );
  
}
export default Groups;