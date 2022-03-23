import Header from "../components/header";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSelector } from 'react-redux';
import React from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { yellow } from "@mui/material/colors";
import "../routes/friends.css";


// Define theme settings
const light = {
  palette: {
    mode: "light",
  },
};

const dark = {
  palette: {
    mode: "dark",
  },
};


function Friends(props) {
  const theme = useSelector(state => {
    try{
      return state.theme;
    }catch(e){
      return "dark";
    }
  });
  const language = useSelector(state => {
    try{
      return state.language;
    }catch(e){
      return "de";
    }
  });

    return (
      <ThemeProvider theme={createTheme(theme === "dark" ? dark : light)}>
      <Header/>
      <div id="freunde">
        <div>
          <List>
              <ListItem button key={"dwq"}>
                  <ListItemAvatar>
                  <Avatar alt="Profile Picture" src={""} />
                  </ListItemAvatar>
                  <ListItemText primary={"Name, Nachname"} secondary={"Ich bins eins tepp"} />
              </ListItem>
          </List>
        </div>
        <div>
          <List>
              <ListItem button key={"dwq"}>
                  <ListItemAvatar>
                  <Avatar alt="Profile Picture" src={""} />
                  </ListItemAvatar>
                  <ListItemText primary={"Name, Nachname"} secondary={"Ich bins eins tepp"} />
              </ListItem>
          </List>
        </div>
      </div>
    </ThemeProvider>
    );
  
}

export default Friends;