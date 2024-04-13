import React, { useContext, useEffect, useState } from "react";
import { Zoom } from "ol/control";
import MapContext from "../state-management/MapContext";

const ZoomControl = ({label}) =>{
    const { map } = useContext(MapContext);
    useEffect(()=>{
        if (!map) return;

        const zoom = new Zoom({});
        map.addControl(zoom);

        return () => map.controls.remove(Zoom);
    } , [map])
    return null;
}

export default ZoomControl;