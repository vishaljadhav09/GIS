import { Control } from "ol/control";
import React, { useContext, useEffect, useState } from "react";
import MapContext from "../state-management/MapContext";
import { fromLonLat, transform } from "ol/proj";
import Geolocation from "ol/Geolocation.js";
import MyLocation from '.././utils/images/my-location.png';
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Style, Icon } from 'ol/style';
import { Vector } from "ol/layer";
import VectorSource from "ol/source/Vector";
import markerImage from '../utils/images/m.png';

const LocationControl = ({ lable }) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;
    var button = document.createElement("button");
    const img = document.createElement('img');
    img.src = MyLocation; 
    img.alt = 'My Location';
    img.className = 'my-location-icon'
    button.appendChild(img);

    const vectorLayer = map.getLayers().item(1); // Assuming the vector layer is the second layer
    const vectorSource = vectorLayer.getSource();

    var handleLocationClick = function (e) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
        const coordinates = transform(
            [position.coords.longitude, position.coords.latitude],
            'EPSG:4326',
            'EPSG:3857'
        );
        addMarker(coordinates);
        map.getView().animate({ center: coordinates, zoom: 20 });
    },
    (error) => console.error('Error getting geolocation:', error),
    {
        enableHighAccuracy: true, // Request high accuracy
        maximumAge: 10000,
        timeout: 10000, 
    }
  );
    
    };


    const addMarker = (coordinates) => {
      
      //vectorSource.clear(); // Clear existing markers
      const marker = new Feature({
          geometry: new Point(coordinates),
          
      });

      const pinLayer = new Vector ({
        source: new VectorSource({
          features: [marker]
        }),
        style: new Style({
          image: new Icon({
            anchor: [0.5, 1],
            src: 'https://cdn2.iconfinder.com/data/icons/social-media-and-payment/64/-47-32.png'
          })
        })
      });
      map.addLayer (pinLayer);

      //vectorSource.addFeatures(marker);
  };

    button.addEventListener("click", handleLocationClick, false);

    var element = document.createElement("div");
    element.className = "rotate-north ol-unselectable ol-control";
    element.appendChild(button);

    var LocationControl = new Control({
      element: element,
    });
    map.addControl(LocationControl);

    return () => {
      map.removeControl(LocationControl);
    };
  }, [map]);

  return null;
};

export default LocationControl;
