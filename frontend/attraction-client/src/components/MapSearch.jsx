import React from "react";
import { Paper, Button, TextField, Container, Card, Box, Divider, Stack, Autocomplete } from "@mui/material";
import "./styles/mapsearch.css";
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import { fontSize } from "@mui/system";
import {useState , setState} from "react";

let locationInput = "";

//let locations = [{name:"Sage"},{name:"Tage"}]

function MapSearch () {

    const [locations, setLocations] = useState([{name:"Sage"},{name:"Tage"}])

    const handleSearchFriendInput = async (event)=>{

        let locations2 = [];
        console.log("hallo")
        let jsonRes = "";

        if(event.target.value.length > 2){

            let result = await fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/"+new URLSearchParams(event.target.value).toString().slice(0,-1)+".json?limit=10&proximity=ip&types=place%2Cpostcode%2Caddress%2Clocality%2Cneighborhood%2Cdistrict&language=de&access_token=pk.eyJ1IjoiemJhYWtleiIsImEiOiJja3pvaXJ3eWM0bnV2MnVvMTc2d2U5aTNpIn0.RY-K9qwZD1hseyM5TxLzww", {
                method: "GET"
            });

            jsonRes = await result.json();
            console.log(jsonRes["features"][0])
        }

        // 0 -10
        setLocations([{name:JSON.stringify(jsonRes["features"][0]["place_name"])},{name:JSON.stringify(jsonRes["features"][0]["place_name"])}])
       
        locationInput = event.target.value;

    };

 
    return (

        <Paper id="searchPaper" elevation={10} >
          
            <div>{locations[0].name}</div>
            <Autocomplete
                freeSolo
                id="idAutocomplete"
                fullWidth
                disableClearable
                
                options={locations.map((option) => option.name)}
                renderInput={(params) => (
                <TextField
                    onChange={handleSearchFriendInput}
                    {...params}
                    label="Search a place"
                    InputProps={{
                    ...params.InputProps,
                    
                    endAdornment: <Container style={{display:"flex", marginRight:"1.2vw", maxWidth:"130px"}}><Button><TravelExploreIcon onClick={() => console.log("explore")} /> </Button>  <Divider orientation="vertical" flexItem /> <Button><GpsFixedIcon  onClick={() => console.log("gps")} /></Button></Container> 
                    }}
                />
                )}
            />
  
        </Paper>

    );


}

export default MapSearch;