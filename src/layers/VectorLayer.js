import { useContext, useEffect } from "react";
import MapContext from "../state-management/MapContext";
import OLVectorLayer from "ol/layer/Vector";
import { Overlay } from "ol";
import { WKT } from "ol/format";
import { fromLonLat } from "ol/proj";

const VectorLayer = ({ source, style, zIndex,setOverlayPosition,setIsOverlayVisible,setOverlayData,setCenter }) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    let vectorLayer = new OLVectorLayer({
      source,
      style,
      maxZoom: 25, // overlapping with tilelayer2 at viewZoom == 2
      // fade out at viewZoom == 2
      opacity: 1,
      minZoom:0, // initially visible (start layer) and in foreground
      zIndex: 1,
      
    });


    map.addLayer(vectorLayer);
    vectorLayer.setZIndex(zIndex);

    
	const overlayFeactureName = document.getElementById('feacture-name');
	const overlayFeactureAdditionalInfo = document.getElementById('feacture-Additional-info');
    if (map) {

      map.on("click", function (e) {
    //     const overlay = map.getOverlays().item(2);
    // console.log(map.getOverlays(),'in vector')

		 //overlay.setPosition(undefined);
     setOverlayPosition(undefined);
        map.forEachFeatureAtPixel(e.pixel, function (feacture, layer) {
          setIsOverlayVisible(true);

			let coordinates = e.coordinate;
          let clickedFeactureName = feacture.get("str1");
          let clickedFeactureAdditionalInfo = feacture.get("cat");
          //setIsOverlayVisible(true);
          setOverlayPosition(coordinates);
          setCenter(coordinates);
          setOverlayData({
            str1:clickedFeactureName,
            cat:clickedFeactureAdditionalInfo
          })
        //overlay.setPosition(coordinates);
		  if(overlayFeactureName && overlayFeactureAdditionalInfo){
			overlayFeactureName.innerText = clickedFeactureName;
			overlayFeactureAdditionalInfo.innerHTML = clickedFeactureAdditionalInfo;

		  }
	
        });
      });
    }

    vectorLayer.once('change', function () {
      vectorLayer.getSource().forEachFeature(function (feature) {
      });
  });

    vectorLayer.getSource().once('change', function (event) {
      if (event.target.getState() === 'ready') {
        const features = vectorLayer.getSource().getFeatures();
        console.log("kml file features",vectorLayer.getSource().getFeatures());
        var formatWKT = new WKT();
        features.forEach(function (feature) {
          console.log("features",feature.getProperties());
          var wkt = formatWKT.writeGeometry(feature.getGeometry());
          console.log("wkt", wkt);
      });
      }
    });
    return () => {
      if (map) {
    //     map.removeLayer(vectorLayer);
		// map.removeOverlay(overlay);
      }
    };
  }, [source,map,zIndex]);

  return (
	null
  );
};

export default VectorLayer;
