import { Link } from "react-router-dom";
import Header from "../components/header";
import "./start.css";
import { Button, Typography, TextField, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { connect } from "react-redux";
import { useEffect } from "react";

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


export default function Explore() {

    return (
      <ThemeProvider theme={createTheme(dark)}>
        
        <Header></Header>

         <Paper square elevation="1">
        <Typography variant="body1" component="h4">
          Du befindest dich auf der ExploreSeite.
        </Typography>;
        <TextField id="filled-basic" label="Filled" variant="filled" />
        <Link to="/">Home</Link>
        <Button variant="contained">Contained</Button>
        </Paper>
     </ThemeProvider>
    );
  }