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
import { useSearchParams } from "react-router-dom";

//let searchFriendInput = "";
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
  const [title, setTitle] = useState("Title");
  const [searchTextTag, setSearchTextTag] = useState("Search a friend");

  const [searchFriendInput, setSearchFriendInput] = useState("");

  //const [showLoadingBar, setShowLoadingBar] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const name = searchParams.get("name");

  const [members, setMembers] = useState([]);
  const profilePictures = [];

  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(async () => {
    if(props.l1 == "de") {
      setTitle("Gruppe: ");
      setSearchTextTag("Suche ein Mitglied");
    } else if(props.l1 == "it") {
      setTitle("Gruppo: ");
      setSearchTextTag("Cerca un membro")
    } else {
      setTitle("Group: ");
      setSearchTextTag("Search a member");
   }

    fetch("http://localhost:5000/group-members?"+new URLSearchParams({group_id: searchParams.get("group_id")}), {
     method: "GET",
     credentials: "include"
    })
    .then(res => res.json())
    .then(res => {
      setMembers(res)
    });

   //setShowLoadingBar(false);
  }, [props.l1]);

  const handleSearchFriendInput = (event)=>{
    setSearchFriendInput(event.target.value);
    //searchFriendInput = event.target.value;
  };

  const addMember = () => {
    // Add member to group
    let formData = new FormData();
    formData.append("username", searchFriendInput);
    formData.append("group_id", searchParams.get("group_id"));

    fetch("http://localhost:5000/add-to-group", {
      method: "POST",
      body: formData,
      credentials: "include"
    })
    .then(res => {
      if (res.status === 200) {
        window.location.reload();
      } else {
        res.text().then(res => {
          setTimeout(() => setError(false), 2500);
          setSearchFriendInput("");
          setErrorText(res);
          setError(true);
        });
      }
    });
  };

    return (
      <ThemeProvider theme={createTheme(props.t1 === "dark" ? dark : light)}>
        <Card style={{minHeight: "100vh", borderRadius:"0px"}}>
          <SideBar t1={props.t1} t2={props.t2} l1={props.l1} l2={props.l2}/>
          <h2 style={{ marginLeft: "2.625em", display: "flex", alignItems: 'center', height: "3.25em" }}>{title + name}</h2>
          {/* { showLoadingBar ? 
               <LinearProgress color="inherit"/>
          : null} */}

          <div id="alignSearchBar">
            <TextField
              style={{ marginLeft: "0.625em"}}
              id="searchBarFriends"
              type="text"
              label={searchTextTag}
              variant="filled"
              value={searchFriendInput}
              onChange={handleSearchFriendInput}
              InputProps={{endAdornment: <Button onClick={addMember}><PersonAddIcon/></Button>}}
            />
          </div>

          <div id="freunde" >
            <List>
              {
                members.map((member, i) => <FriendItem showDeleteButton={false} name={member.username} description={member.description} key={"member_"+i} l1={props.l1} l2={props.l2} t1={props.t1} t2={props.t2}></FriendItem>)
              }
            </List>
          </div>
      </Card>
      <ErrorSnackbar openErrorSnack={error} errorMessage={errorText}></ErrorSnackbar>
    </ThemeProvider>
    );
  
}


export default GroupSettings;