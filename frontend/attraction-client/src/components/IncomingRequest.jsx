import CheckIcon from '@mui/icons-material/Check';
import PersonIcon from '@mui/icons-material/Person';
import RemoveIcon from '@mui/icons-material/Remove';
import { ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import React from "react";


function IncomingRequest(props) {
  
  
    return (
      <div>
        
        <ListItem sx={{maxWidth: 400, border: "solid 0.5px", marginBottom: 1.5}} id="listItem" alignItems="flex-start">
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

    let formData = new FormData();
    formData.append('friend', name);
  
    fetch("https://10.10.30.18:8443/add-friend", {
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

    let formData = new FormData();
    formData.append('friend', name);
  
    fetch("https://10.10.30.18:8443/reject-friend", {
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