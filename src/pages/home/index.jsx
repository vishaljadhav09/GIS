import React, { useEffect, useState, useContext } from "react";
import Map from "../../map";
import { Layers, TileLayer, VectorLayer } from "../../layers";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { osm, vector, xyz } from "../../Source";
import { fromLonLat, get } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import { Controls, FullScreenControl ,ZoomControl} from "../../controls";
import FeatureStyles from "../../feactures/Styles";
import { fetchHomeGeoData } from "../../service/home/HomeService";
import mapConfig from "../../config.json";
import "../../App.css";
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from "ol/style";
import { styleFunction } from "../../utils/functions/StyleFunction";
import { XYZ } from "ol/source";
import MapContext from "../../state-management/MapContext";
import DrawInteractions from "../../map/DrawInteractions";
import { submitGeoData } from "../../service/home/HomeService";
import LocationControl from "../../controls/LocationControl";

const geojsonObject = mapConfig.geojsonObject;
const geojsonObject2 = mapConfig.geojsonObject2;
const markersLonLat = [mapConfig.kansasCityLonLat, mapConfig.blueSpringsLonLat];

const Home = () => {
  const [center, setCenter] = useState(fromLonLat([0, 0]));
  const [zoom, setZoom] = useState(1);
  const [drawType, setDrawType] = useState("Point");
  const [drawInteraction, setDrawInteraction] = useState(null);
  const [coordinates, setCoordinates] = useState([]);

  const [showLayer1, setShowLayer1] = useState(true);
  const [showLayer2, setShowLayer2] = useState(true);
  const [showMarker, setShowMarker] = useState(true);

  const [features, setFeatures] = useState(addMarkers([]));
  const [sampleFeatures, setSampleFeatures] = useState({
    type: "FeatureCollection",
    features: [],
  });
  const [mapSource, setMapSourse] = useState(osm());
  const [drawnFeatureCoordinates, setDrawnFeatureCoordinates] = useState([]);

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
  //const { map } = useContext(MapContext);
  function extractPointCoordinates(data) {
    let coordinatesArray = [];
    const filteredList = data.filter((item) => item.geometry.type === "Point");
    coordinatesArray = filteredList.map((item) => item.geometry.coordinates);
    return coordinatesArray;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        //	PostgressSQL:geosolutions_giant_polygon
        //PostgressSQL:gs_us_states
        //PostgressSQL:nyc_neighborhoods
        const response = await fetchHomeGeoData("PostgressSQL:gs_us_states");
        setSampleFeatures(response.data);
        // setFeatures(addMarkers([...extractPointCoordinates(response.data.features),...markersLonLat]))
        // {console.log([...extractPointCoordinates(response.data.features),...markersLonLat])}
      } catch (error) {
        // Handle error
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const handleDrawEnd = (drawnFeature) => {
    // Update the state with the coordinates of the drawn feature

    if(drawnFeature.type === drawType){
      console.log(drawnFeature,drawType,'drawnFeature')

    drawnFeatureCoordinates.push(drawnFeature);
    }
  };
  const handleChangeDrawType = (event) => {
    setDrawType(event.target.value);
    //setCoordinates([]); // Clear coordinates when draw type changes
  };

  const handleSubmitAction = async () => {
    try {
      const res = await submitGeoData(drawnFeatureCoordinates);
      console.log(res.json(), "res");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div>
        <label>
          Draw Type:
          <select value={drawType} onChange={handleChangeDrawType}>
            <option value="Point">Point</option>
            <option value="LineString">Line</option>
            <option value="Polygon">Polygon</option>
          </select>
        </label>
        <button onClick={handleSubmitAction}>Submit</button>
      </div>
      <Map
        center={fromLonLat(center)}
        zoom={zoom}
        drawnFeatureCoordinates={drawnFeatureCoordinates}
        setDrawnFeatureCoordinates={setDrawnFeatureCoordinates}
      >
        <Layers>
          <TileLayer  source={mapSource} zIndex={0} />

          {/* {showLayer2 && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(sampleFeatures, {
                  featureProjection: get("EPSG:3857"),
                }),
              })}
              style={styleFunction}
            />
          )} */}
          <DrawInteractions
            onDrawEnd={handleDrawEnd}
           
            source={vector({
              features: new GeoJSON().readFeatures(sampleFeatures, {
                featureProjection: get("EPSG:3857"),
              }),
            })}
            style={styleFunction}
            drawType={drawType}
            drawnFeatureCoordinates={drawnFeatureCoordinates}
            setDrawnFeatureCoordinates={setDrawnFeatureCoordinates}
          />
          {showMarker && <VectorLayer source={vector({ features })} />}
        </Layers>
        <Controls>
          <FullScreenControl />
          <ZoomControl />
          <LocationControl />
        </Controls>
      </Map>
    </div>
  );
};

export default Home;
