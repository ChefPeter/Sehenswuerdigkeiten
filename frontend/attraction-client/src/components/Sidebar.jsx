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


export default function SwipeableTemporaryDrawer() {
  const [state, setState] = React.useState({
    left: false,
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
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 300 }}
      role="presentation"
      
      onKeyDown={toggleDrawer(anchor, false)}
    >
      
      <List>
        
          <ListItem button  component={Link} to="/home">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItem>
          <ListItem button  component={Link} to="/explore">
            <ListItemIcon>
              <TravelExploreIcon />
            </ListItemIcon>
            <ListItemText primary={"Explore"} />
          </ListItem>
          <ListItem button  component={Link} to="/groups">
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary={"Groups"} />
          </ListItem>
          <ListItem button  component={Link} to="/friends">
            <ListItemIcon>
            <PersonAddIcon />
            </ListItemIcon>
            <ListItemText primary={"Friends"} />
          </ListItem>
          <ListItem button  component={Link} to="/notifications">
            <ListItemIcon>
            <NotificationsIcon />
            </ListItemIcon>
            <ListItemText primary={"Notifications"} />
          </ListItem>
          <ListItem button  component={Link} to="/contact">
            <ListItemIcon>
              <ContactPageIcon />
            </ListItemIcon>
            <ListItemText primary={"Contact"} />
          </ListItem>
        
      </List>
      <Divider />
    </Box>
    </div>
  );

  return (
    <div>
      <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon onClick={toggleDrawer("left", true)}></MenuIcon>
          </IconButton>
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
