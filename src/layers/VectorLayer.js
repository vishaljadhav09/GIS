import { useContext, useEffect } from "react";
import MapContext from "../state-management/MapContext";
import OLVectorLayer from "ol/layer/Vector";
import { Overlay } from "ol";

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
