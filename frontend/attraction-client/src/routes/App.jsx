import { Link } from "react-router-dom";
import "./styles/start.css";
import { Button, Slider, Typography, TextField, Paper, getTableSortLabelUtilityClass } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DeleteIcon from '@mui/icons-material/Delete';
import React from "react";
import BaseMap, {postRoute} from '../components/BaseMap';

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
 

  function getDetailsFromMonument(id)
  {
    return `https://api.opentripmap.com/0.1/en/places/xid/${id}?apikey=${API_KEY}`;
  }

    return (
      <ThemeProvider theme={createTheme("dark" === "dark" ? dark : light)}>
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