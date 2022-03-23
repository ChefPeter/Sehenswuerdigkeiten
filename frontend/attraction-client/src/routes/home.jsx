import { Link } from "react-router-dom";
import Header from "../components/header";
import "./start.css";
import { Button, Typography, TextField, Paper, getTableSortLabelUtilityClass } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSelector } from 'react-redux';
import { yellow } from "@mui/material/colors";


// Define theme settings
const light = {
  palette: {
    mode: "light",
  },
};

const dark = {
  palette: {
    mode: "dark",
  },
};


function Home(props) {

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
        <Header></Header>
        <p>{theme} + {language}</p>
         <Paper square elevation={5}>
        <Typography variant="body1" component="h4">
          Du befindest dich auf der Startseite.
        </Typography>;
        <TextField id="filled-basic" label="Filled" variant="filled" />
        <Link to="/">Home</Link>
        <Button variant="contained">Contained</Button>
        </Paper>
      </ThemeProvider>
    );
  
}



export default Home;