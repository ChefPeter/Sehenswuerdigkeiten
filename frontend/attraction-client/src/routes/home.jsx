import { Card } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from 'react';
import BaseMap from '../components/BaseMap';
import Sidebar from "../components/Sidebar";
import "./styles/home.css";
import "./styles/start.css";
import {useState, useEffect} from 'react';
import { checkCurrentlyLoggedIn } from "../functions/checkLoggedIn";

// Define theme settings
const light = {
  palette: {
    mode: "light",
    colorDiv: "white"
  },
};

const dark = {
  palette: {
    mode: "dark",
  },
};

function Home(props) {

  const[loggedIn, setLoggedIn] = useState(false);
  
  useEffect(() => {
    setLoggedIn(checkCurrentlyLoggedIn());
  }, []);
 
  return (
    <ThemeProvider theme={createTheme(props.t1 === "dark" ? dark : light)}>
      {loggedIn ?
        <Card id="container" style={{borderRadius:"0px"}}>
          <BaseMap l1={props.l1} t1={props.t1} />
          
          <Sidebar t1={props.t1} t2={props.t2} l1={props.l1} l2={props.l2} />
        </Card>
      : null}
    </ThemeProvider>
  );
  
}

export default Home;