import "./styles/start.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, Card, Stack } from "@mui/material";
import BaseMap, {postRoute} from '../components/BaseMap';
import React, { useState, useEffect } from 'react';
import "./styles/home.css"
import MapSearch from "../components/MapSearch";
import Sidebar from "../components/Sidebar"
import {setCookie, getCookie, checkCookie} from "../functions/cookieManager";

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

 
    return (
      <ThemeProvider theme={createTheme(props.t1 === "dark" ? dark : light)}>
        
        <Card id="container" style={{borderRadius:"0px"}}>
          <BaseMap />
          
          <Sidebar t1={props.t1} t2={props.t2} l1={props.l1} l2={props.l2}/>
                                                                                              
          <div id="navi" style={{ marginLeft: "3.625em", minWidth:"30vw", maxWidth:"2.625em"}}>
            <MapSearch></MapSearch>
          </div>

          <Button style={{marginTop: "100px"}} id="test" onClick={() => postRoute()}>Enter</Button>

        </Card>
      </ThemeProvider>
    );
  
}

//<Button id="testButton" onClick={() => {console.log("test");}}>Post Route</Button>
//checks if logged in
function handle(){
  fetch("http://localhost:5000/logged-in", {
    method: "GET",
  }).then(res => {
    //not logged in
    console.log(res)
    if (res.status == 400) {
        //window.location.href="/login";
    } 
  });
}

export default Home;