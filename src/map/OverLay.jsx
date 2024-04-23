import React, { useContext, useEffect } from "react";
import MapContext from "../state-management/MapContext";
import { Overlay } from "ol";

const OverLay = ({ position,isOverlayVisible,data }) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;


    const overlayelement = document.querySelector('.overlay-container');
    const overlay = new Overlay({
      element: overlayelement,
      stopEvent:false
    });
    map.addOverlay(overlay);
    const overlayFeactureName = document.getElementById('feacture-name');
	const overlayFeactureAdditionalInfo = document.getElementById('feacture-Additional-info');


    if(overlayFeactureName && overlayFeactureAdditionalInfo){
        overlayFeactureName.innerText = data?.str1;
        overlayFeactureAdditionalInfo.innerHTML =  data?.cat;

      }

      if (overlay && isOverlayVisible) {
        overlay.setPosition(position);
        overlay.setPositioning('top-center');
      }


  }, [position]);

  return (
    <div class="overlay-container" id="overlay-div">
      <span class="overlay-text" id="feacture-name"></span>
      <br />
      <span class="overlay-text" id="feacture-Additional-info"></span>
      <br />
    </div>
  );
};

export default OverLay;
