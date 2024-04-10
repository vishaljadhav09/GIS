import { getServerBasePath,getRequest,postRequest,postFeaturesToGeoServer } from "../HttpClient";

export const getGeoData = async( layer ) =>{
    return getRequest(getServerBasePath() , layer );
}

export const postGeoData =async (body) =>{
    return postRequest(getServerBasePath(),body)
}