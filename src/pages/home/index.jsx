import Feature from "ol/Feature";
import GeoJSON from "ol/format/GeoJSON";
import Point from "ol/geom/Point";
import { fromLonLat, get } from "ol/proj";
import { Icon, Style } from "ol/style";
import React, { useEffect, useState } from "react";
import "../../App.css";
import { osm, vector } from "../../Source";
import mapConfig from "../../config.json";
import { Controls, FullScreenControl, ZoomControl } from "../../controls";
import LocationControl from "../../controls/LocationControl";
import { Layers, TileLayer, VectorLayer } from "../../layers";
import Map from "../../map";
import DrawInteractions from "../../map/DrawInteractions";
import {
  fetchHomeGeoData,
  submitGeoData,
} from "../../service/home/HomeService";
import { styleFunction } from "../../utils/functions/StyleFunction";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Drawer,
  Grid,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import BaseLayer from "../../layers/BaseLayer";

const geojsonObject = mapConfig.geojsonObject;
const geojsonObject2 = mapConfig.geojsonObject2;
const markersLonLat = [mapConfig.kansasCityLonLat, mapConfig.blueSpringsLonLat];

const Home = () => {
  const [center, setCenter] = useState(fromLonLat([0, 0]));
  const [zoom, setZoom] = useState(1);
  const [drawType, setDrawType] = useState("Point");
  const [drawInteraction, setDrawInteraction] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);

  const [showLayer1, setShowLayer1] = useState(false);
  const [showLayer2, setShowLayer2] = useState(true);
  const [showMarker, setShowMarker] = useState(true);

  const [features, setFeatures] = useState({
    type: "FeatureCollection",
    features: [],
  });
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
        const response = await fetchHomeGeoData("sf:archsites");
        const response2 = await fetchHomeGeoData("PostgressSQL:gs_us_states");

        setSampleFeatures(response.data);
        setFeatures(response2.data);
        setCenter([-11551420.707639957,5531805.937076705])
        //setZoom(9)
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

    if (drawnFeature.type === drawType) {
      console.log(drawnFeature, drawType, "drawnFeature");

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

  const handleDrawerClick = () => {
    setOpenDrawer(true);
  };

  const drawerMenu = (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "start" }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => setOpenDrawer(false)}
        >
          <KeyboardDoubleArrowLeftIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ my: 1 }}>
        <label style={{ marginRight: 0 }}>
          Draw Type:
          <select value={drawType} onChange={handleChangeDrawType}>
            <option value="Point">Point</option>
            <option value="LineString">Line</option>
            <option value="Polygon">Polygon</option>
          </select>
        </label>
      </Box>
      {/* <button onClick={handleSubmitAction}>Submit</button> */}
      <ButtonGroup sx={{ m: 0 }}>
        <Button
          className="drawer-menu-bt1"
          sx={{ p: 3 }}
          onClick={() => setDrawType("LineString")}
        ></Button>
        <Button
          className="drawer-menu-bt2"
          sx={{ p: 3 }}
          onClick={() => setDrawType("Polygon")}
        ></Button>
      </ButtonGroup>
    </Box>
  );

  return (
    <Grid container spacing={2} sx={{p:2}}>
      <Grid item xs={10}>
        <Map
          center={center}
          zoom={zoom}
          drawnFeatureCoordinates={drawnFeatureCoordinates}
          setDrawnFeatureCoordinates={setDrawnFeatureCoordinates}
        >
          <Layers>
            <BaseLayer zIndex={10} />
            {/* <TileLayer source={mapSource} zIndex={0} /> */}

            {showLayer2 && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(sampleFeatures, {
                  featureProjection: get("EPSG:3857"),
                }),
              })}
              style={styleFunction}
              zIndex={1}
            />
          )}
           {showLayer1 && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(features, {
                  featureProjection: get("EPSG:3857"),
                }),
              })}
              style={styleFunction}
            />
          )}
            {/* <DrawInteractions
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
            /> */}
            {/* {showMarker && <VectorLayer source={vector({ features })} />} */}
          </Layers>
          <Controls>
            <FullScreenControl />
            <ZoomControl />
            <LocationControl />
          </Controls>
        </Map>
      </Grid>

      <Grid item xs={2} p={0} sx={{ backgroundColor: "white" }}>
        {/* <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerClick}
          //sx={{right:0,top:200,color:'white'}}
        >
          <MenuIcon />
        </IconButton> */}
        {/* <Drawer
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          sx={{
            width: 'auto',
            "& .MuiDrawer-paper": {
              width: 'auto',
              
            },
          }}
          variant="permanent"
          anchor="right"
        > */}
        <Box sx={{paddingLeft:0}}>
          <Box sx={{ display: "flex", justifyContent: "start" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setOpenDrawer(false)}
            >
              <KeyboardDoubleArrowLeftIcon />
            </IconButton>
          </Box>
          <Divider />
          <Box sx={{ my: 1 }}>
            <label style={{ marginRight: 0 }}>
              Draw Type:
              <select value={drawType} onChange={handleChangeDrawType}>
                <option value="Point">Point</option>
                <option value="LineString">Line</option>
                <option value="Polygon">Polygon</option>
              </select>
            </label>
          </Box>
          {/* <button onClick={handleSubmitAction}>Submit</button> */}
          <ButtonGroup sx={{ m: 0 }}>
            <Button
              className="drawer-menu-bt1"
              sx={{ p: 3 }}
              onClick={() => setDrawType("LineString")}
            ></Button>
            <Button
              className="drawer-menu-bt2"
              sx={{ p: 3 }}
              onClick={() => setDrawType("Polygon")}
            ></Button>
          </ButtonGroup>
        </Box>
        {/* </Drawer> */}
      </Grid>
    </Grid>
  );
};

export default Home;
