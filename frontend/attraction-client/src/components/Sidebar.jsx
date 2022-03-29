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
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupIcon from '@mui/icons-material/Group';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link } from "react-router-dom";
import Dark_Mode from './dark_mode';
import LanguageSelector from './LanguageSelector';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PolicyIcon from '@mui/icons-material/Policy';
import "./styles/sidebar.css"


export default function SwipeableTemporaryDrawer() {
  const [state, setState] = React.useState({
    left: false
  });


  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };


  const list = (anchor) => (
    <div>
    <Box id="sidebarBox"
      role="presentation"
      
      onKeyDown={toggleDrawer(anchor, false)}
    >
      
      <List>
        
          <ListItem button onClick={toggleDrawer(anchor, false)} component={Link} to="/home">
            <ListItemIcon>
              <TravelExploreIcon />
            </ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItem>

          <ListItem button onClick={toggleDrawer(anchor, false)} component={Link} to="/groups">
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary={"Groups"} />
          </ListItem>

          <ListItem button onClick={toggleDrawer(anchor, false)} component={Link} to="/friends">
            <ListItemIcon>
            <PersonAddIcon />
            </ListItemIcon>
            <ListItemText primary={"Friends"} />
          </ListItem>

          <ListItem button onClick={toggleDrawer(anchor, false)} component={Link} to="/notifications">
            <ListItemIcon>
            <NotificationsIcon />
            </ListItemIcon>
            <ListItemText primary={"Notifications"} />
          </ListItem>

          <ListItem button onClick={toggleDrawer(anchor, false)} component={Link} to="/contact">
            <ListItemIcon>
              <ContactPageIcon />
            </ListItemIcon>
            <ListItemText primary={"Contact"} />
          </ListItem>

          <ListItem button onClick={toggleDrawer(anchor, false)} component={Link} to="/legalnotice">
            <ListItemIcon>
              <PolicyIcon />
            </ListItemIcon>
            <ListItemText primary={"Legal Notice"} />
          </ListItem>
        
      </List>
      <Divider />

      <ListItem button onClick={toggleDrawer(anchor, false)} component={Link} to="/profile">
            <ListItemIcon>
            <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText primary={"Profile"} />
      </ListItem>

      <Dark_Mode ></Dark_Mode>
      <LanguageSelector></LanguageSelector>
      
    </Box>
    </div>
  );

  return (
    <div>
    <Box 
      onClick={toggleDrawer("left", true)}
      
      sx={{backgroundColor: 'primary.dark', 
      border: '2px black',
      opacity: 0.9,
      '&:hover': {
      backgroundColor: 'primary.main',
      },}} id="navi" style={{marginTop:"16.5px", borderRadius:"6px", width:"2.625em", marginLeft:"0.5em"}}>
      <IconButton
            size="large"
            style={{padding: "10px 10px 10px 10px"}}
            color="inherit"
            aria-label="open drawer"
            
           
          >
            <MenuIcon ></MenuIcon>
          </IconButton>
          </Box>
      {
        
        <React.Fragment key="left">
         
          <SwipeableDrawer
            anchor="left"
            open={state["left"]}
            onClose={toggleDrawer("left", false)}
            onOpen={toggleDrawer("left", true)}
          >
            {list("left")}
          </SwipeableDrawer>
        </React.Fragment>
      }
    </div>
  );
}
