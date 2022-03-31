import ClearIcon from '@mui/icons-material/Clear';
import { Avatar, Button, Card, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/friendItem.css";

function GroupItem(props) {

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
        <Button variant="conatined" onClick={ () => navigate("/chat?"+new URLSearchParams({name: props.name, group_id: props.groupID}))}>Chat</Button>
        <Button id="buttonRemoveFriend" variant="conatined" onClick={() => handleLeaveGroup(props.groupID)}><ClearIcon/></Button>
      </Card> : null}
        
        <br></br>

      </div>
    
    );
  
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

function openFriendMenu(setShowDescription, state){

 
  setShowDescription(!state);

}

export default GroupItem;