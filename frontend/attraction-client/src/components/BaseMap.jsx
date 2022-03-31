import { Button } from "@mui/material";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import mapboxgl from "mapbox-gl";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import fetchFakeData from "./fetchFakeData";
import Popup from "./Popup";
import "./styles/BaseMap.css";

    const API_KEY = "pk.eyJ1IjoiemJhYWtleiIsImEiOiJja3pvaXJ3eWM0bnV2MnVvMTc2d2U5aTNpIn0.RY-K9qwZD1hseyM5TxLzww";

    let map;
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

    function addToRoute(object)
    {
        if(testRoute.filter(x => x.properties.id === object.properties.id).length === 0)
            testRoute.push(object);
        console.log(testRoute.length);
    }

    export async function postRoute()
    {
        let formData = new FormData();
        let coords = [];
        let out = [];
    
        formData.append('points', JSON.stringify(testRoute));
        formData.append('vehicle', 'driving');
    
        await fetch('http://localhost:5000/route', {
            method: 'post',
            body: formData,
            credentials: 'include',
        }).then(res => res.json())
            .then(res => res.forEach(x => coords.push(x.geometry.coordinates)));
        if (map.getSource('route1')) {
            map.removeLayer("layer1");
            map.removeSource('route1');
        }
        for (let count = 1; count < coords.length; count++) {
            let rout = await getDataFromURL(getRouteURL(directionsMode, `${coords[count - 1].join(",")};${coords[count].join(",")}`, "en"));
            out = out.concat(rout.routes[0].geometry.coordinates);
        }
        map.addSource('route1', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': out
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
    useEffect(() =>{
        console.log(props.l1)
        if(props.l1 === "de"){
            setAddButtonTag("ZUR ROUTE HINZUFÜGEN");
        }else if(props.l1 === "it"){
            setAddButtonTag("AGGIUNGI AL PERCORSO");
        }else{
            setAddButtonTag("ADD TO ROUTE");
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

    const Popup2 = ({ feature2 }) => {
        const { } = feature2;

        return (
            <div></div>
        );
    };

useEffect(() => {

        //Brixen
        let coordinates = [11.65598, 46.71503];
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

        map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
        map.addControl(new mapboxgl.ScaleControl({ position: 'bottom-right' }));
        const geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true,
            // Draw an arrow next to the location dot to indicate which direction the device is heading.
            showUserHeading: true
        });


        map.addControl(geolocate, "bottom-right");


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
        
        async function getDetail(id) {
            let result = await fetch('https://api.opentripmap.com/0.1/en/places/xid/' + id + '?apikey=5ae2e3f221c38a28845f05b690c520033dc6de71c6665213ffad8752');
            let answer = null;
            if (result.ok)
                answer = await result.json();
            return answer;
        }


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
                setOpen(true);
            }
        });

        map.on("dblclick", async e => {

            console.log(e);

            const feature2 = e;
            let array = [e.lngLat.lng, e.lngLat.lat]

            let popupNode  = document.createElement("div");
            ReactDOM.render(<Popup2 feature2={feature2} />, popupNode);
            ReactDOM.render(<div><Button onClick={() => handleSearchByMarkerButton(array, radiusForPointerSearch)} >Search here?</Button></div>, popupNode);

            // set popup on map
            popUpRef.current
                .setLngLat(array)
                .setDOMContent(popupNode)
                .addTo(map);

        });


        let marker = new mapboxgl.Marker();

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


    return (
    
        <div>
        
            <div id="mapContainer" className="map"></div>

            <SwipeableDrawer 
                anchor='bottom'
                open={open}
                onClose={() => setOpen(!open)}
                onOpen={() =>  console.log()}>
                    <div style={{maxHeight:"60vh", minHeight:"100px"}}>
                        <div style={{width:"100%", maxHeight:"30%", maxWidth:"100%", marginTop:"20px", display:"flex", alignItems:"center", justifyContent:"center"}}>
                        <div>
                            <div>
                                <Button variant="contained" style={{color: "black", marginBottom:"20px"}} onClick={() => addToRoute(obj)}>{addButtonTag}</Button>
                                <h2 id="nameField" style={{color:'white', marginBottom:"20px"}}>{obj.properties.name}</h2>
                            </div>
                            <div><img src={image} alt="" style={{maxWidth:"100%", marginBottom:"20px"}}></img></div>
                            <div>
                                <h3 style={{marginBottom:"20px"}}>Hallo hier kommen Infos hin</h3>
                            </div>
                        </div>
                        </div>
                    </div>
                </SwipeableDrawer>
            
        </div>
    );
};


    export async function flyToLocation (coords, radius, newCoordinates = false){
        
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
        const results = await fetchFakeData({ longitude: coords[0], latitude: coords[1], radius2: radius, filterToUse: filter });
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

            let init=true;
            if(!coords){
                if(lastCoords.length === 0)
                    return;
                else
                    coords = lastCoords;
            }
            
            const results = await fetchFakeData({ longitude: coords[0], latitude: coords[1], radius2: lastRadius, filterToUse: filter });
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