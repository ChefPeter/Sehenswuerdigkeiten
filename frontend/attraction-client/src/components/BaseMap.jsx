import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsIcon from '@mui/icons-material/Directions';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import RouteIcon from '@mui/icons-material/Route';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, Card, Chip, CircularProgress, Drawer, OutlinedInput, Typography, Switch, Tooltip, FormControlLabel, Checkbox, Divider } from "@mui/material";
import mapboxgl from "mapbox-gl";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import MapSearch from "./MapSearch";
import Popup from "./Popup";
import "./styles/BaseMap.css";
import SuccessSnackbar from './SuccessSnackbar';
import Zoom from '@mui/material/Zoom';

const API_KEY = "pk.eyJ1IjoiemJhYWtleiIsImEiOiJja3pvaXJ3eWM0bnV2MnVvMTc2d2U5aTNpIn0.RY-K9qwZD1hseyM5TxLzww";

    let map;
    let marker;
    let testRoute = [];
    let radiusForPointerSearch = 1;
    let searchByMarker = false;
    let lastCoords = [];
    let lastRadius = 1;
    let filter = {architecture: true, cultural: true, historic: true, natural: true, religion: true, tourist_facilities: true, museums: true, palaces: true, malls: true, churches: true};
    let currentGlobalResults = [];
    let timerID;
    let globalPopup = "", globalPopup2 = "";
    let geolocate;
    let lastPosition;

    export function setFilter(newFilter){
        filter = newFilter;
    }

    function getRouteURL(type, coords, language)
    {
      return `https://api.mapbox.com/directions/v5/mapbox/${type}/${(new URLSearchParams(coords).toString()).slice(0,-1)}?alternatives=true&geometries=geojson&language=${language}&overview=simplified&steps=true&access_token=${API_KEY}`;
    }

    async function getDataFromURL(url)
    {
        let result = await fetch(url);
        let answer = null;
        if(result.ok)
        answer = await result.json();
        return answer;
    }


    export async function postRoute(data, directionMode, setDidCalculateRoute, setCurrentRouteOutput, setCurrentDurationInMinutes, setCurrentKilometers, setCurrentNotSortedPointsRouteOutput, setShowLoadingCircleRoute)
    {
        //makes no sense
        if(data.length < 2)
            return;
        
        setShowLoadingCircleRoute(true)
        let formData = new FormData();
        let route, sortedIDs;
    
        formData.append('points', JSON.stringify(data));
        formData.append('vehicle', directionMode);
        await fetch('http://localhost:5000/route', {
            method: 'post',
            body: formData,
            credentials: 'include',
        }).then(res => res.json())
            .then(res => {route = res.route; sortedIDs = res.sortedIDs});
        if (map.getSource('route1')) {
            map.removeLayer("layer1");
            map.removeSource('route1');
        }
        setDidCalculateRoute(true);
        setCurrentNotSortedPointsRouteOutput(data);
        setCurrentRouteOutput(sortedIDs)
        setCurrentDurationInMinutes(Math.round(route.duration / 60));
        setCurrentKilometers(Math.round(route.distance / 1000 * 10) / 10)
    
        
        map.addSource('route1', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': route.coords
                }
            }
        });
        map.addLayer({
            'id': 'layer1',
            'type': 'line',
            'source': 'route1',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': 'yellow',
                'line-width': 5
            }
        });
        setShowLoadingCircleRoute(false)
    }


