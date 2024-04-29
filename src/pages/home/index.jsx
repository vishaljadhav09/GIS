import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EngineeringIcon from "@mui/icons-material/Engineering";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Divider,
  Drawer,
  Grid,
  IconButton
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import Feature from "ol/Feature";
import GeoJSON from "ol/format/GeoJSON";
import Point from "ol/geom/Point";
import { fromLonLat, get } from "ol/proj";
import { Icon, Style } from "ol/style";
import React, { useEffect, useState } from "react";
import "../../App.css";
import { osm, vector } from "../../Source";
import ProjectCard from "../../components/ProjectCard";
import mapConfig from "../../config.json";
import { Controls, FullScreenControl, ZoomControl } from "../../controls";
import LocationControl from "../../controls/LocationControl";
import { Layers, VectorLayer } from "../../layers";
import BaseLayer from "../../layers/BaseLayer";
import Map from "../../map";
import OverLay from "../../map/OverLay";
import {
  fetchHomeGeoData,
  submitGeoData,
} from "../../service/home/HomeService";
import { styleFunction } from "../../utils/functions/StyleFunction";
const projectDrawerWidth = 270;

const Main = styled("main", {
  shouldForwardProp: (prop) =>
    prop !== "openLeftDrawer" && prop !== "openRightDrawer",
})(({ theme, openLeftDrawer, openRightDrawer }) => ({
  flexGrow: 1,
  padding: 0,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: openLeftDrawer
    ? 0
    : openRightDrawer
    ? `-${projectDrawerWidth}px`
    : `-${projectDrawerWidth * 2}px`,
  marginRight: openRightDrawer
    ? 0
    : openLeftDrawer
    ? `-${projectDrawerWidth}px`
    : `-10px`,

  ...(openLeftDrawer && {
    marginLeft: `-${projectDrawerWidth}px`,
    marginRight: `0px`,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),

  ...(openRightDrawer && {
    marginRight: `${projectDrawerWidth}px`,
    marginLeft: `-${projectDrawerWidth *2}px`,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),

  ...(openLeftDrawer &&
    openRightDrawer && {
      marginLeft: `-${projectDrawerWidth}px`, // Increase margin for both drawers
      marginRight: projectDrawerWidth, // Increase margin for both drawers
    }),
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) =>
    prop !== "openLeftDrawer" && prop !== "openRightDrawer",
})(({ theme, openLeftDrawer, openRightDrawer }) => ({
  padding: 0,
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: openLeftDrawer
    ? `-20px`
    : openRightDrawer
    ? `-40px`
    : 0, // Adjust margin when left or right drawer is open
  width:
    openLeftDrawer && openRightDrawer
      ? `calc(100% - ${projectDrawerWidth * 2}px)`
      : openLeftDrawer || openRightDrawer
      ? `calc(100% - 0px)`
      : "100%", // Adjust width when any drawer is open

  ...(openLeftDrawer &&
    !openRightDrawer && {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  ...(openRightDrawer &&
    !openLeftDrawer && {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "start",
  padding: 0,
  margin: 0,
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Home = () => {
  const [center, setCenter] = useState(fromLonLat([0, 0]));
  const [zoom, setZoom] = useState(1);
  const [drawType, setDrawType] = useState("Point");
  const [drawInteraction, setDrawInteraction] = useState(null);
  const [isDrawEnable, setIsDrawEnable] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [overlayPosition, setOverlayPosition] = useState([0, 0]);
  const [overlayData, setOverlayData] = useState({});
  const [openLeftDrawer, setOpen] = useState(false);
  const [openRightDrawer, setOpenRightDrawer] = useState(false);
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
  const theme = useTheme();

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
        setCenter([-11551420.707639957, 5531805.937076705]);
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
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSubmitAction = async () => {
    try {
      const res = await submitGeoData(drawnFeatureCoordinates);
      console.log(res.json(), "res");
    } catch (error) {
      console.log(error);
    }
  };

  const handleProjectCardClick = (feacture) => {
    setIsOverlayVisible(true);
    let clickedFeactureName = feacture.properties.str1;
    let clickedFeactureAdditionalInfo = feacture.properties.cat;
    setOverlayData({
      str1: clickedFeactureName || "",
      cat: clickedFeactureAdditionalInfo || "",
    });
    setOverlayPosition(fromLonLat(feacture.geometry.coordinates));
    setCenter(fromLonLat(feacture.geometry.coordinates));
    setZoom(15);
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12}>
        <Box sx={{ display: "flex", padding: 0 }}>
          <AppBar
            sx={{
              backgroundColor: "white",
              color: "black",
              boxShadow: 0,
              padding: 0,
            }}
            position="fixed"
            openLeftDrawer={openLeftDrawer}
            openRightDrawer={openRightDrawer}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignContent: "space-between",
              }}
            >
              <Box>
                {!openLeftDrawer && (
                  <IconButton
                    color="inherit"
                    onClick={handleDrawerOpen}
                    edge="center"
                    size="large"
                    //sx={{ ml: 0, ...(openLeftDrawer && { display: "none" }) }}
                    // sx={{ m:0.3}}
                  >
                    <MenuIcon />
                  </IconButton>
                )}
              </Box>

              <IconButton
                color="inherit"
                onClick={() => setOpenRightDrawer(!openRightDrawer)}
                edge="center"
                size="large"
                // sx={{ m:0.3}}
                sx={{ ml: 0, ...(openRightDrawer && { display: "none" }) }}
              >
                <EngineeringIcon />
              </IconButton>
            </Box>
          </AppBar>
          <Drawer
            padding={0}
            sx={{
              width: projectDrawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: projectDrawerWidth,
                boxSizing: "border-box",
              },
            }}
            variant="persistent"
            anchor="left"
            open={openLeftDrawer}
          >
               <Box sx={{width:'100%',display:'flex',flexDirection:'row',justifyContent:'end'}}>
            <IconButton onClick={() => setOpen(false)}>
                  <ChevronLeftIcon />
              </IconButton>
            </Box>
         
            <Divider />
            <Box sx={{ maxHeight: 500, overflow: "auto" }}>
              {sampleFeatures.features.map((feacture, index) => {
                return (
                  <Box
                    key={index}
                    sx={{ my:2 }}
                    onClick={() => handleProjectCardClick(feacture)}
                  >
                    <ProjectCard
                      header={feacture.properties.str1}
                      body={feacture.properties.cat}
                    />
                  </Box>
                );
              })}
            </Box>

            <Divider />
          </Drawer>
          <Drawer
            padding={0}
            sx={{
              width: projectDrawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: projectDrawerWidth,
                boxSizing: "border-box",
              },
            }}
            variant="persistent"
            anchor="right"
            open={openRightDrawer}
          >
            <Box>
            <IconButton onClick={() => setOpenRightDrawer(false)}>
                  <ChevronRightIcon />
              </IconButton>
            </Box>
        
            <Divider />

            <Divider />
          </Drawer>
          <Main
            openLeftDrawer={openLeftDrawer}
            openRightDrawer={openRightDrawer}
          >
            <Box sx={{ height: 33 }}></Box>
            {/* <DrawerHeader /> */}
            <Map
              center={center}
              zoom={zoom}
              drawnFeatureCoordinates={drawnFeatureCoordinates}
              setDrawnFeatureCoordinates={setDrawnFeatureCoordinates}
            >
              <Layers>
                <BaseLayer zIndex={10} />

                {showLayer2 && (
                  <VectorLayer
                    source={vector({
                      features: new GeoJSON().readFeatures(sampleFeatures, {
                        featureProjection: get("EPSG:3857"),
                      }),
                    })}
                    style={styleFunction}
                    zIndex={1}
                    setIsOverlayVisible={setIsOverlayVisible}
                    setOverlayPosition={setOverlayPosition}
                    setOverlayData={setOverlayData}
                    setCenter={setCenter}
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
                    zIndex={10}
                    setCenter={setCenter}
                    setIsOverlayVisible={setIsOverlayVisible}
                  />
                )}
                {/* //For kmz file */}
                {/* <VectorLayer
              source={
                new Vector({
                  url: "https://openlayers.org/en/latest/examples/data/kml/2012-02-10.kml",
                  format: new KML(),
                })
              }
              style={styleFunction}
            /> */}
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
              <OverLay
                position={overlayPosition}
                isOverlayVisible={isOverlayVisible}
                data={overlayData}
              />
            </Map>
          </Main>
        </Box>
      </Grid>

      {/* <Grid item xs={3} p={0} sx={{ backgroundColor: "white" }}>
        <Box sx={{ paddingLeft: 0 }}>
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              alignContent: "space-between",
            }}
          >
            <Typography>Edit : </Typography>
            <ButtonGroup sx={{ ml: 1 }}>
              <Button
                sx={{ p: 0 }}
                onClick={() => setIsDrawEnable(true)}
                variant={isDrawEnable ? "contained" : "outlined"}
              >
                Yes
              </Button>
              <Button
                sx={{ p: 0 }}
                onClick={() => setIsDrawEnable(false)}
                variant={isDrawEnable ? "outlined" : "contained"}
              >
                No
              </Button>
            </ButtonGroup>
          </Box>
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
          <ButtonGroup sx={{ m: 0 }}>
            <Button
              className="drawer-menu-bt1"
              sx={{ p: 2 }}
              variant={drawType === "LineString" ? "contained" : "outlined"}
              onClick={() => setDrawType("LineString")}
            ></Button>
            <Button
              className="drawer-menu-bt2"
              variant={drawType === "Polygon" ? "contained" : "outlined"}
              sx={{ p: 2 }}
              onClick={() => setDrawType("Polygon")}
            ></Button>
          </ButtonGroup>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            maxHeight: 400,
            overflow: "auto",
          }}
        ></Box>
      </Grid> */}
    </Grid>
  );
};

export default Home;
