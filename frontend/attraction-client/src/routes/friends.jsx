import Header from "../components/header";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import List from '@mui/material/List';
import "./styles/friends.css";
import { Button, Container, TextField, Typography, LinearProgress, Box } from "@mui/material";
import FriendItem from "../components/FriendItem";
import SearchFriend from "../components/SearchFriend";
import IncomingRequest from "../components/IncomingRequest";
import "./styles/friends.css";
import ErrorSnackbar from "../components/ErrorSnackbar";
import SuccessSnackbar from "../components/SuccessSnackbar";
import { Snackbar, Alert } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

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

  const [friendsName, setFriendsName] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [triedToFetch, setTriedToFetch] = useState(false);
  const [profilePicture, setProfilePicture] = useState();
  const [showLoadingBar, setShowLoadingBar] = useState(true);
  const [openSuccessSnack, setOpenSuccessSnack] = useState(false);
  const [openErrorSnack, setOpenErrorSnack] = useState(false);
  const [successMessage, setSuccessMessage] = useState("Success");
  const [errorMessage, setErrorMessage] = useState("Error");


  useEffect(async() => {
    
    console.log("efffect")

    if(!triedToFetch){

      setTriedToFetch(true)
      console.log("dwq")
      const resultFriends = await fetch("http://localhost:5000/friends", {
        method: "get",
        credentials: 'include'
      })
    
      let friends = (await resultFriends.json());
      let users = [];

     /* let profilePictures = [];
      for(let i = 0; i<friends.length; i++){

        const fileProfilePicture = await fetch("http://localhost:5000/profile-picture?"+new URLSearchParams({friend: friends[i]}), {
          method: "get",
          credentials: 'include'
        });

        let file = (await fileProfilePicture); //.blob()
        
        if(file.status === 200){
          console.log("no profile")
          file = "/broken-image.jpg";
        }else{
          file = file.blob();
          try{
            file = URL.createObjectURL(file);
          }catch (e){
            file="/broken-image.jpg";
          }
        }
        console.log("NO")
        profilePictures.push(file);

      }
      
      console.log(profilePictures)
      */ 
      for(let i = 0; i<friends.length; i++){

        const resultDescription = await fetch("http://localhost:5000/description?"+new URLSearchParams({username:friends[i]}).toString(), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          method: "get",
          credentials: 'include'
        })
        
        const description = await resultDescription.text();
        users.push({
          name: friends[i],
          description: description
        })

      }
      
    
      //fetch friend requests
      const resultFriendRequests = await fetch("http://localhost:5000/pending-friends", {
        method: "get",
        credentials: 'include'
      });

      let friendRequests = (await resultFriendRequests.json());


      setFriendRequests(friendRequests)
      setFriendsName(users);
     // setProfilePicture(profilePictures);
      setShowLoadingBar(false)


    }

  });
  

  const handleSearchFriendInput = (event)=>{
    searchFriendInput = event.target.value;
  };

  const handleCloseErrorSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenErrorSnack(false);
  };
  const handleCloseSuccessSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  
    setOpenSuccessSnack(false);
  };

    return (
      <ThemeProvider theme={createTheme(light)}>

      <Header/>

      { showLoadingBar ? 
      <LinearProgress color="inherit"/>
        : null}

      
      <div id="alignSearchBar">
      
      <TextField
        id="searchBarFriends"
        type="text"
        label="Search friend"
        variant="filled"
        onChange={handleSearchFriendInput}
        InputProps={{endAdornment: <Button onClick={() => handleAddFriend(setOpenSuccessSnack, setOpenErrorSnack, setSuccessMessage, setErrorMessage)}><PersonAddIcon/></Button>}}
      />

        { friendRequests.length > 0 ?
        <Typography >
          Incoming Requests!
        </Typography>
       : null }

      </div>
     
     
      {friendRequests.map(e => <IncomingRequest name={e} ></IncomingRequest>)}


      <div id="freunde" >
      
        <List>

          {friendsName.map((e,i) =>  <FriendItem name={e.name} description={e.description} key={e.name} profilePicture={/*profilePicture[i]*/"/broken-image.jpg"}></FriendItem>)}
         
        </List>
        
      </div>

      <ErrorSnackbar openErrorSnack={openErrorSnack} errorMessage={errorMessage} handleClose={handleCloseErrorSnackbar} ></ErrorSnackbar>
      <SuccessSnackbar openSuccessSnack={openSuccessSnack} successMessage={successMessage} handleClose={handleCloseSuccessSnackbar}></SuccessSnackbar>
      
    </ThemeProvider>
    );
  
}


function handleAddFriend(setOpenSuccessSnack, setOpenErrorSnack, setSuccessMessage, setErrorMessage){

  console.log(searchFriendInput);

  setOpenErrorSnack(false);
  setOpenSuccessSnack(false);

  let formData = new FormData();
  formData.append('friend', searchFriendInput);

  fetch("http://localhost:5000/add-friend", {
      method: "post",
      body: formData,
      credentials: 'include'
  }).then(res => {
      if (res.status == 400 || res.status === 401) {
          res.text().then(e =>  setErrorMessage(e))
          setOpenErrorSnack(true);
      } else {
          // Infofeld sichtbar machen
         setSuccessMessage("Friend request sent!");
         setOpenSuccessSnack(true);
      }
  });


}


export default Friends;