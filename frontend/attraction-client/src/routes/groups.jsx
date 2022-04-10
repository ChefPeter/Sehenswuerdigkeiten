import AddIcon from '@mui/icons-material/Add';
import { Button, Card, TextField, LinearProgress } from "@mui/material";
import List from '@mui/material/List';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import GroupItem from "../components/GroupItem";
import Sidebar from "../components/Sidebar";
import "../routes/styles/friends.css";
import { checkCurrentlyLoggedIn } from "../functions/checkLoggedIn";
import SuccessSnackbar from '../components/SuccessSnackbar';

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

  //let createGroupInput = "";
  const [titleText, setTitleText] = useState("Title");
  const [textfieldTextTag, setTextfieldTextTag] = useState("Create Group");
  const [createGroupInput, setCreateGroupInput] = useState("");
  const [openSuccesSnack, setOpenSuccesSnack] = useState(false);
  const [successSnackMessage, setSuccessSnackMessage] = useState("");

  const [showLoadingBar, setShowLoadingBar] = useState(true);

  useEffect(() => {
    if(props.l1 == "de") {
      setTitleText("Gruppen");
      setTextfieldTextTag("Gruppe erstellen");
    } else if(props.l1 == "it") {
      setTitleText("Gruppi");
      setTextfieldTextTag("Crea gruppo");
    } else {
      setTitleText("Groups");
      setTextfieldTextTag("Create Group");
    }

  }, [props.l1])

  const handleCreateGroupInput = (event)=>{
    setCreateGroupInput(event.target.value);
  };

  const createGroup = (event) => {

    let formData = new FormData();
    formData.append("groupname", createGroupInput);

    fetch("https://10.10.30.18:8443/create-group", {
      method: "POST",
      credentials: "include",
      body: formData
    }).then(_ => {
      setOpenSuccesSnack(true);
      if (props.l1 == "de") {
        setSuccessSnackMessage("Gruppe erstellt");
      } else if (props.l1 == "it") {
        setSuccessSnackMessage("Gruppo creato");
      } else {
        setSuccessSnackMessage("Group created");
      }
      setCreateGroupInput("");
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    });
  }

  const [groups, setGroups] = useState([]);
  const[loggedIn, setLoggedIn] = useState(false);
    
  useEffect(() => {

    setLoggedIn(checkCurrentlyLoggedIn());

    fetch("https://10.10.30.18:8443/groups", {
      method: "GET",
      credentials: "include"
    }).then(res => res.json())
    .then(res => setGroups(res));

    setShowLoadingBar(false);

  }, []);

  
  return (
    
    <ThemeProvider theme={createTheme(props.t1 === "dark" ? dark : light)}>
       {loggedIn ?
         showLoadingBar ? 
          <LinearProgress color="inherit"/>
        : 
          <Card style={{minHeight: "100vh", borderRadius:"0px"}} >

          <Sidebar t1={props.t1} t2={props.t2} l1={props.l1} l2={props.l2}/>
          <h2 style={{ marginLeft: "2.625em", display: "flex", alignItems: 'center', height: "3.25em" }}>{titleText}</h2>


          <div id="alignSearchBar">
            <TextField
              style={{ marginLeft: "0.625em"}}
              id="searchBarFriends"
              type="text"
              label={textfieldTextTag}
              variant="filled"
              value={createGroupInput}
              inputProps={{ maxLength: 99 }}
              onChange={handleCreateGroupInput}
              InputProps={{endAdornment:<Button onClick={createGroup}><AddIcon></AddIcon></Button>}}
            />
          </div>
    

          <div id="freunde">
          
            <List>

              {groups.map((e,i) =>  <GroupItem name={e.groupname} groupID={e.group_id} key={"group_"+i} profilePicture={e.profilePicture}></GroupItem>)}
            
            </List>
            
          </div>
          <SuccessSnackbar openSuccessSnack={openSuccesSnack} successMessage={successSnackMessage}></SuccessSnackbar>
          </Card>
          
      : null}
    </ThemeProvider>

  );
  
}
export default Groups;