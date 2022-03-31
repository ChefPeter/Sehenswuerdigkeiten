import React from "react";
import { Typography, ListItemText, Avatar, ListItem, Grid } from "@mui/material";
import { ListItemAvatar, Card, Container, Button } from "@mui/material";
import { useState, useEffect } from "react";
import ClearIcon from '@mui/icons-material/Clear';
import "./styles/friendItem.css";
import { useNavigate } from "react-router-dom";


function FriendItem(props) {

    const navigate = useNavigate();
    
    const [showDescription, setShowDescription] = useState(false);    
    const [followPositionTag, setFollowPositionTag] = useState("FOLLOW POSITION");


    useEffect(() => {
      if(props.l1 == "de") {
        setFollowPositionTag("POSITON FOLGEN");
      } else if(props.l1 == "it") {
        setFollowPositionTag("SEGUI POSIZIONE");
      } else {
        setFollowPositionTag("FOLLOW POSITION");
      }

    }, [props.l1]);
    

  
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
        
        <Button variant="conatined" onClick={() => navigate("/chat?"+new URLSearchParams({name: props.name}))}>CHAT</Button> 
        <Button variant="conatined" onClick={() => handleFollowPosition()}>{followPositionTag}</Button> 
        <Button id="buttonRemoveFriend" variant="conatined" onClick={() => handleRemoveFriend(props.name)}><ClearIcon/></Button>
        
      </Card> : null}
        
        <br></br>

      </div>
    
    );
  
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