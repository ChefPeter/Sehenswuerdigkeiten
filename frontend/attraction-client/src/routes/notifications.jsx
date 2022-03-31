import { Card } from '@mui/material';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import Sidebar from "../components/Sidebar";
import "../routes/styles/notifications.css";

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

    return (
  
        <ThemeProvider theme={createTheme(props.t1 === "dark" ? dark : light)}>
          <Card style={{minHeight: "100vh", borderRadius:"0px"}}>
          <Sidebar t1={props.t1} t2={props.t2} l1={props.l1} l2={props.l2}/>
        
          <div id='nachrichten' style={{marginTop: "calc(16.5px + 3.5em)"}}>
              <Stack spacing={1}>
                  <Alert onClose={() => {}} severity="info">Neue Nachricht von olli</Alert>
                  <Alert onClose={() => {}} severity="warning">Auf deiner Strecke befindet sich eine Menschenansammlung</Alert>
              </Stack>
          </div>
          </Card>
        </ThemeProvider>
      
    );
  
}
export default Notifications;