function BaseMap (props) {
   
    const [addButtonTag, setAddButtonTag] = useState("ADD TO ROUTE");
    const [showAddButton, setShowAddButton] = useState(true);
    const [removeButtonTag, setRemoveButtonTag] = useState("REMOVE FROM ROUTE");
    const [searchHereTag, setSearchHereTag] = useState("SEARCH HERE?");
    const [openRouteDrawer, setOpenRouteDrawer] = useState(false);
    const [directionMode, setDirectionMode] = useState("driving");
    const [didCalculateRoute, setDidCalculateRoute] = useState(false)
    const [currentDurationInMinutes, setCurrentDurationInMinutes] = useState("-1")
    const [currentKilometers, setCurrentKilometers] = useState("-1")

    const[disableHandleRandomLocationButton,setDisableHandleRandomLocationButton] = useState(false);
    const[showLoadingCircleRoute, setShowLoadingCircleRoute] = useState(false)
    const[showSuccessSnack, setShowSuccessSnack] = useState(false)

    
    const [currentSortedPointsRouteOutput, setCurrentSortedPointsRouteOutput] = useState([]);
    const [currentNotSortedPointsRouteOutput, setCurrentNotSortedPointsRouteOutput] = useState([]);
    const [currentAddedPoints, setCurrentAddedPoints] = useState([]);

    const [currentRandomLocation, setCurrentRandomLocation] = useState(false);

    const[drivingTag, setDrivingTag] = useState("Driving");
    const[walkingTag, setWalkingTag] = useState("Walking");
    const[cyclingTag, setCyclingTag] = useState("Cycling");
    const[closeThisWindowTag, setCloseThisWindowTag] = useState("Close this window");
    const[errorNoRouteTag, setErrorNoRouteTag] = useState("Add at least 2 Points to calculate a Route!");
    const[errorNoRouteTagDescription, setErrorNoRouteTagDescription] = useState("If you can't see any points on your map try a new search and adjust your radius and filters. If you still can't see anything it might be that there are no POIs in that area!");
    const[deleteHoleRouteButtonTag, setDeleteHoleRouteButtonTag] = useState("Delete the hole route!")
    const[yourPointsTag, setYourPointsTag] = useState("Current Points");
    const[currentRouteTag, setCurrentRouteTag] = useState("Current Route");
    const[minutesTag, setMinutesTag] = useState("Minutes");
    const[routeNameTag, setRouteNameTag] = useState("Route name");
    const[calculateBestRouteButtonTag, setCalculateBestRouteButtonTag] = useState("CALCULATE BEST ROUTE");

    console.log("...............")
    console.log(currentAddedPoints)
    console.log(testRoute)
    console.log("...............")


    useEffect(() =>{
        

        if(props.l1 === "de"){
            setAddButtonTag("ZUR ROUTE HINZUFÜGEN");
            setRemoveButtonTag("VON ROUTE LÖSCHEN");
            setSearchHereTag("HIER SUCHEN?");
            setDrivingTag("Auto");
            setWalkingTag("Zu Fuß");
            setCyclingTag("Rad");
            setCloseThisWindowTag("Dieses Fenster schließen");
            setErrorNoRouteTag("Füge mindestens 2 Sehenswürdigkeiten hinzu, um eine Route zu berechnen!")
            setErrorNoRouteTagDescription("Wenn du keine Punkte sehen kann, probiere es mit einer neuen Suche mit angepasstem Radius und Filtern auf der Karte. Solltest du dann immer noch nichts sehen sind in diesem Bereich keine Sehenswürdigkeiten verfügbar!");
            setDeleteHoleRouteButtonTag("KOMPLETTE ROUTE LÖSCHEN!");
            setYourPointsTag("Aktuelle Punkte");
            setCurrentRouteTag("Aktuelle Route");
            setMinutesTag("Minuten");
            setRouteNameTag("Routenname");
            setCalculateBestRouteButtonTag("OPTIMALE ROUTE BERECHNEN");
        }else if(props.l1 === "it"){
            setAddButtonTag("AGGIUNGI AL itinerario");
            setRemoveButtonTag("RIMUOVERE DAl itinerario");
            setSearchHereTag("CERCARE QUI?");
            setDrivingTag("In macchina");
            setWalkingTag("A Piedi");
            setCyclingTag("Bici");
            setCloseThisWindowTag("Chiudere questa finestra");
            setErrorNoRouteTag("Aggiungi almeno 2 punti per calcolare un percorso!")
            setErrorNoRouteTagDescription("Se non riesci a vedere nessun punto sulla tua mappa, prova una nuova ricerca e regola il raggio e i filtri. Se ancora non vedi nulla, potrebbe essere che non ci sono POI in quella zona!");
            setDeleteHoleRouteButtonTag("Elimina tutto il percorso!");
            setYourPointsTag("Punti correnti");
            setCurrentRouteTag("Percorso attuale");
            setMinutesTag("Minuti");
            setRouteNameTag("Nome del percorso");
            setCalculateBestRouteButtonTag("CALCOLA IL PERCORSO OTTIMALE");
        }else{
            setAddButtonTag("ADD TO ROUTE");
            setRemoveButtonTag("REMOVE FROM ROUTE");
            setSearchHereTag("SEARCH HERE?")
            setDrivingTag("Driving")
            setWalkingTag("Walking")
            setCyclingTag("Cycling")
            setCloseThisWindowTag("Close this window");
            setErrorNoRouteTag("Add at least 2 Points to calculate a Route!")
            setErrorNoRouteTagDescription("If you can't see any points on your map try a new search and adjust your radius and filters. If you still can't see anything it might be that there are no POIs in that area!");
            setDeleteHoleRouteButtonTag("Delete the hole route!");
            setYourPointsTag("Current Points");
            setCurrentRouteTag("Current Route");
            setMinutesTag("Minutes");
            setRouteNameTag("Route name");
            setCalculateBestRouteButtonTag("CALCULATE OPTIMAL ROUTE");
        }

    },[props.l1]);

    //mapbox://styles/mapbox/satellite-v9
    //mapbox://styles/mapbox/light-v10
    let theme = "mapbox://styles/mapbox/navigation-night-v1";
    let imageSrc = "";

    const [open, setOpen] = useState(false);
    const [image, setImage] = useState("");
    const[showLoadingInsteadPicture, setShowLoadingInsteadPicture] = useState(true);

    mapboxgl.accessToken = "pk.eyJ1IjoiemJhYWtleiIsImEiOiJja3pvaXJ3eWM0bnV2MnVvMTc2d2U5aTNpIn0.RY-K9qwZD1hseyM5TxLzww";

   // const mapContainerRef = useRef(null);
    const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }));
        
    const [obj, setObj] = useState({properties: {name: 'test'}});
    const [markerCoords, setMarkerCoords] = useState([]);
    const [userEnabledLocation, setUserEnabledLocation] = useState(false);

    const Popup2 = ({ feature2 }) => {
        const { } = feature2;

        return (
            <div></div>
        );
    };


