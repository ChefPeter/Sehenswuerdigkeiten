import React from "react";
import { Typography, ListItemText, Avatar, ListItem, Grid } from "@mui/material";
import { ListItemAvatar, Card, Container, Button } from "@mui/material";
import { useState } from "react";
import ClearIcon from '@mui/icons-material/Clear';
import "./styles/friendItem.css";


function FriendItem(props) {
  
  const [showDescription, setShowDescription] = useState(false);

    return (
      <div>
        
        <ListItem id="listItem" button onClick={() => openFriendMenu(setShowDescription, showDescription)} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
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