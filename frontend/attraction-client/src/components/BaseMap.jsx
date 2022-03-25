import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import fetchFakeData from "./fetchFakeData";
import Popup from "./Popup";
import "./styles/BaseMap.scss";
import ReactDOM from "react-dom";
import { useSelector } from 'react-redux';
import { Button } from "@mui/material";

let testRoute = [];
function addToRoute(object)
{
  if(testRoute.filter(x => x.properties.id === object.properties.id).length === 0)
      testRoute.push(object);
  console.log(testRoute.length);
}
async function postRoute()
{
  const response = await fetch("http://localhost:5000/route", {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(testRoute),
          });
          response.json().then(data => {
            console.log(data);
          });
}

const BaseMap = () => {
    
    //mapbox://styles/mapbox/satellite-v9
    //mapbox://styles/mapbox/light-v10
    let theme = "mapbox://styles/mapbox/navigation-night-v1"

   /* useSelector(state => {
        try{
           
            if(state.theme == "light"){
             
              setTheme("mapbox://styles/mapbox/light-v10")
               
            }else{
              setTheme("mapbox://styles/mapbox/navigation-night-v1")
               
            }
          
        }catch(e){
          setTheme("mapbox://styles/mapbox/navigation-night-v1");
        }
    });*/

      const language = useSelector(state => {
        try{
          return state.language;
        }catch(e){
          return "de";
        }
      });
    

  mapboxgl.accessToken = "pk.eyJ1IjoiemJhYWtleiIsImEiOiJja3pvaXJ3eWM0bnV2MnVvMTc2d2U5aTNpIn0.RY-K9qwZD1hseyM5TxLzww";

  const mapContainerRef = useRef(null);
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }));
  let map;

  useEffect(() => {
    
    map = new mapboxgl.Map({
      container: "mapContainer",
      center: [11.657244, 46.717705],
      style: theme,
      zoom: 9,
    });

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, "top-right");
    map.addControl(new mapboxgl.ScaleControl({position: 'bottom-right'}));
    const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      });
      
      map.addControl(geolocate, "top-right");

      let coordinates;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          coordinates = [position.coords.latitude, position.coords.longitude];
        });
      }

      map.on("load", () => {
        map.flyTo({
          center: [
             coordinates[1], // Example data
             coordinates[0] // Example data
          ],
          essential: true // this animation is considered essential with respect to prefers-reduced-motion
       });
       map.loadImage('https://img.icons8.com/color/344/marker--v1.png',
       function(error, image) {
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
            "icon-size":0.08
          }
        });
      });

    
      
    map.on("moveend", async () => {
      // get new center coordinates
      let lon=coordinates[1];
      let lat=coordinates[0];
      /*lon = "12.4907795";
      lat = "41.8897653"*/
      // fetch new data
      const results = await fetchFakeData({ longitude: lon, latitude: lat });
      console.log(results);
      // update "random-points-data" source with new data
      // all layers that consume the "random-points-data" data source will be updated automatically
      map.getSource("random-points-data").setData(results);
    });

    // change cursor to pointer when user hovers over a clickable feature
    map.on("mouseenter", "random-points-layer", e => {
      if (e.features.length) {
        map.getCanvas().style.cursor = "pointer";
      }
    });

    // reset cursor to default when user is no longer hovering over a clickable feature
    map.on("mouseleave", "random-points-layer", () => {
      map.getCanvas().style.cursor = "";
    });

    // add popup when user clicks a point
    map.on("click", "random-points-layer", e => {
      if (e.features.length) {
        const feature = e.features[0];
        // create popup node
        const popupNode = document.createElement("div");
        ReactDOM.render(<Popup feature={feature} />, popupNode);
        ReactDOM.render(<Button onClick={() => addToRoute(feature)}>Add</Button>, popupNode);
        if(testRoute.length > 3)
          ReactDOM.render(<Button onClick={() => postRoute()}>PostRoute</Button>, popupNode);
        // set popup on map
        popUpRef.current
          .setLngLat(feature.geometry.coordinates)
          .setDOMContent(popupNode)
          .addTo(map);
      }
    });

    
   
    // clean up on unmount
    return () => map.remove();
      
  }, []);
  
  return (<div>
   
    <div id="mapContainer" className="map" ref={map}></div>
    

  </div>
  );
};


export default BaseMap;