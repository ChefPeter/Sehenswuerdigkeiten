import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
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
        {props.t1 === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}

            </ListItemIcon>
            
            <ListItemText primary={"Theme"} />
   
    </ListItem>
  );
}

export default Dark_Mode;