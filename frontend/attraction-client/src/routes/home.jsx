import Header from "../components/header";
import "./styles/start.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSelector } from 'react-redux';
import BaseMap from '../components/BaseMap';
import React, { useState, useEffect } from 'react';
import { Card } from "@mui/material";
import "./styles/home.css"
import MapSearch from "../components/MapSearch";

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

 
  useEffect(() => {
    
    

  });
  

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
      <Card id="container">
        <BaseMap />
        <div id="navi"><MapSearch></MapSearch></div>
      </Card>
      
  

    </ThemeProvider>
    );
  
}

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