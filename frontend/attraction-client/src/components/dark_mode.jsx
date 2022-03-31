import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Pape, Card, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {setCookie} from "../functions/cookieManager";

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