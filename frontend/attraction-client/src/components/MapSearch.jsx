import React from "react";
import { Paper, Button, TextField, Container, Card, Box, Divider } from "@mui/material";
import "./styles/mapsearch.css";
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import { fontSize } from "@mui/system";

let locationInput = "";

function MapSearch () {

    const handleSearchFriendInput = (event)=>{
        locationInput = event.target.value;
    };

    return (
        <Paper id="searchPaper" elevation={10} >
            <TextField
                fullWidth
                id="searchBarLocation"
                type="text"
                label="Search a place"
                
                onChange={handleSearchFriendInput}
                InputProps={{endAdornment: <Container style={{display:"flex", marginRight:"1.2vw", maxWidth:"130px"}}><Button><TravelExploreIcon onClick={() => console.log("explore")} /> </Button>  <Divider orientation="vertical" flexItem /> <Button><GpsFixedIcon  onClick={() => console.log("gps")} /></Button></Container> }}
            />
           

        </Paper>
    );


}

export default MapSearch;