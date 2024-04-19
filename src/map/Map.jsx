import React, { useRef, useState, useEffect } from "react";
import "./Map.css";
import MapContext from "../state-management/MapContext";
import * as ol from "ol";
import DrawInteractions from "./DrawInteractions";
import { Box } from "@mui/material";

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
      view: new ol.View({ zoom, center }),
      layers: [],
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
    map.getView().setZoom(zoom);
  }, [zoom]);
  // center change handler
  useEffect(() => {
    if (!map) return;
    map.getView().setCenter(center);
  }, [center]);

  return (
    <MapContext.Provider value={{ map }}>
      <Box >
      <div ref={mapRef} className="ol-map">
        <div>{children}</div>
      </div>
      </Box>

    </MapContext.Provider>
  );
};
export default Map;
