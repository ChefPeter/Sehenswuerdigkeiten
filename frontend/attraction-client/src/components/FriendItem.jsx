import React from "react";
import { Typography, ListItemText, Avatar, ListItem, Grid } from "@mui/material";
import { ListItemAvatar, Card, Container, Button } from "@mui/material";
import { useState } from "react";
import ClearIcon from '@mui/icons-material/Clear';
import "./styles/friendItem.css";
import { useEffect } from "react/cjs/react.production.min";


function FriendItem(props) {
  
  const [showDescription, setShowDescription] = useState(false);
  //const [profilePicture, setProfilePicture] = useState(); 
 // const [usedEffect, setUsedEffect] = useState(false);

 
    
    /*
    if(!usedEffect){
      //fetch friend requests

      const fileProfilePicture = await fetch("http://localhost:5000/profile-picture?"+new URLSearchParams({friend: props.name}), {
        method: "get",
        credentials: 'include'
      });


      let file = (await fileProfilePicture.blob());
    
      setProfilePicture(URL.createObjectURL(file));
      setUsedEffect(true);

    }*/

  

    return (
      <div>
        
        <ListItem id="listItem" button onClick={() => openFriendMenu(setShowDescription, showDescription)} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Avatar" src={props.profilePicture}/>
          </ListItemAvatar>
          <ListItemText
            primary={props.name}
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {props.description}
                </Typography>
                
              </React.Fragment>
            }
          />
          
      </ListItem>

      {showDescription ? 
      <Card id="friendCard"> 
        
        <Button variant="conatined" onClick={() => handleOpenChat()}>Open Chat</Button> 
        <Button variant="conatined" onClick={() => handleFollowPosition()}>Follow Position</Button> 
        <Button variant="conatined" onClick={() => handleReport()}>Report</Button>
        <Button id="buttonRemoveFriend" variant="conatined" onClick={() => handleRemoveFriend(props.name)}><ClearIcon/></Button>
        
      </Card> : null}
        
        <br></br>

      </div>
    
    );
  
}

function handleOpenChat(){

}

function handleReport(){

}
function handleRemoveFriend(name){

    let formData = new FormData();
    formData.append('friend', name);
  
    fetch("http://localhost:5000/reject-friend", {
        method: "post",
        body: formData,
        credentials: 'include'
    }).then(res => {
        if (res.status == 400) {
            
        } else {
            // Infofeld sichtbar machen
           window.location.reload();
           
        }
    });


}

function handleFollowPosition(){
  console.log("hallo")
}


function openFriendMenu(setShowDescription, state){

 
  setShowDescription(!state);

}

export default FriendItem;