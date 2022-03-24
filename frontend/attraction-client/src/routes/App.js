import { Link } from "react-router-dom";
import Header from "../components/header";
import "./start.css";
import { Button, Slider, Typography, TextField, Paper, getTableSortLabelUtilityClass } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import React from "react";
import BaseMap from '../components/BaseMap';

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




function App(props) {
 
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

  const apiKey = "5ae2e3f221c38a28845f05b690c520033dc6de71c6665213ffad8752";

  function apiGet(method, query) {
    return new Promise(function(resolve, reject) {
      var otmAPI =
        "https://api.opentripmap.com/0.1/en/places/" +
        method +
        "?apikey=" +
        apiKey;
      if (query !== undefined) {
        otmAPI += "&" + query;
        console.log("a  a")
      }
      fetch(otmAPI)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(function(err) {
          console.log("Fetch Error :-S", err);
        });
    });
  }

  async function getDataFromAPI()
  {
    
    apiGet(
      "radius",
      `radius=10000&limit=${100}&offset=${0}&lon=${11.6615276}&lat=${46.7217851}&rate=2&format=json`
    )
  }
  
    return (
      <ThemeProvider theme={createTheme(theme === "dark" ? dark : light)}>
      <Header/>
      <Button onClick={() => getDataFromAPI()}>click me for data</Button>
      <BaseMap />
      <Slider></Slider>
      <a>index</a>
      <Link to="/start">Start</Link>
      <Button variant="contained" >Hello World</Button>;
      <Button variant="contained"   endIcon={<DeleteIcon/>}>
     
        Send
      </Button>
    </ThemeProvider>
    );
  
}


export default App;