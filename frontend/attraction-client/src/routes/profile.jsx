import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useSelector } from 'react-redux';
import "../routes/styles/contact.css";
import Header from "../components/header";
import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button} from '@mui/material';

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

function Profile(props) {

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
      <div>
        <ThemeProvider theme={createTheme(theme === "dark" ? dark : light)}>
        <Header/>
        </ThemeProvider>
      </div>
    );
  
}
export default Profile;