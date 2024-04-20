import {ol} from "ol";
import OLTileLayer from "ol/layer/Tile";
import { useContext, useEffect } from "react";
import MapContext from "../state-management/MapContext";
import { OSM, Tile, XYZ } from "ol/source";
import { Group } from "ol/layer";
import LayerSwitcher from 'ol-layerswitcher';
//import 'ol/ol.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import { osm } from "../Source";
import * as olSource from "ol/source";


const BaseLayer = ({ zIndex }) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

   
    const osmLayer = new OLTileLayer({
      title: "OSM",
      type: "base",
      visible: true,
      maxZoom:28,
      source: new OSM(),
    });

    const esriSatellite = new OLTileLayer({
      title: "Satellite",
      type: "base",
      visible: true,
      source: new XYZ({
        attributions: [
          "Powered by Esri",
          "Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community",
        ],
        attributionsCollapsible: false,
        maxZoom:28,
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        
      }),
    });

    const OpenstreetHimanitarianMap = new OLTileLayer({
      source : new olSource.OSM({
        url : "https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      }),
      visible:false,
      type: "base",
      maxZoom:28,
      title:'OSMHumanitarian'
    });

    const topographicLayer = new OLTileLayer({
      title: "Topographic Layer",
      type: "base",
      visible: false,
      source: new XYZ({
        url: "https://a.tile.opentopomap.org/{z}/{x}/{y}.png", // Replace tiles.example.com with the actual domain of your extra free layer
      }),
    });

    var base_maps = new Group({
      title: "Base maps",
      layers: [ esriSatellite,osmLayer,OpenstreetHimanitarianMap,topographicLayer],
    });

    map.addLayer(base_maps);
    const layerSwitcher = new LayerSwitcher({reverse: false,groupSelectStyle: 'group'});
    map.addControl(layerSwitcher);
    //tileLayer.setZIndex(zIndex);

    return () => {
      if (map) {
        map.removeControl(layerSwitcher);
      }
    };
  }, [zIndex,map]);

  return null;
};

export default BaseLayer;
