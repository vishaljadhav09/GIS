import { Control } from "ol/control";
import React, { useContext, useEffect, useState } from "react";
import MapContext from "../state-management/MapContext";
import { fromLonLat, transform } from "ol/proj";
import Geolocation from "ol/Geolocation.js";
import MyLocation from '.././utils/images/my-location.png';

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

    var handleLocationClick = function (e) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
        const coordinates = transform(
            [position.coords.longitude, position.coords.latitude],
            'EPSG:4326',
            'EPSG:3857'
        );
        map.getView().animate({ center: coordinates, zoom: 10 });
    },
    (error) => console.error('Error getting geolocation:', error),
    {
        enableHighAccuracy: true, // Request high accuracy
        maximumAge: 10000,
        timeout: 10000, 
    }
  );
    
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
