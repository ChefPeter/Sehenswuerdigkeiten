import { useState } from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';


export default function Info() {
  
  function changeOpen () {
    setOpen(true);
  }

  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button
        onClick={() => setOpen(true)}>
        Info
      </Button>

      <SwipeableDrawer 
        anchor='bottom'
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => {}}>
          <div>
            <img src="https://media.istockphoto.com/photos/colosseum-in-rome-during-sunrise-picture-id1271579758?b=1&k=20&m=1271579758&s=170667a&w=0&h=oyXB8ehFjbo5-9HDdSjI9hYZktLstV3Ixz4JUUynahU=" style={{width:"100%", height:"12%"}}></img>
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <h2 >Name</h2>
              <Button variant="contained" style={{borderRadius: '20px', backgroundColor: "white", color: "black"}}>Add</Button>
            </div>
          </div>
            
      </SwipeableDrawer>
    </div>
  );
}
