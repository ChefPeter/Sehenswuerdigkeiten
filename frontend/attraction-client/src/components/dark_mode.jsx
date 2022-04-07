import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import * as React from 'react';
import { setCookie } from "../functions/cookieManager";

function Dark_Mode(props) {
  
  function onModeSwitch(){
    let newTheme = (props.t1 === "light" ? "dark" : "light");
    props.t2(newTheme)
    setCookie("theme",newTheme)
  }

  return (
    <ListItem button onClick={() =>  onModeSwitch()}>
     
        <ListItemIcon>
        {props.t1 === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}

            </ListItemIcon>
            
            <ListItemText primary={"Theme"} />
   
    </ListItem>
  );
}

export default Dark_Mode;