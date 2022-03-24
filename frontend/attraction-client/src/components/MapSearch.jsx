import React from "react";
import { Paper, Button, TextField } from "@mui/material";
import "./styles/mapsearch.css";
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

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
                InputProps={{endAdornment: <Button onClick={() => console.log("dwqqw")}><TravelExploreIcon/></Button> }}
            />
           

        </Paper>
    );


}

export default MapSearch;