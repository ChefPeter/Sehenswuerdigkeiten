import React from "react";
import "./styles/mapsearch.css";
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import { Paper, Fade, Button, TextField, Container, Chip, Box, Divider, Stack, Autocomplete, Slider, Typography, CircularProgress, IconButton } from "@mui/material";
import "./styles/mapsearch.css";
import { fontSize, minWidth } from "@mui/system";
import {useState , setState , useRef} from "react";
import {flyToLocation} from "./BaseMap";
import {setRadiusForPointerSearch} from "./BaseMap";
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AlignVerticalBottomIcon from '@mui/icons-material/AlignVerticalBottom';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import LandscapeIcon from '@mui/icons-material/Landscape';
import PeopleIcon from '@mui/icons-material/People';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import MuseumIcon from '@mui/icons-material/Museum';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import ChurchIcon from '@mui/icons-material/Church';
import {setFilter, changedFilter} from "./BaseMap";

let locationInput = "";
let timerID;

function MapSearch () {

    const [locations, setLocations] = useState([]);
    const [radiusValue, setRadiusValue] = useState(1);
    const [selectedCityCoords, setSelectedCityCoords] = useState([]);
    const [showLoading, setShowLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false)

    const [architecture, setArchitecture] = useState(true)
    const [culture, setCulture] = useState(true)
    const [churches, setChurches] = useState(true)
    const [historical, setHistorical] = useState(true)
    const [natural, setNatural] = useState(true)
    const [religion, setReligion] = useState(true)
    const [touristFacilities, setTouristFacilities] = useState(true)
    const [museums, setMuseums] = useState(true)
    const [palaces, setPalaces] = useState(true)
    const [malls, setMalls] = useState(true)

    const handleSearchFriendInput = async (event)=>{

        setSelectedCityCoords([]);

        clearTimeout(timerID)

        let jsonRes = "";
        let language = "de";

        if(event.target.value.length > 1){
            setShowLoading(true)
            //to limit api requests -> if user stops typing for 500 ms the api gets called, otherwise not
            timerID = setTimeout(async () => {

                let result = await fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/"+new URLSearchParams(event.target.value).toString().slice(0,-1)+".json?limit=10&proximity=ip&types=place%2Cpostcode%2Caddress%2Clocality%2Cneighborhood%2Cdistrict%2Ccountry&language="+language+"&access_token=pk.eyJ1IjoiemJhYWtleiIsImEiOiJja3pvaXJ3eWM0bnV2MnVvMTc2d2U5aTNpIn0.RY-K9qwZD1hseyM5TxLzww", {
                    method: "GET"
                });

                jsonRes = await result.json();
            
                let obj = [{}];
                let places = [], coords = [];
            
                for(let i = 0; i<jsonRes["features"].length-1; i++){

                    if(jsonRes["features"][i] != "undefined"){

                        if(jsonRes["features"][i]["place_name"] != undefined && jsonRes["features"][i]["center"] != undefined){
                            places[i] = jsonRes["features"][i]["place_name"];
                            coords[i] = jsonRes["features"][i]["center"];
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
                setShowLoading(false)
            }, 500)

        }else{
            setShowLoading(false)
        }
        
        locationInput = event.target.value;

    };



    function handleInputChange(event, value) { //on autocomplete click
    
        setSelectedCityCoords([]);
        locationInput = value;

        for(let i=0; i<locations.length; i++){
            if(locations[i].name == value){
                explore(value, locations[i].coords);
                return;
            }
        }

        explore()

    }

    async function explore(locationName, coords = null){

        let language = "de";

        if(coords === null){
            let jsonRes = "";
            //search for place on mapbox geocoding api to get coords
            let result = await fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/"+new URLSearchParams(locationName).toString().slice(0,-1)+".json?limit=1&proximity=ip&types=place%2Cpostcode%2Caddress%2Clocality%2Cneighborhood%2Cdistrict%2Ccountry&language="+language+"&access_token=pk.eyJ1IjoiemJhYWtleiIsImEiOiJja3pvaXJ3eWM0bnV2MnVvMTc2d2U5aTNpIn0.RY-K9qwZD1hseyM5TxLzww", {
                method: "GET"
            });

            jsonRes = await result.json();
            console.log(jsonRes)
            try{
            coords = jsonRes["features"][0]["center"];
            } catch (e){}
            
        }

        setLocations([])
        console.log(coords)

        if(coords != null){
            setSelectedCityCoords(coords);
            flyToLocation(coords, radiusValue, true)
        }
        
    }

    function getGPSLocation(){
        
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log("Latitude is :", position.coords.latitude);
            console.log("Longitude is :", position.coords.longitude);
            setSelectedCityCoords([position.coords.longitude, position.coords.latitude]);
            flyToLocation([position.coords.longitude, position.coords.latitude], radiusValue, true)
          });
       
    }

    function sliderChange(event, value){
        console.log("halo")
        console.log(selectedCityCoords)
        setRadiusValue(value);
        setRadiusForPointerSearch(value)
        if(selectedCityCoords.length !== 0){
            flyToLocation(selectedCityCoords, value, false);
        }
    }

  

    return (

        <Paper id="searchPaper" elevation={10} >

            <Autocomplete
                freeSolo
                id="idAutocomplete"
                fullWidth
                disableClearable
               
                onChange={handleInputChange} 
                options={locations.map((option) => option.name)}
                renderInput={(params) => (
                <TextField
                    onChange={handleSearchFriendInput}
                    {...params}
                    label="Search a city"
                    InputProps={{
                    ...params.InputProps,
                    endAdornment: <Container id="btnContainerSearchbar" style={{display:"flex", marginRight:"1.2vw", maxWidth:"130px"}}>  <Button onClick={() => explore(locationInput)} > {showLoading ? <CircularProgress size={25} /> :null} {!showLoading ? <TravelExploreIcon/> : null} </Button>  <Divider orientation="vertical" flexItem /> <Button onClick={() => getGPSLocation()}><GpsFixedIcon/></Button></Container> 
                    }}
                />
                )}
            />

        <Stack spacing={0.5} direction="row" sx={{ mb: 1 }} alignItems="center"><Typography
                marginTop={0.7}
                fontSize="small"
                marginLeft={"10px"}
                minWidth={"18.5ch"}
                marginBottom={0.7}
                >Searchradius: {radiusValue} km</Typography>
                

                <Slider 
                    step={1}
                    min={0.5}
                    max={100}
                    valueLabelDisplay="auto"
                    onChangeCommitted={sliderChange}
                    size="small">
                </Slider>

               <Button onClick={() => setShowDropdown(!showDropdown)}> <ArrowDropDownCircleIcon  /> </Button>

            </Stack>
            
            
            { showDropdown ? 
                <Fade in={showDropdown} timeout={200}>
                  <div style={{paddingLeft:"10px", paddingBottom:"10px", paddingRight:"10px"}}>
                    <Typography style={{marginLeft:"5px"}}>Filter</Typography>

                    <Chip style={{margin: "2.5px 2.5px 2.5px 2.5px", padding:"1px 1px 1px 1px"}} icon={<ApartmentIcon/>} variant={architecture ? "filled" : "outlined"} label="Architecture" onClick={() => handleClickArchitecture()} />
                    <Chip style={{margin: "2.5px 2.5px 2.5px 2.5px", padding:"1px 1px 1px 1px"}} icon={<AlignVerticalBottomIcon/>} variant={culture ? "filled" : "outlined"} label="Cultural" onClick={() => handleClickCulture()} />
                    <Chip style={{margin: "2.5px 2.5px 2.5px 2.5px", padding:"1px 1px 1px 1px"}} icon={<ChurchIcon/>} variant={churches ? "filled" : "outlined"} label="Churches" onClick={() => handleClickChurch()} />
                    <Chip style={{margin: "2.5px 2.5px 2.5px 2.5px", padding:"1px 1px 1px 1px"}} icon={<HistoryEduIcon/>} variant={historical ? "filled" : "outlined"} label="Historical" onClick={() => handleClickHistorical()} />
                    <Chip style={{margin: "2.5px 2.5px 2.5px 2.5px", padding:"1px 1px 1px 1px"}} icon={<LandscapeIcon/>} variant={natural ? "filled" : "outlined"} label="Natural" onClick={() => handleClickNatural()} />
                    <Chip style={{margin: "2.5px 2.5px 2.5px 2.5px", padding:"1px 1px 1px 1px"}} icon={<PeopleIcon/>} variant={religion ? "filled" : "outlined"} label="Religion" onClick={() => handleClickReligion()} />
                    <Chip style={{margin: "2.5px 2.5px 2.5px 2.5px", padding:"1px 1px 1px 1px"}} icon={<EmojiPeopleIcon/>} variant={touristFacilities ? "filled" : "outlined"} label="Tourist facilities" onClick={() => handleClickTouristFacilities()} />
                    <Chip style={{margin: "2.5px 2.5px 2.5px 2.5px", padding:"1px 1px 1px 1px"}} icon={<MuseumIcon/>} variant={museums ? "filled" : "outlined"} label="Museums" onClick={() => handleClickMuseums()} />
                    <Chip style={{margin: "2.5px 2.5px 2.5px 2.5px", padding:"1px 1px 1px 1px"}} icon={<AccountBalanceIcon/>} variant={palaces ? "filled" : "outlined"} label="palaces" onClick={() => handleClickPalaces()} />
                    <Chip style={{margin: "2.5px 2.5px 2.5px 2.5px", padding:"1px 1px 1px 1px"}} icon={<LocalMallIcon/>} variant={malls ? "filled" : "outlined"} label="malls" onClick={() => handleClickMalls()} />

                </div>
                </Fade>
            : null}

        </Paper>

    );



    //Function for Chips!!!
    function handleClickArchitecture(){
        //opposite way on purpose
        let s = !architecture;
        let obj = {architecture: s, cultural: culture, historic: historical, natural: natural, religion: religion, tourist_facilities: touristFacilities, museums: museums, palaces: palaces, malls: malls, churches: churches}
        setArchitecture(!architecture)
        setFilter(obj);   
        changedFilter();
    }
    function handleClickCulture(){
        let s = !culture;
        let obj = {architecture: architecture, cultural: s, historic: historical, natural: natural, religion: religion, tourist_facilities: touristFacilities, museums: museums, palaces: palaces, malls: malls, churches: churches}
        setCulture(!culture)
        setFilter(obj);  
        changedFilter();
    }

    function handleClickHistorical(){
        let s = !historical;
        let obj = {architecture: architecture, cultural: culture, historic: s, natural: natural, religion: religion, tourist_facilities: touristFacilities, museums: museums, palaces: palaces, malls: malls, churches: churches}
        setHistorical(!historical)
        setFilter(obj);  
        changedFilter();
    }
    function handleClickNatural(){
        let s = !natural;
        let obj = {architecture: architecture, cultural: culture, historic: historical, natural: s, religion: religion, tourist_facilities: touristFacilities, museums: museums, palaces: palaces, malls: malls, churches: churches}
        setNatural(!natural)
        setFilter(obj); 
        changedFilter();
    }
    function handleClickReligion(){
        let s = !religion;
        let obj = {architecture: architecture, cultural: culture, historic: historical, natural: natural, religion: s, tourist_facilities: touristFacilities, museums: museums, palaces: palaces, malls: malls, churches: churches}
        setReligion(!religion)
        setFilter(obj); 
        changedFilter();
    }
    function handleClickTouristFacilities(){
        let s = !touristFacilities;
        let obj = {architecture: architecture, cultural: culture, historic: historical, natural: natural, religion: religion, tourist_facilities: s, museums: museums, palaces: palaces, malls: malls, churches: churches}
        setTouristFacilities(!touristFacilities)
        setFilter(obj);  
        changedFilter();
    }
    function handleClickMuseums(){
        let s = !museums;
        let obj = {architecture: architecture, cultural: culture, historic: historical, natural: natural, religion: religion, tourist_facilities: touristFacilities, museums: s, palaces: palaces, malls: malls, churches: churches}
        setMuseums(!museums)
        setFilter(obj); 
        changedFilter();
    }
    function handleClickPalaces(){
        let s = !palaces;
        let obj = {architecture: architecture, cultural: culture, historic: historical, natural: natural, religion: religion, tourist_facilities: touristFacilities, museums: museums, palaces: s, malls: malls, churches: churches}
        setPalaces(!palaces)
        setFilter(obj);  
        changedFilter();
    }
    function handleClickMalls(){
        let s = !malls;
        let obj = {architecture: architecture, cultural: culture, historic: historical, natural: natural, religion: religion, tourist_facilities: touristFacilities, museums: museums, palaces: palaces, malls: s, churches: churches}
        setMalls(!malls)
        setFilter(obj);  
        changedFilter();
    }
    function handleClickChurch(){
        let s = !churches;
        let obj = {architecture: architecture, cultural: culture, historic: historical, natural: natural, religion: religion, tourist_facilities: touristFacilities, museums: museums, palaces: palaces, malls: malls, churches: s}
        setChurches(!churches)
        setFilter(obj);
        changedFilter();
    }

}




export default MapSearch;