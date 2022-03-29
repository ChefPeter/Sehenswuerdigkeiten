import { useSelector } from 'react-redux';
import "../routes/styles/notifications.css";
import Sidebar from "../components/Sidebar";
import React from "react";
import { Card } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

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

function Notifications(props) {

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
          
          <Sidebar/>
        
          <div id='nachrichten' style={{marginTop: "calc(16.5px + 3.5em)"}}>
              <Stack spacing={1}>
                  <Alert onClose={() => {}} severity="info">Neue Nachricht von olli</Alert>
                  <Alert onClose={() => {}} severity="warning">Auf deiner Strecke befindet sich eine Menschenansammlung</Alert>
              </Stack>
          </div>
        </ThemeProvider>
      </div>
    );
  
}
export default Notifications;