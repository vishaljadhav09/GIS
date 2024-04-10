import React, { useEffect,useState ,useContext} from 'react';
import { Draw, Modify, Snap } from 'ol/interaction';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import MapContext from "../state-management/MapContext";
import { WFS } from 'ol/format';

const DrawInteractions = ({ source, style, zIndex = 0,drawnFeatureCoordinates,drawType,onDrawEnd }) => {
  const { map } = useContext(MapContext);
  const format = new WFS();
  const [drawInteraction, setDrawInteraction] = useState(null);

    useEffect(() => {
      if (!map) return; //

    	let vectorLayer = new VectorLayer({
        source,
        style
      });

      map.addLayer(vectorLayer);
      vectorLayer.setZIndex(zIndex);

      const draw = new Draw({
        source: source,
        type: drawType,
      });
  
      // const modify = new Modify({ source: source });
      // const snap = new Snap({ source: source });
      setDrawInteraction(draw);
      map.addInteraction(draw);
      // map.addInteraction(modify);
      // map.addInteraction(snap);
  
      draw.on('drawend', (event) => {
        const feature = event.feature;
       // drawnFeatureCoordinates.push(feature);
        const geometry = feature.getGeometry();
        // feature.set('geometry', geometry);
  
        // // Prepare WFS transaction payload
        // const node = format.writeTransaction(
        //   [feature],
        //   null,
        //   null,
        //   {
        //     gmlOptions: { srsName: 'EPSG:3857' },
        //     featureNS: 'fiware', // Namespace of the feature
        //     featureType: 'nyc_buildings', // Type of the feature
        //   }
        // );
       // drawnFeatureCoordinates.push({ type: drawType, coordinates: geometry.getCoordinates() })
        // Pass the drawn feature to the parent component
        if (typeof onDrawEnd === 'function') {
          onDrawEnd({ type: drawType, coordinates: geometry.getCoordinates() });
        }
  
        // Use node for further processing (e.g., posting to GeoServer)
        //console.log('WFS transaction payload:', node);
      });
  
      return () => {
         // map.removeInteraction(drawInteraction);
    
          //map.removeLayer(vectorLayer);
      };
    }, [map , drawType]);
  
   
  
      return null;
  };// No need to render anything


export default DrawInteractions;
