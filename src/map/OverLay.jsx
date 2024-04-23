import React, { useEffect } from "react";
import MapContext from "../state-management/MapContext";

const OverLay =() =>{
    const { map } = useContext(MapContext);

    useEffect(()=>{

    },[])

    return(
        <div></div>
    )
}

export default OverLay;