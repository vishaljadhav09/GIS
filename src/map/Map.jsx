import React, { useRef, useState, useEffect } from "react";
import "./Map.css";
import MapContext from "../state-management/MapContext";
import * as ol from "ol";
import DrawInteractions from "./DrawInteractions";
import { Box } from "@mui/material";
import VectorLayer from "ol/layer/Vector";
import { KML } from "ol/format";
import VectorSource from "ol/source/Vector";

const Map = ({
  children,
  zoom,
  center,
  setDrawnFeatureCoordinates,
  drawnFeatureCoordinates,
}) => {
  const mapRef = useRef();
  const [map, setMap] = useState(null);
  // on component mount
  useEffect(() => {
    let options = {
      view: new ol.View({ zoom, center,constrainOnlyCenter: true, }),
      layers: [

      ],
      controls: [],
      overlays: [],
    };
    let mapObject = new ol.Map(options);
    mapObject.setTarget(mapRef.current);
    setMap(mapObject);
    return () => mapObject.setTarget(undefined);
  }, []);
  // zoom change handler
  useEffect(() => {
    if (!map) return;
    var view = map.getView();
    view.animate({
      zoom: zoom,
      duration: 3000,
    });
    //map.getView().setZoom(zoom);
  }, [zoom]);
  // center change handler
  useEffect(() => {
    if (!map) return;
// var view = map.getView();
//     view.animate({
//       center: center,
//       duration: 3000,
//     });
flyTo(center, function () {});
    //map.getView().setCenter(center);
  }, [center]);


  function flyTo(location, done) {
    var view = map.getView();
    const duration = 2000;
    const zoom = view.getZoom();
    let parts = 2;
    let called = false;
    function callback(complete) {
      --parts;
      if (called) {
        return;
      }
      if (parts === 0 || !complete) {
        called = true;
        done(complete);
      }
    }
    view.animate(
      {
        center: location,
        duration: duration,
      },
      callback,
    );
    view.animate(
      {
        zoom: zoom - 1,
        duration: duration / 2,
      },
      {
        zoom: zoom,
        duration: duration / 2,
      },
      callback,
    );
  }

  return (
    <MapContext.Provider value={{ map }}>
      <Box>
        <div ref={mapRef} className="ol-map">
          <div>{children}</div>
        </div>
      </Box>
      <div class="overlay-container" >
        <span class="overlay-text" id="feacture-name"></span>
        <br />
        <span class="overlay-text" id="feacture-Additional-info"></span>
        <br />
      </div>
    </MapContext.Provider>
  );
};
export default Map;
