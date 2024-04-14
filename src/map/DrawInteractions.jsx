import React, { useEffect,useState ,useContext} from 'react';
import { Draw, Modify, Snap } from 'ol/interaction';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import MapContext from "../state-management/MapContext";
import { WFS } from 'ol/format';
import WKT from 'ol/format/WKT.js';

const DrawInteractions = ({ source, style, zIndex = 0,drawnFeatureCoordinates,drawType,onDrawEnd,minZoom,maxZoom }) => {
  const { map } = useContext(MapContext);
  const format = new WFS();
  const WKTFormat = new WKT();
  const [drawInteraction, setDrawInteraction] = useState(null);
  const [vectorLayer, setVectorLayer] = useState(null);
  const [coordinates, setCoordinates] = useState([]);


    useEffect(() => {
      if (!map) return; //

    const layer = new VectorLayer({
      source: source,
      style : style,
     
      
    });
   
    map.addLayer(layer);
    // setVectorLayer(layer);
   ///map.setView(source.getView());
    const draw = new Draw({
      source: source,
      type: drawType,

    });

    const modify = new Modify({ source: source,
      style : style ,
      
    });
    const snap = new Snap({ source: source });

    //map.addInteraction(draw);
    map.addInteraction(modify);
    //map.addInteraction(snap);

    setDrawInteraction(modify);

    modify.on('modifyend', (event) => {
      const feature = event.feature;
      // const geometry = feature.getGeometry();
      // const coords = geometry.getCoordinates();
   // const wktTemp =  WKTFormat.writeGeometry(feature.getGeometry());
      console.log(event,'wktTemp')
     // setCoordinates(coords);
      // if(geometry.getType() === drawType){
      //   console.log(geometry.getType(),'feature')
      // drawnFeatureCoordinates.push(feature);
      // }
      // if (typeof onDrawEnd === 'function') {
      //   if(geometry.getType() === drawType){
      //   onDrawEnd({ type: drawType, coordinates: coords });
      //   }
      // }
    });

    return () => {
      if (drawInteraction) {
        //map.removeInteraction(drawInteraction);
      }
      if (vectorLayer) {
        map.removeLayer(vectorLayer);
      }
    };
  }, [map,onDrawEnd, drawnFeatureCoordinates,source]);

   
  
      return null;
  };// No need to render anything

export default DrawInteractions;
