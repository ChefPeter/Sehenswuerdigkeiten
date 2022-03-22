import { Link } from "react-router-dom";
import Header from "../components/header";
import "./start.css";
import { Button, Typography, TextField, Paper, getTableSortLabelUtilityClass } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { color, palette } from "@mui/system";
import { useEffect } from "react";
import { Provider } from 'react-redux';
import { connect } from "react-redux";
import { store } from "../index";


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
 
    return (
      <ThemeProvider theme={createTheme(props.theme === "dark" ? dark : light)}>
        <Header></Header>
         <Paper square elevation="1">
        <Typography variant="body1" component="h4">
          Du befindest dich auf der Startseite.
        </Typography>;
        <TextField id="filled-basic" label="Filled" variant="filled" />
        <Link to="/">Home</Link>
        <Button variant="contained">Contained</Button>
        <Button onClick={(e) => handleClick()}>HOHOP</Button>
        </Paper>
     </ThemeProvider>
    );
  
}

const initState = {
  theme: "light",
  language: "de"
}

const mapStatesToProps = (state = initState) => {

  return {
    theme: state.theme,
    language: state.language
  }

}

function handleClick() {

  const changeTheme = { type: 'CHANGE_THEME', theme: "unknown"};
  store.dispatch(changeTheme)
  
}

export default connect(mapStatesToProps)(Explore);