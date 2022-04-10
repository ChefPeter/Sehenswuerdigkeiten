import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import GroupIcon from '@mui/icons-material/Group';
import MenuIcon from '@mui/icons-material/Menu';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PolicyIcon from '@mui/icons-material/Policy';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Dark_Mode from './dark_mode';
import LanguageSelector from './LanguageSelector';
import "./styles/sidebar.css";
import LogoutIcon from '@mui/icons-material/Logout';

export default function SwipeableTemporaryDrawer(props) {

  const [state, setState] = React.useState({left: false});

  const [languageTags, setLanguageTags] = useState({
                                                      home: "Map",
                                                      groups: "Groups",
                                                      friends: "Friends",
                                                      contact: "Contact",
                                                      legalNotice: "Legal Notice",
                                                      profile: "Profile",
                                                      logout: "Logout"
  });

  //reacts only to language changes
  useEffect(() => {
    
    if(props.l1 == "de") {

        setLanguageTags({
                          home: "Karte",
                          groups: "Gruppen",
                          friends: "Freunde",
                          contact: "Kontakt",
                          legalNotice: "Impressum",
                          profile: "Profil",
                          logout: "Ausloggen"
        });

    } else if(props.l1 == "it") {

      setLanguageTags({
                        home: "Mappa",
                        groups: "Gruppi",
                        friends: "Amici",
                        contact: "Contatto",
                        legalNotice: "Avviso legale",
                        profile: "Profilo",
                        logout: "Logout"
      });

    } else {

      setLanguageTags({
                      home: "Map",
                      groups: "Groups",
                      friends: "Friends",
                      contact: "Contact",
                      legalNotice: "Legal Notice",
                      profile: "Profile",
                      logout: "Logout"
      });

    }

  }, [props.l1]);
  


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
      style={{height:"100vh"}}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      
      <List>
        
          <ListItem button onClick={toggleDrawer(anchor, false)} component={Link} to="/home">
            <ListItemIcon>
              <TravelExploreIcon />
            </ListItemIcon>
            <ListItemText primary={languageTags.home} />
          </ListItem>

          <ListItem button onClick={toggleDrawer(anchor, false)} component={Link} to="/groups">
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary={languageTags.groups} />
          </ListItem>

          <ListItem button onClick={toggleDrawer(anchor, false)} component={Link} to="/friends">
            <ListItemIcon>
            <PersonAddIcon />
            </ListItemIcon>
            <ListItemText primary={languageTags.friends} />
          </ListItem>

          <ListItem button onClick={toggleDrawer(anchor, false)} component={Link} to="/contact">
            <ListItemIcon>
              <ContactPageIcon />
            </ListItemIcon>
            <ListItemText primary={languageTags.contact} />
          </ListItem>

          <ListItem button onClick={toggleDrawer(anchor, false)} component={Link} to="/legalnotice">
            <ListItemIcon>
              <PolicyIcon />
            </ListItemIcon>
            <ListItemText primary={languageTags.legalNotice} />
          </ListItem>
        
      </List>
      <Divider />

      <ListItem button onClick={toggleDrawer(anchor, false)} component={Link} to="/profile">
            <ListItemIcon>
            <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText primary={languageTags.profile} />
      </ListItem>

      <Dark_Mode t1={props.t1} t2={props.t2}></Dark_Mode>
      <LanguageSelector l1={props.l1} l2={props.l2} ></LanguageSelector>

      <ListItem style={{bottom:"8px", position:"absolute"}} button onClick={() => handleLogout()} component={Link} to="/profile">
            <ListItemIcon>
            <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={languageTags.logout} />
      </ListItem>

    </Box>
    </div>
  );

  function handleLogout() {

    //fetch post to logout
    fetch('https://10.10.30.18:8443/logout', {
      method: 'POST',
      credentials: "include",
    }).then(response => {
      if(response.status === 200) {
        window.location.href = "/";
      }
    });

  }

  return (
    <div>
    <Box 
      onClick={toggleDrawer("left", true)}
      sx={{backgroundColor: 'primary.dark', 
      border: '2px black',
      opacity: 0.9,
      '&:hover': {
      backgroundColor: 'primary.main',
      },}} id="navi" style={{marginTop:"16.5px", borderRadius:"6px", width:"2.625em", minWidth:"2.625em", marginLeft:"0.5em"}}>
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
