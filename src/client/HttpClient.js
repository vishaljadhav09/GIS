import axios from 'axios';
import * as Qs from 'qs';

const SERVER_BASE_PATH = 'http://localhost:8085/geoserver/wfs';

const resolveQueryString = (params) => {
    return Qs.stringify(params, { indices: false });
  };

const getCommonParams = {
    service: 'WFS',
    version: '1.1.0',
    request: 'GetFeature',
    srsname: 'EPSG:4326',
    outputFormat: 'application/json'
};

export const getServerBasePath = () =>{
    return SERVER_BASE_PATH;
}

  const httpAxios = axios.create({
    baseURL: "",
    withCredentials: true
  });

  export const getRequest = (url, layerParam) => {
    return httpAxios({
      method: 'get',
      url: url,
      params: layerParam ? {...getCommonParams , typeName : layerParam } : {...getCommonParams },
      paramsSerializer: (queryParams) => resolveQueryString(queryParams)
    });
  };