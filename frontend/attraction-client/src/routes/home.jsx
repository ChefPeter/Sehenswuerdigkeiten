import Header from "../components/header";
import "./styles/start.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, Card } from "@mui/material";
import { useSelector } from 'react-redux';
import BaseMap, {postRoute} from '../components/BaseMap';
import React, { useState, useEffect } from 'react';
import "./styles/home.css"
import MapSearch from "../components/MapSearch";
import Sidebar from "../components/Sidebar"

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
       
        <Card id="container">
          
          <BaseMap />
          
          <Sidebar/>

          <div id="navi" style={{ marginLeft: "3.625em", width:"100px"}}>
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