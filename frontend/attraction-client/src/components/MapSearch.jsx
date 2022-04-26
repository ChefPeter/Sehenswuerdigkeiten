import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AlignVerticalBottomIcon from '@mui/icons-material/AlignVerticalBottom';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ChurchIcon from '@mui/icons-material/Church';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import LandscapeIcon from '@mui/icons-material/Landscape';
import LayersIcon from '@mui/icons-material/Layers';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import MuseumIcon from '@mui/icons-material/Museum';
import PeopleIcon from '@mui/icons-material/People';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { Autocomplete, Button, Chip, CircularProgress, Container, Divider, Fade, FormControlLabel, Paper, Slider, Stack, Switch, TextField, Tooltip, Typography } from "@mui/material";
import Zoom from '@mui/material/Zoom';
import React, { useEffect, useState } from "react";
import { changedFilter, flyToLocation, setFilter, setRadiusForPointerSearch } from "./BaseMap";
import "./styles/mapsearch.css";
import BoyIcon from '@mui/icons-material/Boy';

let locationInput = "";
let timerID;

function MapSearch (props) {

    const [locations, setLocations] = useState([]);
    const [radiusValue, setRadiusValue] = useState(1);
    const [currentRadiusValue, setCurrentRadiusValue] = useState(1);
    const [selectedCityCoords, setSelectedCityCoords] = useState([]);
    const [showLoading, setShowLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const [architecture, setArchitecture] = useState(true);
    const [culture, setCulture] = useState(true);
    const [churches, setChurches] = useState(true);
    const [historical, setHistorical] = useState(true);
    const [natural, setNatural] = useState(true);
    const [religion, setReligion] = useState(true);
    const [touristFacilities, setTouristFacilities] = useState(true);
    const [museums, setMuseums] = useState(true);
    const [palaces, setPalaces] = useState(true);
    const [malls, setMalls] = useState(true);
    const [monuments, setMonuments] = useState(true);

    const [languageTags, setLanguageTags] = useState({
                                                        searchText: "Search a city",
                                                        searchRadius: "Searchradius: ",
                                                        architectureText: "Architecture",
                                                        cultureText: "Culture",
                                                        churchesText: "Churches",
                                                        historicalText: "Historical",
                                                        naturalText: "Nature",
                                                        religionText: "Religion",
                                                        touristText: "Tourist facilities",
                                                        museumsText: "Museums",
                                                        palacesText: "Palaces",
                                                        mallsText: "Malls",
                                                        filterText: "Filter",
                                                        light: "Light",
                                                        dark: "Dark",
                                                        satellite: "Satellite",
                                                        tooltip3D: "Enables 3D Mode on the map. Zoom in and use CTRL + LEFT MOUSE BUTTON to see the results.",
                                                        monumentText: "Monuments"
    });
    
    //reacts only to language change
    useEffect(() => {
        
        if(props.l1 == "de"){

            setLanguageTags({
                            searchText: "Suche eine Stadt",
                            searchRadius: "Suchradius: ",
                            architectureText: "Architektur",
                            cultureText: "Kultur",
                            churchesText: "Kirchen",
                            historicalText: "Geschichte",
                            naturalText: "Natur",
                            religionText: "Religion",
                            touristText: "Touristisch",
                            museumsText: "Museen",
                            palacesText: "Paläste",
                            mallsText: "Einkaufszentren",
                            filterText: "Filter",
                            light: "Hell",
                            dark: "Dunkel",
                            satellite: "Satellit",
                            tooltip3D: "Aktiviert 3D-Modus auf der Karte. Zoomen Sie hinein und verwenden Sie STRG + LINKE MAUSTASTE, um Ergebnisse zu sehen.",
                            monumentText: "Monumente"
            });

        }else if(props.l1 == "it"){

            setLanguageTags({
                            searchText: "Cerca una città",
                            searchRadius: "Raggio di ricerca: ",
                            architectureText: "Architettura",
                            cultureText: "Cultura",
                            churchesText: "Chiese",
                            historicalText: "Storia",
                            naturalText: "Natura",
                            religionText: "Religione",
                            touristText: "Turismo",
                            museumsText: "Musei",
                            palacesText: "Palazzi",
                            mallsText: "Centri commerciali",
                            filterText: "Filtro",
                            light: "Luce",
                            dark: "Scuro",
                            satellite: "Satellite",
                            tooltip3D: "Attiva la modalità 3D sulla mappa. Zoomare in e usare CTRL + TASTO SINISTRO del mouse per vedere i risultati.",
                            monumentText: "Monumenti"
             });

        }else{

            setLanguageTags({
                            searchText: "Search a city",
                            searchRadius: "Searchradius: ",
                            architectureText: "Architecture",
                            cultureText: "Culture",
                            churchesText: "Churches",
                            historicalText: "Historical",
                            naturalText: "Nature",
                            religionText: "Religion",
                            touristText: "Tourist facilities",
                            museumsText: "Museums",
                            palacesText: "Palaces",
                            mallsText: "Malls",
                            filterText: "Filter",
                            light: "Light",
                            dark: "Dark",
                            satellite: "Satellite",
                            tooltip3D: "Enables 3D Mode on the map. Zoom in and use CTRL + LEFT MOUSE BUTTON to see the results.",
                            monumentText: "Monuments"
            });

        }
    }, [props.l1]);


    const handleSearchFriendInput = async (event)=>{

        setSelectedCityCoords([]);

        clearTimeout(timerID);

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
                setLocations(obj);
                setShowLoading(false);
            }, 500)

        }else{
            setShowLoading(false);
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
            flyToLocation(coords, radiusValue, true, props.showErrorSnack, props.currentlyLookingForPois);
        }
        
    }

    function sliderChange(){
        setRadiusValue(currentRadiusValue);
        setRadiusForPointerSearch(currentRadiusValue, props.showErrorSnack, props.currentlyLookingForPois);
        if(selectedCityCoords.length !== 0){
            flyToLocation(selectedCityCoords, currentRadiusValue, false, props.showErrorSnack, props.currentlyLookingForPois);
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
                    label={languageTags.searchText}
                    
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
                   
                  <Stack direction="row" sx={{ mb: 0, mt:0.7 }} alignItems="center">
                      <Typography
                        marginTop={1.2}
                        
                        marginLeft={"5px"}
                        minWidth={languageTags.searchRadius == "Raggio di ricerca: " ? "21ch" : "18.5ch"}
                
                        marginBottom={0.7}
                        >{languageTags.searchRadius} {radiusValue} km</Typography>
                        
                        <Slider 
                            style={{marginRight:"12px"}}
                            step={1}
                            min={0.5}
                            max={100}
                            value={currentRadiusValue}
                            valueLabelDisplay="auto"
                            onChange={(e) => setCurrentRadiusValue(e.target.value)}
                            onChangeCommitted={sliderChange}
                            size="small">
                        </Slider>

                    </Stack>
                    

                    <Divider  sx={{ mb: 1, mt:1}} />
                   
                   <div style={{display:"flex"}}>
                    <Chip className="attributeChipsOfSearchbar" icon={<LayersIcon fontSize="small" />} label={"Light"} variant={props.themeMap === "light" ? "filled" : "outlined"} onClick={() => props.setThemeMap("light")}></Chip>
                    <Chip className="attributeChipsOfSearchbar" icon={<LayersIcon fontSize="small" />} label={"Dark"} variant={props.themeMap === "dark" ? "filled" : "outlined"} onClick={() => props.setThemeMap("dark")}></Chip>
                    <Chip className="attributeChipsOfSearchbar" icon={<LayersIcon fontSize="small" />} label={"Satellite"} variant={props.themeMap === "satellite" ? "filled" : "outlined"} onClick={() => props.setThemeMap("satellite")}></Chip>
                    
                    <Tooltip placement="top" disableFocusListener enterTouchDelay={420}  title={languageTags.tooltip3D} TransitionComponent={Zoom} arrow>
                        <FormControlLabel
                            sx={{display: 'block',}}
                            control={
                                <Switch
                                sx={{ml:2}}
                                checked={props.enabled3D}
                                onChange={() => props.enable3D()}
                                name="switch3DMode"
                                color="primary"
                                />
                            }
                            label="3D"
                            />
                    </Tooltip>
                    </div>


                    <Divider  sx={{ mb: 1, mt:1}} />

                    <Typography style={{marginLeft:"5px", marginTop:"0px"}}>{languageTags.filterText}</Typography>

                    <Chip className="attributeChipsOfSearchbar" icon={<ApartmentIcon fontSize="small" />} variant={architecture ? "filled" : "outlined"} label={languageTags.architectureText} onClick={() => handleClickArchitecture()} />
                    <Chip className="attributeChipsOfSearchbar" icon={<AlignVerticalBottomIcon fontSize="small" />} variant={culture ? "filled" : "outlined"} label={languageTags.cultureText} onClick={() => handleClickCulture()} />
                    <Chip className="attributeChipsOfSearchbar" icon={<ChurchIcon fontSize="small" />} variant={churches ? "filled" : "outlined"} label={languageTags.churchesText} onClick={() => handleClickChurch()} />
                    <Chip className="attributeChipsOfSearchbar" icon={<HistoryEduIcon fontSize="small" />} variant={historical ? "filled" : "outlined"} label={languageTags.historicalText} onClick={() => handleClickHistorical()} />
                    <Chip className="attributeChipsOfSearchbar" icon={<LandscapeIcon fontSize="small" />} variant={natural ? "filled" : "outlined"} label={languageTags.naturalText} onClick={() => handleClickNatural()} />
                    <Chip className="attributeChipsOfSearchbar" icon={<PeopleIcon fontSize="small" />} variant={religion ? "filled" : "outlined"} label={languageTags.religionText} onClick={() => handleClickReligion()} />
                    <Chip className="attributeChipsOfSearchbar" icon={<EmojiPeopleIcon fontSize="small" />} variant={touristFacilities ? "filled" : "outlined"} label={languageTags.touristText} onClick={() => handleClickTouristFacilities()} />
                    <Chip className="attributeChipsOfSearchbar" icon={<MuseumIcon fontSize="small" />} variant={museums ? "filled" : "outlined"} label={languageTags.museumsText} onClick={() => handleClickMuseums()} />
                    <Chip className="attributeChipsOfSearchbar" icon={<AccountBalanceIcon fontSize="small" />} variant={palaces ? "filled" : "outlined"} label={languageTags.palacesText} onClick={() => handleClickPalaces()} />
                    <Chip className="attributeChipsOfSearchbar" icon={<LocalMallIcon fontSize="small" />} variant={malls ? "filled" : "outlined"} label={languageTags.mallsText} onClick={() => handleClickMalls()} />
                    <Chip className="attributeChipsOfSearchbar" icon={<BoyIcon fontSize="small" />} variant={monuments ? "filled" : "outlined"} label={languageTags.monumentText} onClick={() => handleMonumentClick()} />

                </div>
                </Fade>
            : null}

        </Paper>

    );

    //Function for Chips!!!
    function handleClickArchitecture(){
        //opposite way on purpose
        let s = !architecture;
        let obj = {architecture: s, cultural: culture, historic: historical, natural: natural, religion: religion, tourist_facilities: touristFacilities, museums: museums, palaces: palaces, malls: malls, churches: churches, monuments_and_memorials: monuments}
        setArchitecture(!architecture)
        setFilter(obj);   
        props.currentlyLookingForPois(true);
        changedFilter(false, props.showErrorSnack, props.currentlyLookingForPois);
    }
    function handleClickCulture(){
        let s = !culture;
        let obj = {architecture: architecture, cultural: s, historic: historical, natural: natural, religion: religion, tourist_facilities: touristFacilities, museums: museums, palaces: palaces, malls: malls, churches: churches, monuments_and_memorials: monuments}
        setCulture(!culture)
        setFilter(obj);  
        props.currentlyLookingForPois(true);
        changedFilter(false, props.showErrorSnack, props.currentlyLookingForPois);
    }

    function handleClickHistorical(){
        let s = !historical;
        let obj = {architecture: architecture, cultural: culture, historic: s, natural: natural, religion: religion, tourist_facilities: touristFacilities, museums: museums, palaces: palaces, malls: malls, churches: churches, monuments_and_memorials: monuments}
        setHistorical(!historical)
        setFilter(obj);  
        props.currentlyLookingForPois(true);
        changedFilter(false, props.showErrorSnack, props.currentlyLookingForPois);
    }
    function handleClickNatural(){
        let s = !natural;
        let obj = {architecture: architecture, cultural: culture, historic: historical, natural: s, religion: religion, tourist_facilities: touristFacilities, museums: museums, palaces: palaces, malls: malls, churches: churches, monuments_and_memorials: monuments}
        setNatural(!natural)
        setFilter(obj); 
        props.currentlyLookingForPois(true);
        changedFilter(false, props.showErrorSnack, props.currentlyLookingForPois);
    }
    function handleClickReligion(){
        let s = !religion;
        let obj = {architecture: architecture, cultural: culture, historic: historical, natural: natural, religion: s, tourist_facilities: touristFacilities, museums: museums, palaces: palaces, malls: malls, churches: churches, monuments_and_memorials: monuments}
        setReligion(!religion)
        setFilter(obj); 
        props.currentlyLookingForPois(true);
        changedFilter(false, props.showErrorSnack, props.currentlyLookingForPois);
    }
    function handleClickTouristFacilities(){
        let s = !touristFacilities;
        let obj = {architecture: architecture, cultural: culture, historic: historical, natural: natural, religion: religion, tourist_facilities: s, museums: museums, palaces: palaces, malls: malls, churches: churches, monuments_and_memorials: monuments}
        setTouristFacilities(!touristFacilities)
        setFilter(obj);  
        props.currentlyLookingForPois(true);
        changedFilter(false, props.showErrorSnack, props.currentlyLookingForPois);
    }
    function handleClickMuseums(){
        let s = !museums;
        let obj = {architecture: architecture, cultural: culture, historic: historical, natural: natural, religion: religion, tourist_facilities: touristFacilities, museums: s, palaces: palaces, malls: malls, churches: churches, monuments_and_memorials: monuments}
        setMuseums(!museums)
        setFilter(obj); 
        props.currentlyLookingForPois(true);
        changedFilter(false, props.showErrorSnack, props.currentlyLookingForPois);
    }
    function handleClickPalaces(){
        let s = !palaces;
        let obj = {architecture: architecture, cultural: culture, historic: historical, natural: natural, religion: religion, tourist_facilities: touristFacilities, museums: museums, palaces: s, malls: malls, churches: churches, monuments_and_memorials: monuments}
        setPalaces(!palaces)
        setFilter(obj);  
        props.currentlyLookingForPois(true);
        changedFilter(false, props.showErrorSnack, props.currentlyLookingForPois);
    }
    function handleClickMalls(){
        let s = !malls;
        let obj = {architecture: architecture, cultural: culture, historic: historical, natural: natural, religion: religion, tourist_facilities: touristFacilities, museums: museums, palaces: palaces, malls: s, churches: churches, monuments_and_memorials: monuments}
        setMalls(!malls)
        setFilter(obj);  
        props.currentlyLookingForPois(true);
        changedFilter(false, props.showErrorSnack, props.currentlyLookingForPois);
    }
    function handleClickChurch(){
        let s = !churches;
        let obj = {architecture: architecture, cultural: culture, historic: historical, natural: natural, religion: religion, tourist_facilities: touristFacilities, museums: museums, palaces: palaces, malls: malls, churches: s, monuments_and_memorials: monuments}
        setChurches(!churches)
        setFilter(obj);
        props.currentlyLookingForPois(true);
        changedFilter(false, props.showErrorSnack, props.currentlyLookingForPois);
    }
    function handleMonumentClick() {
        let s = !monuments;
        let obj = {architecture: architecture, cultural: culture, historic: historical, natural: natural, religion: religion, tourist_facilities: touristFacilities, museums: museums, palaces: palaces, malls: malls, churches: churches, monuments_and_memorials: s}
        setMonuments(!monuments)
        setFilter(obj);
        props.currentlyLookingForPois(true);
        changedFilter(false, props.showErrorSnack, props.currentlyLookingForPois);
    }



}

export default MapSearch;