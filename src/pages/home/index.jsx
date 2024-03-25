import React, { useEffect, useState } from "react";
import Map from "../../map";
import { Layers, TileLayer, VectorLayer } from "../../layers";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { osm, vector,xyz } from "../../Source";
import { fromLonLat, get } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import { Controls, FullScreenControl } from "../../controls";
import FeatureStyles from "../../feactures/Styles";
import {fetchHomeGeoData} from '../../service/home/HomeService';
import mapConfig from "../../config.json";
import "../../App.css";
import { Circle as CircleStyle, Fill, Stroke, Style,Icon } from 'ol/style';
import { styleFunction } from "../../utils/functions/StyleFunction";
import { XYZ } from "ol/source";

const geojsonObject = mapConfig.geojsonObject;
const geojsonObject2 = mapConfig.geojsonObject2;
const markersLonLat = [mapConfig.kansasCityLonLat, mapConfig.blueSpringsLonLat];



const Home = () => {
  const [center, setCenter] = useState(mapConfig.center);
  const [zoom, setZoom] = useState(1);

  const [showLayer1, setShowLayer1] = useState(true);
  const [showLayer2, setShowLayer2] = useState(true);
  const [showMarker, setShowMarker] = useState(true);

  const [features, setFeatures] = useState(addMarkers([]));
  const [sampleFeatures,setSampleFeatures] = useState({
    "type": "FeatureCollection",
    "features": []
  });
  const [mapSource,setMapSourse] = useState(osm());


  function addMarkers(lonLatArray) {
    var iconStyle = new Style({
      image: new Icon({
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        src: mapConfig.markerImage32,
      }),
    });
    let features = lonLatArray.map((item) => {
      let feature = new Feature({
        geometry: new Point(fromLonLat(item)),
      });
      feature.setStyle(styleFunction);
      return feature;
    });
    return features;
  }
  

  function extractPointCoordinates(data){
    let coordinatesArray = [];
    const filteredList = data.filter(item =>( item.geometry.type === 'Point'));
    coordinatesArray = filteredList.map(item => item.geometry.coordinates);
    return coordinatesArray;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchHomeGeoData('PostgressSQL:nyc_neighborhoods')
        setSampleFeatures(response.data)
        // setFeatures(addMarkers([...extractPointCoordinates(response.data.features),...markersLonLat]))
        // {console.log([...extractPointCoordinates(response.data.features),...markersLonLat])}

           } catch (error) {
        // Handle error
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Map center={fromLonLat(center)} zoom={zoom}>
      {console.log(sampleFeatures,'features')}
        <Layers>
          <TileLayer source={mapSource} zIndex={0} />

          {showLayer2 && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(sampleFeatures, {
                  featureProjection: get("EPSG:3857"),
                }),
              })}
              style={styleFunction}
            />
          )}
          {showMarker && <VectorLayer source={vector({ features })} />}
        </Layers>
        <Controls>
          <FullScreenControl />
        </Controls>
      </Map>
    
    </div>
  );
};

export default Home;