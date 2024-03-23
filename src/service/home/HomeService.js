import {getGeoData} from '../../client/home/HomeClient';

export const fetchHomeGeoData = async(layerParam) =>{
    return await getGeoData(layerParam);
}