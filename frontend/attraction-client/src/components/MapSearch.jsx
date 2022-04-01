import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AlignVerticalBottomIcon from '@mui/icons-material/AlignVerticalBottom';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ChurchIcon from '@mui/icons-material/Church';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import LandscapeIcon from '@mui/icons-material/Landscape';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import MuseumIcon from '@mui/icons-material/Museum';
import PeopleIcon from '@mui/icons-material/People';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { Autocomplete, Button, Chip, CircularProgress, Container, Divider, Fade, Paper, Slider, Stack, TextField, Typography, Card } from "@mui/material";
import React, { useEffect, useState } from "react";
import { changedFilter, flyToLocation, setDirectionGlobally, setFilter, setRadiusForPointerSearch } from "./BaseMap";
import "./styles/mapsearch.css";

let locationInput = "";
let timerID;

function MapSearch (props) {

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

    const [searchText, setSearchText] = useState("Search a city");
    const [searchRadiusTag, setSearchRadiusTag] = useState("Searchradius: ")
    const [architectureTag, setArchitectureTag] = useState("Architecture");
    const [culturalTag, setCulturalTag] = useState("Culture");
    const [churchesTag, setChurchesTag] = useState("Churches");
    const [historicalTag, setHistoricalTag] = useState("Historical");
    const [naturalTag, setNaturalTag] = useState("Nature");
    const [religionTag, setReligionTag] = useState("Religion");
    const [touristTag, setTouristTag] = useState("Tourist facilities");
    const [museumsTag, setMuseumsTag] = useState("Museums");
    const [palacesTag, setPalacesTag] = useState("Palaces");
    const [mallsTag, setMallsTag] = useState("Malls");

    const[drivingTag, setDrivingTag] = useState("Driving");
    const[walkingTag, setWalkingTag] = useState("Walking");
    const[cyclingTag, setCyclingTag] = useState("Cycling");

    const [filterLanguage, setFilterLanguage] = useState("Filter")
    const [directionsMode, setDirectionsMode] = useState("driving");

    //reacts only to language change
    useEffect(() => {
        
        if(props.l1 == "de"){
            setSearchText("Suche eine Stadt");
            setSearchRadiusTag("Suchradius: ");
            setArchitectureTag("Architektur");
            setCulturalTag("Kultur");
            setChurchesTag("Kirchen");
            setHistoricalTag("Geschichte");
            setNaturalTag("Natur");
            setReligionTag("Religion");
            setTouristTag("Touristisch");
            setMuseumsTag("Museen");
            setPalacesTag("Paläste");
            setMallsTag("Einkaufszentren");
            setFilterLanguage("Filter");

            setDrivingTag("Auto")
            setWalkingTag("Zu Fuß")
            setCyclingTag("Rad")

        }else if(props.l1 == "it"){
            setSearchText("Cerca una città");
            setSearchRadiusTag("Raggio di ricerca: ");
            setArchitectureTag("Architettura");
            setCulturalTag("Cultura");
            setChurchesTag("Chiese");
            setHistoricalTag("Storia");
            setNaturalTag("Natura");
            setReligionTag("Religione");
            setTouristTag("Turismo");
            setMuseumsTag("Musei");
            setPalacesTag("Palazzi");
            setMallsTag("Centri commerciali");
            setFilterLanguage("Filtro");

            setDrivingTag("Auto")
            setWalkingTag("A Piedi")
            setCyclingTag("Bici")

        }else{
            setSearchText("Search a city");
            setSearchRadiusTag("Searchradius: ");
            setArchitecture("Architektur af walsch");
            setCulturalTag("Culture");
            setChurchesTag("Churches");
            setHistoricalTag("Historical");
            setNaturalTag("Nature");
            setReligionTag("Religion");
            setTouristTag("Tourist facilities");
            setMuseumsTag("Museums");
            setPalacesTag("Palaces");
            setMallsTag("Malls");
            setFilterLanguage("Filter");

            setDrivingTag("Driving")
            setWalkingTag("Walking")
            setCyclingTag("Cycling")
        }
    }, [props.l1]);


    const handleSearchFriendInput = async (event)=>{

        setSelectedCityCoords([]);

        clearTimeout(timerID)

        let jsonRes = "";
        let language = props.l1;
        if(language !== "de" && language !== "it" && language!== "en")
            language = "en";
        

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
   
        let language = props.l1;
        if(language !== "de" && language !== "it" && language!== "en")
            language = "en";

        if(coords === null){
            let jsonRes = "";
            //search for place on mapbox geocoding api to get coords
            let result = await fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/"+new URLSearchParams(locationName).toString().slice(0,-1)+".json?limit=1&proximity=ip&types=place%2Cpostcode%2Caddress%2Clocality%2Cneighborhood%2Cdistrict%2Ccountry&language="+language+"&access_token=pk.eyJ1IjoiemJhYWtleiIsImEiOiJja3pvaXJ3eWM0bnV2MnVvMTc2d2U5aTNpIn0.RY-K9qwZD1hseyM5TxLzww", {
                method: "GET"
            });

            jsonRes = await result.json();
          
            try{
                coords = jsonRes["features"][0]["center"];
            } catch (e){}
            
        }

        setLocations([])

        if(coords != null){
            setSelectedCityCoords(coords);
            flyToLocation(coords, radiusValue, true)
        }
        
    }

    function sliderChange(event, value){
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
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          explore(locationInput);
                          e.preventDefault();
                    }}}
                    onChange={handleSearchFriendInput}
                    {...params}
                    label={searchText}
                    InputProps={{
                    ...params.InputProps,
                    endAdornment: <Container id="btnContainerSearchbar" style={{display:"flex", marginRight:"1.2vw", maxWidth:"130px"}}>  <Button onClick={() => explore(locationInput)} > {showLoading ? <CircularProgress size={25} /> :null} {!showLoading ? <TravelExploreIcon/> : null} </Button>  <Divider orientation="vertical" flexItem /> <Button onClick={() => setShowDropdown(!showDropdown)}> {showDropdown ? <ArrowDropUpIcon /> : <ArrowDropDownIcon /> }</Button></Container> 
                    }}
                />
                )}
            />

        
            { showDropdown ? 
                <Fade in={showDropdown} timeout={222}>

                  <div style={{paddingLeft:"10px", paddingBottom:"10px", paddingRight:"10px"}}>
                   
                  <Stack direction="row" sx={{ mb: 0, mt:0.7 }} alignItems="center"><Typography
                                    marginTop={1.2}
                                    
                                    marginLeft={"5px"}
                                    minWidth={searchRadiusTag == "Raggio di ricerca: " ? "21ch" : "18.5ch"}
                            
                                    marginBottom={0.7}
                                    >{searchRadiusTag} {radiusValue} km</Typography>
                                    
                                    <Slider 
                                        style={{marginRight:"12px"}}
                                        step={1}
                                        min={0.5}
                                        max={100}
                                        valueLabelDisplay="auto"
                                        onChangeCommitted={sliderChange}
                                        size="small">
                                    </Slider>

                    </Stack>
                    

                    <Divider  sx={{ mb: 1, mt:1}} />
                   
                    <Chip style={{margin: "2.5px 2.5px 2.5px 2.5px", padding:"1.5px 1px 1px 1.5px"}} icon={<DirectionsCarFilledIcon fontSize="small" />} label={drivingTag} variant={directionsMode === "driving" ? "filled" : "outlined"} onClick={() => handleDirectionModeClick("driving")}></Chip>
                    <Chip style={{margin: "2.5px 2.5px 2.5px 2.5px", padding:"1.5px 1px 1px 1.5px"}} icon={<DirectionsWalkIcon fontSize="small" />} label={walkingTag} variant={directionsMode === "walking" ? "filled" : "outlined"} onClick={() => handleDirectionModeClick("walking")}></Chip>
                    <Chip style={{margin: "2.5px 2.5px 2.5px 2.5px", padding:"1.5px 1px 1px 1.5px"}} icon={<DirectionsBikeIcon fontSize="small" />} label={cyclingTag} variant={directionsMode === "cycling" ? "filled" : "outlined"} onClick={() => handleDirectionModeClick("cycling")}></Chip>
                    

                    <Divider  sx={{ mb: 1, mt:1}} />

                    <Typography style={{marginLeft:"5px", marginTop:"0px"}}>{filterLanguage}</Typography>

                    <Chip style={{margin: "2.5px 2.5px 2.5px 2.5px", padding:"1.5px 1px 1px 1.5px"}} icon={<ApartmentIcon fontSize="small" />} variant={architecture ? "filled" : "outlined"} label={architectureTag} onClick={() => handleClickArchitecture()} />
                    <Chip style={{margin: "2.5px 2.5px 2.5px 2.5px", padding:"1.5px 1px 1px 1.5px"}} icon={<AlignVerticalBottomIcon fontSize="small" />} variant={culture ? "filled" : "outlined"} label={culturalTag} onClick={() => handleClickCulture()} />
                    <Chip style={{margin: "2.5px 2.5px 2.5px 2.5px", padding:"1.5px 1px 1px 1.5px"}} icon={<ChurchIcon fontSize="small" />} variant={churches ? "filled" : "outlined"} label={churchesTag} onClick={() => handleClickChurch()} />
                    <Chip style={{margin: "2.5px 2.5px 2.5px 2.5px", padding:"1.5px 1px 1px 1.5px"}} icon={<HistoryEduIcon fontSize="small" />} variant={historical ? "filled" : "outlined"} label={historicalTag} onClick={() => handleClickHistorical()} />
                    <Chip style={{margin: "2.5px 2.5px 2.5px 2.5px", padding:"1.5px 1px 1px 1.5px"}} icon={<LandscapeIcon fontSize="small" />} variant={natural ? "filled" : "outlined"} label={naturalTag} onClick={() => handleClickNatural()} />
                    <Chip style={{margin: "2.5px 2.5px 2.5px 2.5px", padding:"1.5px 1px 1px 1.5px"}} icon={<PeopleIcon fontSize="small" />} variant={religion ? "filled" : "outlined"} label={religionTag} onClick={() => handleClickReligion()} />
                    <Chip style={{margin: "2.5px 2.5px 2.5px 2.5px", padding:"1.5px 1px 1px 1.5px"}} icon={<EmojiPeopleIcon fontSize="small" />} variant={touristFacilities ? "filled" : "outlined"} label={touristTag} onClick={() => handleClickTouristFacilities()} />
                    <Chip style={{margin: "2.5px 2.5px 2.5px 2.5px", padding:"1.5px 1px 1px 1.5px"}} icon={<MuseumIcon fontSize="small" />} variant={museums ? "filled" : "outlined"} label={museumsTag} onClick={() => handleClickMuseums()} />
                    <Chip style={{margin: "2.5px 2.5px 2.5px 2.5px", padding:"1.5px 1px 1px 1.5px"}} icon={<AccountBalanceIcon fontSize="small" />} variant={palaces ? "filled" : "outlined"} label={palacesTag} onClick={() => handleClickPalaces()} />
                    <Chip style={{margin: "2.5px 2.5px 2.5px 2.5px", padding:"1.5px 1px 1px 1.5px"}} icon={<LocalMallIcon fontSize="small" />} variant={malls ? "filled" : "outlined"} label={mallsTag} onClick={() => handleClickMalls()} />

                </div>
                </Fade>
            : null}

        </Paper>

    );

    function handleDirectionModeClick(mode){
        setDirectionsMode(mode);
        setDirectionGlobally(mode);
    }

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