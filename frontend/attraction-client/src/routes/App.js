import { Link } from "react-router-dom";
import Header from "../components/header";
import "./start.css";
import { Button, Slider, Typography, TextField, Paper, getTableSortLabelUtilityClass } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import React from "react";
import BaseMap from '../components/BaseMap';

const API_KEY = "5ae2e3f221c38a28845f05b690c520033dc6de71c6665213ffad8752";

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

  function getMonumentsInArea(method, radius, lat, lon, limit)
  {
    return `https://api.opentripmap.com/0.1/en/places/${method}?apikey=${API_KEY}&radius=${radius}&limit=${limit}&offset=0&lon=${lon}&lat=${lat}&rate=2&format=json`;
  }

  function getDetailsFromMonument(id)
  {
    return `https://api.opentripmap.com/0.1/en/places/xid/${id}?apikey=${API_KEY}`;
  }

  async function getDataFromURL(url)
  {
    let result = await fetch(url);
    let answer = null;
    if(result.ok)
      answer = await result.json();
    return answer;
  }

  async function getDataFromAPI()
  {
      let object = [];
      let result = await getDataFromURL(getMonumentsInArea("radius", 10000, "46.7217851", "11.6615276", 100));
      let test = await getDataFromURL(getDetailsFromMonument(result[0].xid))
      //for(let monument of result)
          //object.push(await getDataFromURL(getDetailsFromMonument(monument.xid)));
      
      console.log(result);
      console.log(test);
  }
    return (
      <ThemeProvider theme={createTheme(theme === "dark" ? dark : light)}>
      <Header/>
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