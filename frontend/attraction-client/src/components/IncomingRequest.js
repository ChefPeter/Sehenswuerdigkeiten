import React from "react";
import { Typography, ListItemText, Avatar, ListItem, Grid } from "@mui/material";
import { ListItemAvatar, Card, Container, Button } from "@mui/material";
import { useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
import CheckIcon from '@mui/icons-material/Check';
import RemoveIcon from '@mui/icons-material/Remove';



function IncomingRequest(props) {
  
  
    return (
      <div>
        
        <ListItem sx={{maxWidth: 400, border: "solid 1px", marginBottom: 1.5}} id="listItem" alignItems="flex-start">
          <ListItemAvatar>
              <PersonIcon />
          </ListItemAvatar>
          <ListItemText primary={props.name} />   
          <ListItemAvatar>
            <CheckIcon  sx={{width: 40, color: "green",}} onClick={() => accepted(props.name)}/>
            <RemoveIcon  sx={{width: 40,color: "red",}} onClick={() => rejected(props.name)}/>
          </ListItemAvatar>
      </ListItem>

      </div>
    
    );
  
}

function accepted(name){

    console.log("accepted")

    let formData = new FormData();
    formData.append('friend', name);
  
    fetch("http://localhost:5000/add-friend", {
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

function rejected(name){

    console.log("rejected")

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



export default IncomingRequest;