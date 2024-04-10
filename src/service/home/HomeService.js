import {getGeoData,postGeoData} from '../../client/home/HomeClient';

export const fetchHomeGeoData = async(layerParam) =>{
    return await getGeoData(layerParam);
}

export const submitGeoData =async(drawnFeatures)=>{
    const geoJSONData = {
        type: 'FeatureCollection',
        features: drawnFeatures,
      };
    return await postGeoData(geoJSONData);
}