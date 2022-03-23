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
            <CheckIcon sx={{width: 40, color: "green",}}/>
            <RemoveIcon  sx={{width: 40,color: "red",}}/>
          </ListItemAvatar>
      </ListItem>

      </div>
    
    );
  
}


export default IncomingRequest;