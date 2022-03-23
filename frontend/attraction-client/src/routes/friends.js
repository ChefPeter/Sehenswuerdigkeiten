import Header from "../components/header";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from "react";
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

  const [friendsName, setFriendsName] = useState([]);
  const [triedToFetch, setTriedToFetch] = useState(false)


  useEffect(async() => {
    
    if(!triedToFetch){

      setTriedToFetch(true)

      const resultFriends = await fetch("http://localhost:5000/friends", {
        method: "get",
        credentials: 'include'
      })
    
      let text = (await resultFriends.json());
      let users = [];

      for(let i = 0; i<text.length; i++){

        const resultDescription = await fetch("http://localhost:5000/description?"+new URLSearchParams({username:text[i]}).toString(), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          method: "get",
          credentials: 'include'
        })
        
        const description = await resultDescription.text();
        users.push({
          name: text[i],
          description: description
        })

      }
      
      setFriendsName(users);
      
    }

  });
  


  const handleSearchFriendInput = (event)=>{
    searchFriendInput = event.target.value;
  };

    return (
      <ThemeProvider theme={createTheme(light)}>
      <Header/>
     
      <div>
        <TextField type="text" id="filled-basic" label= {<SearchFriend/>} variant="filled" onChange={handleSearchFriendInput} />
        <Button variant="contained" onClick={() => handleAddFriend()}>ADD</Button>
      </div>
      <div id="freunde">
      
        <List>

          {friendsName.map(e =>  <FriendItem name={e.name} description={e.description} key={e.name}></FriendItem>)}
         
        </List>
        
      </div>
    </ThemeProvider>
    );
  
}

function handleAddFriend(){

  console.log(searchFriendInput);

  let formData = new FormData();
  formData.append('friend', searchFriendInput);
  

  fetch("http://localhost:5000/add-friend", {
      method: "post",
      body: formData,
      credentials: 'include'
  }).then(res => {
      if (res.status == 400) {
        res.text().then(e => console.log(e))
         // res.text().then(e => setErrorText(e));
         // setShowErrorAlert(true);
      } else {
          // Infofeld sichtbar machen
         console.log("JAWOLL")
         
         
      }
  });


}


export default Friends;