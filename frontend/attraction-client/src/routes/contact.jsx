import { Link } from "react-router-dom";
import Header from "../components/header";
import { styled, alpha } from '@mui/material/styles';
import "./start.css";
import { Button, Typography, TextField, Paper, getTableSortLabelUtilityClass } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { color, palette } from "@mui/system";
import { useEffect } from "react";
import { Provider } from 'react-redux';
import { connect } from "react-redux";
import store from "../reducers/store";
import { useSelector } from 'react-redux';
import { yellow } from "@mui/material/colors";
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';


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

const DivOut = styled('div')(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),'&:hover': {backgroundColor: alpha(theme.palette.common.white, 0.25),},
    width: '40%',
    height: '60%',
    margin: '30%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'block',
    border: '1px solid black',
}));

const LabelLabel = styled('label')(({ theme }) => ({
    justifyContent: 'center',
    alignItems: 'center',
    display: 'block',
    width: '96%',
    height: '44%',
    margin: theme.spacing(1, 1, 1, 1),
}));

const PLabel = styled('p')(({ theme }) => ({
    height: '20%',
    fontSize: '65%',
}));

//const TextAreaLabel

const InputLabel = styled('textarea')(({ theme }) => ({
    height: '80%',
    width: '98%',
    resize: 'none',
    overflow: 'auto',
}))

function Groups(props) {

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
      <div style={{widht: '100vw', height: '100vh'}}>
        <DivOut>
            <LabelLabel>
                <PLabel>Message:</PLabel>
                <InputLabel></InputLabel>
            </LabelLabel>
            <LabelLabel>
                <PLabel>Details:</PLabel>
                <InputLabel></InputLabel>
            </LabelLabel>
        </DivOut>
      </div>
    );
  
}
export default Groups;