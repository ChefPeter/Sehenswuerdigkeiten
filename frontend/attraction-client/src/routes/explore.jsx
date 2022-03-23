import Header from "../components/header";
import "./start.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSelector } from 'react-redux';
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

function Explore(props) {
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
      <BaseMap />
    </ThemeProvider>
    );
  
}

export default Explore;