useEffect(() => {
        
        //Brixen
        let coordinates = [11.65598, 46.71503];
        lastCoords = coordinates;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                coordinates = [position.coords.longitude, position.coords.latitude];
            });
        }


        map = new mapboxgl.Map({
            container: "mapContainer",
            center: coordinates,
            style: theme,
            zoom: 12,
        });

        map.addControl(new mapboxgl.ScaleControl({ position: 'bottom-left' }));    
    
        geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true,
            // Draw an arrow next to the location dot to indicate which direction the device is heading.
            showUserHeading: true
        });

        geolocate.on('geolocate', function(e) {
            var lon = e.coords.longitude;
            var lat = e.coords.latitude;
            lastCoords = [lon, lat];
            console.log("position: " +  e.coords.longitude);
        });

        map.addControl(geolocate);
        
       
        lastCoords = coordinates;
        map.on("load", () => {
            map.flyTo({
                center: coordinates,
                essential: true // this animation is considered essential with respect to prefers-reduced-motion
            });

            map.loadImage('https://img.icons8.com/color/344/marker--v1.png',
                function (error, image) {
                    if (error) throw error;
                    map.addImage('marker--v1', image);
                }
            );

            // add the data source for new a feature collection with no features
            map.addSource("random-points-data", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: []
                }
            });
            
            // now add the layer, and reference the data source above by name
            map.addLayer({
                id: "random-points-layer",
                source: "random-points-data",
                type: "symbol",
                layout: {
                    // full list of icons here: https://labs.mapbox.com/maki-icons
                    "icon-image": "marker--v1", // this will put little croissants on our map
                    "icon-padding": 0,
                    "icon-allow-overlap": true,
                    "icon-size": 0.08
                }
            });
        });

        map.on("moveend", async () => {
            // get new center coordinates
            let lon = coordinates[1];
            let lat = coordinates[0];
            /*lon = "12.4907795";
            lat = "41.8897653"*/
            // fetch new data

        });



        // change cursor to pointer when user hovers over a clickable feature
        map.on("mouseenter", "random-points-layer", async e => {

            
            if (e.features.length) {
                setShowLoadingInsteadPicture(true);
                var UserAgent = navigator.userAgent.toLowerCase();

                // Nur beim Computer
                if (UserAgent.search(/(iphone|ipod|opera mini|fennec|palm|blackberry|android|symbian|series60)/) < 0) {

                    const feature = e.features[0];

                    // create popup node
                    setImage("");
                    try{
                        imageSrc = `https://commons.wikimedia.org/wiki/Special:FilePath/${(await getDataFromURL(`https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&entity=${feature.properties.wikidata}&format=json&origin=*`)).claims.P18[0].mainsnak.datavalue.value.replace(/\s/g, "_")}?width=300`;
                        if(imageSrc != undefined)
                        setImage(imageSrc);
                    }catch(e){}
                    
                    setShowLoadingInsteadPicture(false);    
                    const popupNode = document.createElement("div");

                    ReactDOM.render(<Popup feature={feature} />, popupNode);
                    ReactDOM.render(<div><img src={imageSrc} alt="" style={{ width: "100%", height: "50%" }}></img>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><p style={{ color: 'black' }}>{feature.properties.name}</p>
                        </div></div>, popupNode);

                    //popupNode  = document.createElement("div");
                    // set popup on map

                    popUpRef.current
                        .setLngLat(feature.geometry.coordinates)
                        .setDOMContent(popupNode)
                        .addTo(map);

                }
            }
        });


        // reset cursor to default when user is no longer hovering over a clickable feature
        map.on("mouseleave", "random-points-layer", () => {
            //mapboxgl-popup-close-button
            popUpRef.current.remove();
        });

        // add popup when user clicks a point
        map.on("click", "random-points-layer", e => {
            if (e.features.length) {
                setObj(e.features[0]);
                console.log(e.features[0]);
                setShowAddButton(!pointIsInRoute(e["features"][0]["properties"]["id"]));
                setOpen(true);
            }
        });

        map.on("dblclick", async e => {

            const feature2 = e;
            let coords = [e.lngLat.lng, e.lngLat.lat]

            let popupNode  = document.createElement("div");
            ReactDOM.render(<Popup2 feature2={feature2} />, popupNode);
            ReactDOM.render(<div><Button variant="contained" onClick={() => handleSearchByMarkerButton(coords, radiusForPointerSearch)} >Search here?</Button></div>, popupNode);

            // set popup on map
            popUpRef.current
                .setLngLat(coords)
                .setDOMContent(popupNode)
                .addTo(map);

        });

        marker = new mapboxgl.Marker();

        function handleSearchByMarkerButton(markerCoords, radiusForPointerSearch) {
            if(globalPopup2 !== ""){
                globalPopup2.remove()
                globalPopup2 = "";
            }
            
            lastCoords = markerCoords;

            searchByMarker = true;

            popUpRef.current.remove();
            add_marker(markerCoords);

            flyToLocation(markerCoords, radiusForPointerSearch, false)
        }

        function add_marker(coords) {
            setMarkerCoords(coords)
            marker.setLngLat(coords).addTo(map);
            globalPopup = marker;
        }
        map.doubleClickZoom.disable()
        //map.on('dblclick', add_marker);
    

},[]);


    function pointIsInRoute(id){
        console.log("----------")
        console.log(testRoute)
        console.log("----------")
        if (testRoute.some(item => item["properties"]["id"]===id)) 
            return true;
        return false;
    }

    function locationButtonClick(){
        
        geolocate._geolocateButton.click();

    }

    function removePointFromRouteButtonClicked(obj){
        removePointFromRoute(obj["properties"]["id"]);
        setShowAddButton(true);
    }
    function removePointFromRoute(id)
    {
       let index = null;
        for(let i = 0; i<testRoute.length; i++){
            if(id===testRoute[i]["properties"]["id"]){
                index=i;
                break;
            }
        }
        if(index !== null)
            testRoute.splice(index,1)
            
        setCurrentAddedPoints(testRoute);
    }

    function addPointToRouteButtonClicked(obj){
        //first check if object isnt already in the route!
        for(let i = 0; i<testRoute.length; i++)
            if(obj["properties"]["id"]===testRoute[i]["properties"]["id"])
                return;

        testRoute.push(obj);
        setShowAddButton(false);
        setCurrentAddedPoints(testRoute);
    }

    const handleRemoveItem = (key) => {
        removePointFromRoute(key)
       /* testRoute = currentAddedPoints.filter(item => item["properties"]["id"] !== key);*/
        setCurrentAddedPoints(currentAddedPoints.filter(item => item["properties"]["id"] !== key));
    };

    function deleteHoleRoute(){
        setCurrentAddedPoints([])
        testRoute = [];
        setDidCalculateRoute(false)
        setCurrentSortedPointsRouteOutput([]);
        setCurrentNotSortedPointsRouteOutput([]);
        if (map.getSource('route1')) {
            map.removeLayer("layer1");
            map.removeSource('route1');
        }
        console.log(testRoute)
        console.log(currentAddedPoints)
    }

    function saveCurrentRouteToDatabase(){

        console.log("lol")

    }

    async function handleRandomLocationButton(){

        setDisableHandleRandomLocationButton(true);
        setOpenRouteDrawer(false);
        const resultRandomLocation = await fetch("http://localhost:5000/get-random-location", {
            method: "get",
            credentials:"include"
        })
            
        let randomLocation = (await resultRandomLocation.json());
        console.log(randomLocation)
        setCurrentRandomLocation(randomLocation[2]);
        setShowSuccessSnack(true)
        flyToLocation ([randomLocation[0], randomLocation[1]], 100, true);
        setDisableHandleRandomLocationButton(false);

    }

    function handlePointListClick(obj){
        console.log(obj)
        setObj(obj);
        setOpen(true);
    }
     
    const PointList = () => (
        <div>
            {currentAddedPoints.map((item,i) => {
                return (

                    <Card key={i} sx={{mt:1.5, ml:1, mr:1, pt:0.65, pb:0.65}} elevation={3} style={{display:"flex", justifyContent:"space-between", borderRadius:"15px"}}>
                       <Box key={i} onClick={() => handlePointListClick(item)} style={{maxWidth:"80%"}}  sx={{mt:1, mb:1}}> <Typography fullWidth style={{margin:"auto", marginLeft:"10px",  overflowWrap:"break-word"}}>{i+1}. {item["properties"]["name"]}</Typography>  </Box>
                        <Button style={{minHeight: "42px", minWidth:"50px", maxHeight:"42px", margin:"auto", marginLeft:"15px", marginRight:"10px",  borderRadius:"15px"}} 
                            key={item["properties"]["id"]} color="error" variant="contained"
                            onClick={ () => handleRemoveItem(item["properties"]["id"])}>
                            <DeleteIcon />
                        </Button>
                    </Card>
                );
            })}
        </div>
    );

      const ShowIfEnoughPoints = (props) => {
            return(
                <div>
                    <Card  sx={{mt:1.5, ml:1, mr:1}} >
                            <OutlinedInput
                                id="outlined-adornment-weight"
                                fullWidth
                                placeholder={routeNameTag}
                                onChange={(e) => console.log(e.value)}
                                endAdornment={<Button onClick={() => saveCurrentRouteToDatabase()}><SaveIcon/></Button>}
                            
                                
                                inputProps={{
                                'aria-label': 'weight',}}/>
                    </Card>
                    
                    <Box  sx={{mt:2, ml:1, mr:1}}>
                        <Button variant="contained" sx={{minHeight: 50}} fullWidth disabled={showLoadingCircleRoute} onClick={() => postRoute(currentAddedPoints, directionMode, setDidCalculateRoute, setCurrentSortedPointsRouteOutput, setCurrentDurationInMinutes, setCurrentKilometers, setCurrentNotSortedPointsRouteOutput, setShowLoadingCircleRoute)}>
                            <RouteIcon />{calculateBestRouteButtonTag} 
                        </Button>
                    </Box>
                   
                    <Card sx={{mt:2, ml:1, mr:1, pl:1,pt:1,pb:1,pr:1, mb:1.2}} elevation={5} style={{ borderRadius:"8px"}}>        
                    
                        <Box style={{display:"flex", justifyContent:"space-evenly", flexWrap: "wrap"}}>
                            <Tooltip placement="top" title="If you activate this setting your starting point will also be your end point!" TransitionComponent={Zoom} arrow>
                                <FormControlLabel
                                    sx={{display: 'block',}}
                                    onMouseOver={() => console.log("mouse!!")}
                                    onMouseLeave={() => console.log("leave")}
                                    control={
                                        <Switch
                                        checked={false}
                                        
                                        onChange={() => console.log("hal")}
                                        name="loading"
                                        color="primary"
                                        />
                                    }
                                    label="Return to start point"
                                    />
                            </Tooltip>
                            <Tooltip placement="top" title="If you activate this setting you will start at your current gps location!" TransitionComponent={Zoom} arrow>
                                <FormControlLabel
                                    sx={{display: 'block',}}
                                    control={
                                        <Switch
                                        checked={false}
                                        onChange={() => console.log("hal")}
                                        name="loading"
                                        color="primary"
                                        />
                                    }
                                    label="Start at my current position"
                                    />
                                </Tooltip>
                        </Box>

                        <Box style={{display:"flex", justifyContent:"space-evenly", flexWrap: "wrap"}}>
                            <Chip className="attributeChipsOfSearchbar" style={{minWidth:"25%", minHeight:"35px"}} icon={<DirectionsCarFilledIcon fontSize="small" />} label={drivingTag} variant={directionMode === "driving" ? "filled" : "outlined"} onClick={() => setDirectionMode("driving")} ></Chip>
                            <Chip className="attributeChipsOfSearchbar" style={{minWidth:"25%",  minHeight:"35px"}} icon={<DirectionsWalkIcon fontSize="small" />} label={walkingTag} variant={directionMode === "walking" ? "filled" : "outlined"} onClick={() => setDirectionMode("walking")}></Chip>
                            <Chip className="attributeChipsOfSearchbar" style={{minWidth:"25%",  minHeight:"35px"}} icon={<DirectionsBikeIcon fontSize="small" />} label={cyclingTag} variant={directionMode === "cycling" ? "filled" : "outlined"} onClick={() => setDirectionMode("cycling")}></Chip>
                        </Box>

                    </Card>   
                    {showLoadingCircleRoute ?
                        <Card sx={{mt:2, ml:1, mr:1, pl:1,pt:1,pb:1,pr:1, mb:1.5}} elevation={0} style={{ borderRadius:"8px", display:"flex", justifyContent:"space-evenly"}}>   
                            <CircularProgress size={40} color='grey' /> 
                        </Card>
                    : null }

                    { didCalculateRoute ?
                    <div>
                        <Card sx={{ mb:3, ml:1, mr:1, pt:1, pb:0.5}} style={{borderRadius:"8px"}} elevation={4}>
                            <Typography variant='body1' fontWeight={400} sx={{mt:1, mb:1}} style={{maxWidth:"90%", margin:"auto", marginLeft:"10px", marginBottom:"5px"}}><strong>{currentRouteTag}:</strong> {currentDurationInMinutes} {minutesTag}, {currentKilometers}km, {currentSortedPointsRouteOutput.length-1} POIs</Typography>
                            <SortedRouteNames></SortedRouteNames>
                        </Card>
                      
                        </div>
                     : null}

                    <Card sx={{ mb:1.5, ml:1, mr:1, pt:0.5, pb:0.5, mt:4}} style={{ borderRadius:"8px"}} elevation={5}><Typography variant='h6' fontWeight={500} sx={{mt:0.8, mb:0.8}} style={{maxWidth:"90%", margin:"auto", marginLeft:"10px"}}>{yourPointsTag}</Typography></Card>

                    <PointList></PointList>
                        
                        <Box  sx={{mt:5, ml:1, mr:1, mb: 1}}>
                            <Button color="error" fullWidth variant="contained" onClick={() => deleteHoleRoute()}><DeleteIcon />{deleteHoleRouteButtonTag}</Button>
                        </Box>  
                </div>
            );
      }

      const SortedRouteNames = () => (
          <div>  
        {currentSortedPointsRouteOutput.map((item,i) => {
            
            return (
                <div>
                    <Typography sx={{ml:1, mr:1}}><strong> {i+1}.</strong> {item.name}</Typography>
                    {i < currentSortedPointsRouteOutput.length-1 ? <Typography style={{height:"22.5px"}} sx={{ml:0.9}} ><ArrowCircleDownIcon fontSize='small'/></Typography> : <Typography sx={{mb:1}} ></Typography>}
                    
                </div>
            );
        })}
        </div>
    );

      const ShowIfNotEnoughPoints = () => {
        return(
            <div>
                <Card sx={{mt:3, mb:1.5, ml:1, mr:1, pt:0.5, pb:0.5}} style={{border:"solid grey 0.5px", borderRadius:"8px"}} elevation={7}><Typography variant='h6' fontWeight={500} sx={{mt:1, mb:1}} style={{maxWidth:"90%", margin:"auto", marginLeft:"10px"}}>{errorNoRouteTag}</Typography>
                    <Typography variant='body1' fontWeight={400} sx={{mt:1, mb:1}} style={{maxWidth:"90%", margin:"auto", marginLeft:"10px"}}>{errorNoRouteTagDescription}</Typography>
                </Card>
                <Box  sx={{mt:2, ml:1, mr:1}}>
                    <Button variant="contained" sx={{minHeight: 50}} fullWidth onClick={() => setOpenRouteDrawer(false)}>{closeThisWindowTag}</Button>  
                </Box>
            </div>
        );
      }

      const handleCloseSuccessSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setShowSuccessSnack(false);
      };

    return (
    
        <div>
            <div id="mapContainer" className="map"></div>
            <div id="navi" style={{ marginLeft: "3.625em", minWidth:"30vw", maxWidth:"2.625em"}}>
            <MapSearch l1={props.l1} directionMode={directionMode} setDirectionMode={setDirectionMode}></MapSearch>
            
            <div  id="test" style={{position: "fixed",top: "calc(100% - 150px)", left:"calc(100vw - 75px)"}}>
               
                <Button style={{width:"60px", height:"60px", backgroundColor:"white", borderRadius:"42%"}} variant="filled" onClick={() => setOpenRouteDrawer(!openRouteDrawer)}><DirectionsIcon fontSize="large" style={{color:"#2979ff"}} /></Button>
                <Button style={{width:"60px",marginTop:"15px", height:"60px", backgroundColor:"white", borderRadius:"42%"}} variant="filled"  onClick={() => locationButtonClick()}><GpsFixedIcon  style={{color:"#2979ff"}} fontSize="large" /></Button>
            </div>

          </div>
            <Drawer 
                anchor='bottom'
                transitionDuration	= {280}
                
                open={open}
                onClose={() => setOpen(!open)}>
                    <div style={{maxHeight:"60vh", minHeight:"200px"}}>
                        <div style={{width:"100%", maxHeight:"30%", maxWidth:"100%", marginTop:"20px", display:"flex", alignItems:"center", justifyContent:"center"}}>
                        <div>
                            <div> 
                                {showAddButton ? <Button variant="contained" style={{marginBottom:"10px"}}  endIcon={<SendIcon />} onClick={() => addPointToRouteButtonClicked(obj)}>{addButtonTag}</Button> : <Button variant="contained" startIcon={<DeleteIcon />} style={{marginBottom:"10px"}} onClick={() => removePointFromRouteButtonClicked(obj)}>{removeButtonTag}</Button>}
                                <h2 id="nameField" style={{marginBottom:"10px"}}>{obj.properties.name}</h2>
                            </div>
                            <div  style={{display:"flex", justifyContent:"center"}}> {showLoadingInsteadPicture ? <CircularProgress /> : <img src={image} alt="" style={{maxWidth:"100%", marginBottom:"20px"}}></img>}</div>
                        </div>
                        </div>
                    </div>

            </Drawer>
         
            <Drawer 
                anchor='right'
                transitionDuration	= {280}
                open={openRouteDrawer}
                onClose={() => setOpenRouteDrawer(!openRouteDrawer)}>
                    
                    <div id="routeSwipeableDrawerDiv" >
            
                        {currentAddedPoints.length > 0 || currentSortedPointsRouteOutput.length > 1 ? <ShowIfEnoughPoints didCalculateRoute={didCalculateRoute} /> : <ShowIfNotEnoughPoints />}
                    
                        <Box  sx={{mt:2, ml:1, mr:1}}>
                            <Button variant="contained" disabled={disableHandleRandomLocationButton} sx={{minHeight: 50}} fullWidth onClick={() => handleRandomLocationButton()}>Explore a random location!</Button>
                        </Box>
                    
                    </div>

                    
                 
            </Drawer>
            <SuccessSnackbar openSuccessSnack={showSuccessSnack} successMessage={"You fly to: " + currentRandomLocation} handleClose={handleCloseSuccessSnackbar}></SuccessSnackbar>
        </div>
    );
};

