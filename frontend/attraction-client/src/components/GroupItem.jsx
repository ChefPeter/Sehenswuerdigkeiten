import React from "react";
import { Typography, ListItemText, Avatar, ListItem, Grid } from "@mui/material";
import { ListItemAvatar, Card, Container, Button } from "@mui/material";
import { useState } from "react";
import ClearIcon from '@mui/icons-material/Clear';
import "./styles/friendItem.css";
import { useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";

function FriendItem(props) {

    const navigate = useNavigate();
    
    const [showDescription, setShowDescription] = useState(false);    

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
        <Button variant="conatined" onClick={ () => navigate("/chat?"+new URLSearchParams({name: props.name}))}>Open Chat</Button>
        <Button id="buttonRemoveFriend" variant="conatined" onClick={() => handleLeaveGroup(props.groupID)}><ClearIcon/></Button>
      </Card> : null}
        
        <br></br>

      </div>
    
    );
  
}


function handleReport(){

}
function handleLeaveGroup(groupID){

    let formData = new FormData();
    formData.append('group_id', groupID);
  
    fetch("http://localhost:5000/leave-group", {
        method: "post",
        body: formData,
        credentials: 'include'
    }).then(res => {
        if (res.status == 200) {
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