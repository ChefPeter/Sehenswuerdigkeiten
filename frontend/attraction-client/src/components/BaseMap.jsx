import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "./BaseMap.scss";

const BaseMap = () => {
  mapboxgl.accessToken = "pk.eyJ1IjoiemJhYWtleiIsImEiOiJja3pvaXJ3eWM0bnV2MnVvMTc2d2U5aTNpIn0.RY-K9qwZD1hseyM5TxLzww";

  useEffect(() => {
    let theme;
    let i = 1;
    if(i == 0){
        theme = "mapbox://styles/mapbox/light-v10";
    }
    else{
        theme = "mapbox://styles/mapbox/navigation-night-v1"
    }
    const map = new mapboxgl.Map({
      container: "mapContainer",
      style: theme,
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