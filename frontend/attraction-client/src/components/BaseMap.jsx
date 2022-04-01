import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsIcon from '@mui/icons-material/Directions';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import SendIcon from '@mui/icons-material/Send';
import { Button, Card, Box, Container, Drawer, SwipeableDrawer, OutlinedInput, InputAdornment, Typography, Divider } from "@mui/material";
import mapboxgl from "mapbox-gl";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import MapSearch from "./MapSearch";
import Popup from "./Popup";
import "./styles/BaseMap.css";
import SaveIcon from '@mui/icons-material/Save';
import RouteIcon from '@mui/icons-material/Route';

const API_KEY = "pk.eyJ1IjoiemJhYWtleiIsImEiOiJja3pvaXJ3eWM0bnV2MnVvMTc2d2U5aTNpIn0.RY-K9qwZD1hseyM5TxLzww";

    let map;
    let marker;
    let testRoute = [];
    let radiusForPointerSearch = 1;
    let searchByMarker = false;
    let lastCoords = [];
    let lastRadius = 1;
    let filter = {architecture: true, cultural: true, historic: true, natural: true, religion: true, tourist_facilities: true, museums: true, palaces: true, malls: true, churches: true};
    let directionsMode = "driving";
    let currentGlobalResults = [];
    let timerID;
    let globalPopup = "", globalPopup2 = "";
    let geolocate;
    let lastPosition;

    export function setFilter(newFilter){
        filter = newFilter;
    }

    export function setDirectionGlobally(mode) {
        directionsMode = mode;
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

    function pointIsInRoute(id)
    {
        for(let i = 0; i<testRoute.length; i++){
            if(id===testRoute[i]["properties"]["id"])
                return true;
        }
        return false;
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
            
        console.log(testRoute);
    }

    export async function postRoute()
    {
        let formData = new FormData();
        let route;
    
        formData.append('points', JSON.stringify(testRoute));
        formData.append('vehicle', directionsMode);
        await fetch('http://localhost:5000/route', {
            method: 'post',
            body: formData,
            credentials: 'include',
        }).then(res => res.json())
            .then(res => route = res);
        if (map.getSource('route1')) {
            map.removeLayer("layer1");
            map.removeSource('route1');
        }
        
        console.log(" duration: " + Math.round(route.duration / 60 * 100) / 100 + " min distance: " + Math.round(route.distance / 1000 * 100) / 100 + " km");
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
    }


function BaseMap (props) {


    const [addButtonTag, setAddButtonTag] = useState("ADD TO ROUTE");
    const [showAddButton, setShowAddButton] = useState(true);
    const [removeButtonTag, setRemoveButtonTag] = useState("REMOVE FROM ROUTE");
    const [searchHereTag, setSearchHereTag] = useState("SEARCH HERE?");
    const [openRouteDrawer, setOpenRouteDrawer] = useState(false);

    useEffect(() => {
        console.log("rerender")
    })

    useEffect(() =>{
        
        console.log("hallo")
        console.log(props.l1)
        if(props.l1 === "de"){
            setAddButtonTag("ZUR ROUTE HINZUFÜGEN");
            setRemoveButtonTag("VON ROUTE LÖSCHEN");
            setSearchHereTag("HIER SUCHEN?");
        }else if(props.l1 === "it"){
            setAddButtonTag("AGGIUNGI AL itinerario");
            setRemoveButtonTag("RIMUOVERE DAl itinerario");
            setSearchHereTag("CERCARE QUI?");
        }else{
            setAddButtonTag("ADD TO ROUTE");
            setRemoveButtonTag("REMOVE FROM ROUTE");
            setSearchHereTag("SEARCH HERE?")
        }

    },[props.l1]);

    //mapbox://styles/mapbox/satellite-v9
    //mapbox://styles/mapbox/light-v10
    let theme = "mapbox://styles/mapbox/navigation-night-v1";
    let imageSrc = "";

    const [open, setOpen] = useState(false);
    const [image, setImage] = useState("");

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
                console.log(coordinates)
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

                var UserAgent = navigator.userAgent.toLowerCase();

                // Nur beim Computer
                if (UserAgent.search(/(iphone|ipod|opera mini|fennec|palm|blackberry|android|symbian|series60)/) < 0) {

                    const feature = e.features[0];

                    // create popup node
                    setImage("");
                    imageSrc = `https://commons.wikimedia.org/wiki/Special:FilePath/${(await getDataFromURL(`https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&entity=${feature.properties.wikidata}&format=json&origin=*`)).claims.P18[0].mainsnak.datavalue.value.replace(/\s/g, "_")}?width=300`;
                    if(imageSrc != undefined)
                        setImage(imageSrc);
                    const popupNode = document.createElement("div");

                    ReactDOM.render(<Popup feature={feature} />, popupNode);
                    // <img src="./kolosseum.jpg"></img>
                    //ReactDOM.render(<Button variant="contained" style={{borderRadius: '20px'}} onClick={() => addToRoute(feature)}>Add</Button>, popupNode);
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

            console.log(e);

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

    function locationButtonClick(){
        
        geolocate._geolocateButton.click();

    }

    function removePointFromRouteButtonClicked(obj){
        removePointFromRoute(obj["properties"]["id"]);
        setShowAddButton(true);
    }

    function addPointToRouteButtonClicked(obj){
        //first check if object isnt already in the route!
        for(let i = 0; i<testRoute.length; i++){
            if(obj["properties"]["id"]===testRoute[i]["properties"]["id"])
                return;
        }
        testRoute.push(obj);
        setShowAddButton(false);
        console.log(testRoute)
    }

  
    return (
    
        <div>
            <div id="test" style={{marginBottom:"100px"}}>opkkp</div>
            <div id="mapContainer" className="map"></div>
            <div id="navi" style={{ marginLeft: "3.625em", minWidth:"30vw", maxWidth:"2.625em"}}>
            <MapSearch l1={props.l1}></MapSearch>
            
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
                    <div style={{maxHeight:"60vh", minHeight:"100px"}}>
                        <div style={{width:"100%", maxHeight:"30%", maxWidth:"100%", marginTop:"20px", display:"flex", alignItems:"center", justifyContent:"center"}}>
                        <div>
                            <div> 
                                {showAddButton ? <Button variant="contained" style={{marginBottom:"10px"}}  endIcon={<SendIcon />} onClick={() => addPointToRouteButtonClicked(obj)}>{addButtonTag}</Button> : <Button variant="contained" startIcon={<DeleteIcon />} style={{marginBottom:"10px"}} onClick={() => removePointFromRouteButtonClicked(obj)}>{removeButtonTag}</Button>}
                                <h2 id="nameField" style={{marginBottom:"10px"}}>{obj.properties.name}</h2>
                            </div>
                            <div><img src={image} alt="" style={{maxWidth:"100%", marginBottom:"20px"}}></img></div>
                        </div>
                        </div>
                    </div>
            </Drawer>

            <SwipeableDrawer 
                anchor='right'
                transitionDuration	= {280}
               
                open={openRouteDrawer}
                onClose={() => setOpenRouteDrawer(!openRouteDrawer)}>
                    
                    <div id="routeSwipeableDrawerDiv" >
                        <Card  sx={{mt:1.5, ml:1, mr:1}} >
                        <OutlinedInput
                            id="outlined-adornment-weight"
                            fullWidth
                            placeholder={"Route name"}
                            onChange={(e) => console.log(e.value)}
                            endAdornment={<Button><SaveIcon/></Button>}
                           
                            
                            inputProps={{
                            'aria-label': 'weight',}}/>
                        </Card>
                        

                        <Box  sx={{mt:2, ml:1, mr:1}}>
                            <Button variant="contained" sx={{minHeight: 50}} fullWidth><RouteIcon />Calculate best route</Button>
                        </Box>

                        <Card sx={{mt:3, mb:1.5, ml:1, mr:1, pt:0.5, pb:0.5}} style={{border:"solid grey 0.5px", borderRadius:"8px"}} elevation={"6"}><Typography variant='h5' fontWeight={500} sx={{mt:1, mb:1}} style={{maxWidth:"90%", margin:"auto", marginLeft:"10px"}}>Your Route - Step by Step</Typography></Card>
                        <Card sx={{ mb:3, ml:1, mr:1, pt:0.5, pb:0.5}} style={{border:"solid grey 0.5px", borderRadius:"8px"}} elevation={"4"}><Typography variant='h6' fontWeight={400} sx={{mt:1, mb:1}} style={{maxWidth:"90%", margin:"auto", marginLeft:"10px"}}>25 Minutes, 20km by Car, 20 POIs</Typography></Card>
                        <div style={{maxWidth:"100%", wordBreak:"break-all"}}>
                            {testRoute.map((item, i) => <Card sx={{mt:1.5, ml:1, mr:1, pt:0.65, pb:0.65}} elevation={"3"} style={{display:"flex", justifyContent:"space-between", borderRadius:"15px"}}><Typography sx={{mt:1, mb:1}} style={{maxWidth:"90%", margin:"auto", marginLeft:"10px"}}> {i+1}. {(item["properties"]["name"])}</Typography>  <Button style={{minHeight: "42px", minWidth:"50px", maxHeight:"42px", margin:"auto", marginLeft:"15px", marginRight:"10px",  borderRadius:"15px"}} color="error" variant="contained"><DeleteIcon /></Button></Card>)}                            
                        </div>

                        <Box  sx={{mt:2, ml:1, mr:1}}>
                            <Button color="error" variant="contained"><DeleteIcon />Delete the hole Route</Button>
                        </Box>

                    </div>

            </SwipeableDrawer>
        </div>
    );
};

    async function getLocationData(lon, lat, radius, filters)
    {
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
        
        if(radius < 5){z = 14}
        else if(radius < 10){z = 10.3}
        else if(radius < 15){z = 9.9}
        else if(radius < 20){z = 9.1}
        else if(radius < 25){z = 8.8}
        else if(radius < 30){z = 8.5}
        else if(radius < 35){z = 8.4}
        else if(radius < 40){z = 8.2}
        else if(radius < 45){z = 8}
        else if(radius < 50){z = 7.9}
        else if(radius < 55){z = 7.75}
        else if(radius < 60){z = 7.55}
        else if(radius < 65){z = 7.4}
        else if(radius < 70){z = 7.3}
        else if(radius < 75){z = 7.2}
        else if(radius < 80){z = 7.1}
        else if(radius < 85){z = 7}
        else if(radius < 90){z = 6.9}
        else if(radius < 95){z = 6.85}
        else if(radius <= 100){z = 6.8}
        
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
            
            //const results = await fetchFakeData({ longitude: coords[0], latitude: coords[1], radius2: lastRadius, filterToUse: filter });
            console.log(filter);
            
            const results = await getLocationData(coords[0], coords[1], lastRadius, filter);
            currentGlobalResults = results;
     
            // update "random-points-data" source with new data
            // all layers that consume the "random-points-data" data source will be updated automatically
            map.getSource("random-points-data").setData(results);
        }, 900)


    }


    export function setRadiusForPointerSearch (newRadius){
        radiusForPointerSearch = newRadius;
        console.log(searchByMarker)
        if(searchByMarker)
        flyToLocation(lastCoords, radiusForPointerSearch, false)
    }

export default BaseMap;