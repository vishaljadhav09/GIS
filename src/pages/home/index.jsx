import React, { useEffect, useState } from "react";
import Map from "../../map";
import { Layers, TileLayer, VectorLayer } from "../../layers";
import { Style, Icon } from "ol/style";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { osm, vector } from "../../Source";
import { fromLonLat, get } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import { Controls, FullScreenControl } from "../../controls";
import FeatureStyles from "../../feactures/Styles";
import {fetchHomeGeoData} from '../../service/home/HomeService';
import mapConfig from "../../config.json";
import "../../App.css";

const geojsonObject = mapConfig.geojsonObject;
const geojsonObject2 = mapConfig.geojsonObject2;
const markersLonLat = [mapConfig.kansasCityLonLat, mapConfig.blueSpringsLonLat];

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
    //feature.setStyle(iconStyle);
    return feature;
  });
  return features;
}

const Home = () => {
  const [center, setCenter] = useState(mapConfig.center);
  const [zoom, setZoom] = useState(2);

  const [showLayer1, setShowLayer1] = useState(true);
  const [showLayer2, setShowLayer2] = useState(true);
  const [showMarker, setShowMarker] = useState(true);

  const [features, setFeatures] = useState(addMarkers([]));
  

  function extractPointCoordinates(data){
    let coordinatesArray = [];
    const filteredList = data.filter(item =>( item.geometry.type === 'Point'));
    coordinatesArray = filteredList.map(item => item.geometry.coordinates);
    return coordinatesArray;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchHomeGeoData('sf:archsites')

        setFeatures(addMarkers([...extractPointCoordinates(response.data.features),...markersLonLat]))
        {console.log([...extractPointCoordinates(response.data.features),...markersLonLat])}

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
      {console.log(features,'features')}
        <Layers>
          <TileLayer source={osm()} zIndex={0} />
          {showLayer1 && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(geojsonObject, {
                  featureProjection: get("EPSG:3857"),
                }),
              })}
              style={FeatureStyles.MultiPolygon}
            />
          )}
          {showLayer2 && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(geojsonObject2, {
                  featureProjection: get("EPSG:3857"),
                }),
              })}
              style={FeatureStyles.MultiPolygon}
            />
          )}
          {showMarker && <VectorLayer source={vector({ features })} />}
        </Layers>
        <Controls>
          <FullScreenControl />
        </Controls>
      </Map>
      <div>
        <input
          type="checkbox"
          checked={showLayer1}
          onChange={(event) => setShowLayer1(event.target.checked)}
        />{" "}
        Johnson County
      </div>
      <div>
        <input
          type="checkbox"
          checked={showLayer2}
          onChange={(event) => setShowLayer2(event.target.checked)}
        />{" "}
        Wyandotte County
      </div>
      <hr />
      <div>
        <input
          type="checkbox"
          checked={showMarker}
          onChange={(event) => setShowMarker(event.target.checked)}
        />{" "}
        Show markers
      </div>
    </div>
  );
};

export default Home;