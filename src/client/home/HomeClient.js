import { getServerBasePath,getRequest } from "../HttpClient";

export const getGeoData = async( layer ) =>{
    return getRequest(getServerBasePath() , layer );
}