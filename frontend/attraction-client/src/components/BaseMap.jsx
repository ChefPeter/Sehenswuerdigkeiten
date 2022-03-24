import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import fetchFakeData from "./fetchFakeData";
import Popup from "./Popup";
import "./BaseMap.scss";
import ReactDOM from "react-dom";
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

  const mapContainerRef = useRef(null);
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }));

  useEffect(() => {
    
    const map = new mapboxgl.Map({
      container: "mapContainer",
      style: themeN,
      center: [12.496366, 41.902782],
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
        // add the data source for new a feature collection with no features
        map.addSource("random-points-data", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: []
          }
        });
        map.loadImage(
          'https://docs.mapbox.com/mapbox-gl-js/assets/cat.png',
          (error, image) => {
          if (error) throw error;
           
          // Add the image to the map style.
          map.addImage('cat', image)});

        // now add the layer, and reference the data source above by name
        map.addLayer({
          id: "random-points-layer",
          source: "random-points-data",
          type: "symbol",
          layout: {
            // full list of icons here: https://labs.mapbox.com/maki-icons
            "icon-image": "bakery-15", // this will put little croissants on our map
            "icon-padding": 0,
            "icon-allow-overlap": true
          }
        });
      });

      
    map.on("moveend", async () => {
      // get new center coordinates
      const lng=coordinates[1];
      const lat=coordinates[0];
      // fetch new data
      const results = await fetchFakeData({ longitude: lng, latitude: lat });
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
  
  return <div id="mapContainer" className="map" ref={mapContainerRef}></div>;
};

export default BaseMap;