import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "./BaseMap.scss";
import { useSelector } from 'react-redux';




const BaseMap = () => {

    const themeN = useSelector(state => {
        try{
           
            if(state.theme == "light"){
                return "mapbox://styles/mapbox/light-v10"
            }else{
                return "mapbox://styles/mapbox/navigation-night-v1"
            }
          
        }catch(e){
          return "mapbox://styles/mapbox/navigation-night-v1";
        }
      });
      const language = useSelector(state => {
        try{
          return state.language;
        }catch(e){
          return "de";
        }
      });
    

  mapboxgl.accessToken = "pk.eyJ1IjoiemJhYWtleiIsImEiOiJja3pvaXJ3eWM0bnV2MnVvMTc2d2U5aTNpIn0.RY-K9qwZD1hseyM5TxLzww";

  useEffect(() => {
    
    const map = new mapboxgl.Map({
      container: "mapContainer",
      style: themeN,
      center: [-74.5, 40],
      zoom: 9,
    });

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, "top-right");
    const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      });
      
      map.addControl(geolocate, "top-right")
  }, []);
  
  return <div id="mapContainer" className="map"></div>;
};

export default BaseMap;