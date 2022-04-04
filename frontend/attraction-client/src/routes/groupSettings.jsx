import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Button, Card, LinearProgress, TextField, Typography } from "@mui/material";
import List from '@mui/material/List';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import ErrorSnackbar from "../components/ErrorSnackbar";
import FriendItem from "../components/FriendItem";
import IncomingRequest from "../components/IncomingRequest";
import SideBar from "../components/Sidebar";
import SuccessSnackbar from "../components/SuccessSnackbar";
import "./styles/friends.css";

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


const GroupSettings = (props) => {

   //Language Tags
   const [searchTextTag, setSearchTextTag] = useState("Search a friend")

  useEffect(() => {
    if(props.l1 == "de") {
      setSearchTextTag("Suche ein Mitglied");
    } else if(props.l1 == "it") {
      setSearchTextTag("Cerca un membro")
    } else {
      setSearchTextTag("Search a member");
   }
  }, [props.l1]);

  const handleSearchFriendInput = (event)=>{
    searchFriendInput = event.target.value;
  };

    return (
      <ThemeProvider theme={createTheme(props.t1 === "dark" ? dark : light)}>
        <Card style={{minHeight: "100vh", borderRadius:"0px"}}>
          <SideBar t1={props.t1} t2={props.t2} l1={props.l1} l2={props.l2}/>
          
          <div id="alignSearchBar">
          
            <TextField
              style={{ marginLeft: "3.625em"}}
              id="searchBarFriends"
              type="text"
              label={searchTextTag}
              variant="filled"
              onChange={handleSearchFriendInput}
              InputProps={{endAdornment: <Button><PersonAddIcon/></Button>}}
            />

          </div>

          <div id="freunde" >
            <List>
              <FriendItem name="Peter" description="Ich bin Peter" key="" profilePicture="" l1={props.l1} l2={props.l2} t1={props.t1} t2={props.t2}></FriendItem>
              <FriendItem name="Lukas" description="Ich bin Lukas" key="" profilePicture="" l1={props.l1} l2={props.l2} t1={props.t1} t2={props.t2}></FriendItem>
              <FriendItem name="Olli" description="Ich bin Olli" key="" profilePicture="" l1={props.l1} l2={props.l2} t1={props.t1} t2={props.t2}></FriendItem>
            </List>
          </div>
      </Card>
    </ThemeProvider>
    );
  
}


export default GroupSettings;