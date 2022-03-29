import React from "react";
import "./styles/mapsearch.css";
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import { Paper, Button, TextField, Container, Card, Box, Divider, Stack, Autocomplete } from "@mui/material";
import "./styles/mapsearch.css";
import { fontSize } from "@mui/system";
import {useState , setState} from "react";

let locationInput = "";


function MapSearch () {

    const [locations, setLocations] = useState([])

    const handleSearchFriendInput = async (event)=>{

        let locations2 = [];
        let jsonRes = "";
        let language = "de";

        console.log(event.target.value)

        if(event.target.value.length > 2){

            let result = await fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/"+new URLSearchParams(event.target.value).toString().slice(0,-1)+".json?limit=10&proximity=ip&types=place%2Cpostcode%2Caddress%2Clocality%2Cneighborhood%2Cdistrict&language="+language+"&access_token=pk.eyJ1IjoiemJhYWtleiIsImEiOiJja3pvaXJ3eWM0bnV2MnVvMTc2d2U5aTNpIn0.RY-K9qwZD1hseyM5TxLzww", {
                method: "GET"
            });

            jsonRes = await result.json();
            console.log(jsonRes["features"])
            

            let obj = [{}];
            let places = [], coords = [];
        
            for(let i = 0; i<jsonRes["features"].length-1; i++){

                
                if(jsonRes["features"][i] != "undefined"){

                    if(jsonRes["features"][i]["place_name"] != undefined && jsonRes["features"][i]["center"] != undefined){
                        places[i] = jsonRes["features"][i]["place_name"];
                        coords[i] = jsonRes["features"][i]["place_name"];
                    }
                }
            }

            if(places[0] != undefined){
                obj = [{name: places[0], coords: coords[0]}]
            
                for(let i = 1; i<places.length; i++){

                    obj.push({
                        name: places[i],
                        coords: coords[i]
                    });
                }
            }else{
                obj = [{name: "", coords: ""}];
            }
            setLocations(obj)
        }

        locationInput = event.target.value;

    };




    return (

        <Paper id="searchPaper" elevation={10} >

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
                    label="Search a city"
                    InputProps={{
                    ...params.InputProps,
                    endAdornment: <Container id="btnContainerSearchbar" style={{display:"flex", marginRight:"1.2vw", maxWidth:"130px"}}><Button onClick={() => explore()} ><TravelExploreIcon/> </Button>  <Divider orientation="vertical" flexItem /> <Button onClick={() => console.log("gps")}><GpsFixedIcon/></Button></Container> 
                    }}
                />
                )}
            />

        </Paper>

    );
}

function explore(){

    console.log("explore")

}


export default MapSearch;