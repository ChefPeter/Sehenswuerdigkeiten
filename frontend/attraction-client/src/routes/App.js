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

  async function getDataFromAPI(url)
  {
    let result = await fetch(url);
    let answer = null;
    if(result.ok)
      answer = await result.json();
    return answer;
  }

  async function enter()
  {
      const URL = "https://heritage.toolforge.org/api/api.php?action=search&srcountry=fr&srlang=fr&srmunicipality=[[Aix-en-Provence]]&format=json";
      let result = getDataFromAPI(URL);
      console.log(result);
  }


  
    return (
      <ThemeProvider theme={createTheme(theme === "dark" ? dark : light)}>
      <Header/>
      <Button onClick={() => enter()}>click me for data</Button>
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