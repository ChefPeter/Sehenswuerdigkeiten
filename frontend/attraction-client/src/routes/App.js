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

    return (
      <ThemeProvider theme={createTheme(theme === "dark" ? dark : light)}>
        <p>{language}</p>
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