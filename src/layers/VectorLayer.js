import { useContext, useEffect } from "react";
import MapContext from "../state-management/MapContext";
import OLVectorLayer from "ol/layer/Vector";
import { Overlay } from "ol";
import { WKT } from "ol/format";

const VectorLayer = ({ source, style, zIndex }) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    let vectorLayer = new OLVectorLayer({
      source,
      style,
    });
	const overlayelement = document.querySelector('.overlay-container');
    const overlay = new Overlay({
      element: overlayelement,
    });
    map.addOverlay(overlay);

    map.addLayer(vectorLayer);
    vectorLayer.setZIndex(zIndex);


	const overlayFeactureName = document.getElementById('feacture-name');
	const overlayFeactureAdditionalInfo = document.getElementById('feacture-Additional-info');
    if (map) {
      map.on("click", function (e) {
		overlay.setPosition(undefined);
        map.forEachFeatureAtPixel(e.pixel, function (feacture, layer) {
			let coordinates = e.coordinate;
          let clickedFeactureName = feacture.get("str1");
          let clickedFeactureAdditionalInfo = feacture.get("cat");
		  overlay.setPosition(coordinates);
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
