
import './App.css';
import { Link } from "react-router-dom";
import { Button, Slider } from '@mui/material';
import Header from '../components/header';
import DeleteIcon from '@mui/icons-material/Delete';
import Dark_Mode from '../components/dark_mode';
import React from "react";
import BaseMap from '../components/BaseMap';


function App() {

  return (
    <div className="App">
      <Header/>
      <BaseMap />
      <Slider></Slider>
      <a>index</a>
      <Link to="/start">Start</Link>
      <Button variant="contained" >Hello World</Button>;
      <Button variant="contained"   endIcon={<DeleteIcon/>}>
        Send
      </Button>
    </div>
  );
}

export default App;