async function getLocationData(lon, lat, radius, filters)
{
    // console.log(lon + "  " + lat + "  " + radius)
    let locationData = new FormData();
    let data;
    locationData.append('radius', radius);
    locationData.append('lat', lat);
    locationData.append('lon', lon);
    locationData.append('filters', JSON.stringify(filters));

    await fetch('http://localhost:5000/sights', {
        method: 'post',
        body: locationData,
        credentials: 'include',
    }).then(res => res.json())
    .then(res => data = res);

    return {type: "FeatureCollection",features: data,};

}

export async function flyToLocation (coords, radius, newCoordinates = false){
    
    let locationData = new FormData();

    if(newCoordinates){
        lastCoords = coords;
        if(globalPopup !== ""){
            globalPopup.remove()
            globalPopup = "";
        }
        if(globalPopup2 !== ""){
            globalPopup2.remove()
        }
        let marker2 = new mapboxgl.Marker();
        // setMarkerCoords(coords)
        marker2.setLngLat(coords).addTo(map);
        globalPopup2 = marker2;

    }else{
        coords = lastCoords;
    }

    let z = 12;
    
    //zoom basesd on radius -> could need some work
    if(radius < 5){z = 14}else if(radius < 10){z = 10.3}else if(radius < 15){z = 9.9}else if(radius < 20){z = 9.1}else if(radius < 25){z = 8.8}else if(radius < 30){z = 8.5}else if(radius < 35){z = 8.4}else if(radius < 40){z = 8.2}else if(radius < 45){z = 8}else if(radius < 50){z = 7.9}else if(radius < 55){z = 7.75}else if(radius < 60){z = 7.55}else if(radius < 65){z = 7.4}else if(radius < 70){z = 7.3}else if(radius < 75){z = 7.2}else if(radius < 80){z = 7.1}else if(radius < 85){z = 7}else if(radius < 90){z = 6.9}else if(radius < 95){z = 6.85}else if(radius <= 100){z = 6.8}
    
    map.flyTo({
        center: [
        coords[0],
        coords[1]
        ],
        zoom: z,
        speed: 1.5,
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
    });


    lastRadius = radius;

    //const results1 = await fetchFakeData({ longitude: coords[0], latitude: coords[1], radius2: radius, filterToUse: filter });
    const results = await getLocationData(coords[0], coords[1], radius, filter);
    
    currentGlobalResults = results;
    // update "random-points-data" source with new data
    // all layers that consume the "random-points-data" data source will be updated automatically
    map.getSource("random-points-data").setData(results);
}

//new Request has to be made
export async function changedFilter(coords = false){
    
    clearTimeout(timerID)

    //on filterchange call api only every 1 second 
    //(otherwise there would betoo many requests to the api if someone spams filter buttons)
    timerID = setTimeout(async () => {

        if(!coords){
            if(lastCoords.length === 0)
                return;
            else
                coords = lastCoords;
        }
        
        const results = await getLocationData(coords[0], coords[1], lastRadius, filter);
        currentGlobalResults = results;
    
        // update "random-points-data" source with new data
        // all layers that consume the "random-points-data" data source will be updated automatically
        map.getSource("random-points-data").setData(results);
    }, 900)


}


export function setRadiusForPointerSearch (newRadius){
    radiusForPointerSearch = newRadius;
    if(searchByMarker)
    flyToLocation(lastCoords, radiusForPointerSearch, false)
}

export default BaseMap;