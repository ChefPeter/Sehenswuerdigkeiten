import { useSelector } from 'react-redux';
import Header from "../components/header";
import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import { Button} from '@mui/material';
import "../routes/styles/profile.css";

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

function Profile(props) {

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
      <div>
        <ThemeProvider theme={createTheme(theme === "dark" ? dark : light)}>
        <Header/>
        <div id='description'>
            <div id='profil'>
                <Avatar alt="Travis Howard" src="" 
                    sx={{ width: 80, height: 80 }}
                />
            </div>
            <div id='unten'>
                <div>
                    <TextField id="filled-basic" label="Vorname" variant="filled" />
                </div>
                <div>
                    <TextField id="filled-basic" label="Nachname" variant="filled" />
                </div>
                
                <TextField
                    id="outlined-multiline-static"
                    label="Status"
                    multiline
                    rows={4}
                    defaultValue=""
                />
                <Button variant="contained">Speichern</Button>
            </div>
        </div>
        </ThemeProvider>
      </div>
    );
  
}
export default Profile;