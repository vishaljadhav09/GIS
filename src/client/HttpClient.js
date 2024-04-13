import axios from 'axios';
import * as Qs from 'qs';
import { WFS, GML } from 'ol/format';

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

  export const postRequest = (url,drawnFeaturesState,params) =>{
    const drawnFeatures = drawnFeaturesState;
  
    const featureNodes = [];
  
    drawnFeatures.forEach(drawnFeature => {
      const featureData = JSON.parse(drawnFeature.getProperties()['data']);
  
      if (featureData.iteration) {
        ++featureData.iteration;
      } else {
        featureData.iteration = 1;
      }
  
      drawnFeature.setProperties({ data: JSON.stringify(featureData) });
  
      //feature for WFS update transaction
      const wfsFormatter = new WFS();
      const gmlFormatter = new GML({
        featureNS:url,
        featureType: 'generic',
        srsName: 'EPSG:3857' // srs projection of map view
      });
  
      const node = wfsFormatter.writeTransaction(null, [drawnFeature], null, gmlFormatter);
      featureNodes.push(node);
    });
  
    // Serialize all feature nodes
    const serializedFeatures = featureNodes.map(node => {
      const xs = new XMLSerializer();
      return xs.serializeToString(node);
    });
  
    // Concatenate all serialized features
    const payload = serializedFeatures.join('');
  
    return httpAxios({
      method: 'post',
      url: url,
      params: params ? params : {},
      headers: new Headers({
        'Authorization': 'Basic ' + Buffer.from('admin:geoserver').toString('base64'),
        'Content-Type': 'text/xml'
      }),
      paramsSerializer: (queryParams) => resolveQueryString(queryParams),
      data: payload
    });
  }

  const handlePostDrawnFeatures = async (url,drawnFeaturesState) => {
    // Extract drawn features from state
    const drawnFeatures = drawnFeaturesState;
  
    // Prepare an array to store XML nodes for each feature
    const featureNodes = [];
  
    // Iterate over each drawn feature
    drawnFeatures.forEach(drawnFeature => {
      // parse feature properties
      const featureData = JSON.parse(drawnFeature.getProperties()['data']);
  
      // iterate prop to test write-back
      if (featureData.iteration) {
        ++featureData.iteration;
      } else {
        featureData.iteration = 1;
      }
  
      // set property data back to feature
      drawnFeature.setProperties({ data: JSON.stringify(featureData) });
  
      // prepare feature for WFS update transaction
      const wfsFormatter = new WFS();
      const gmlFormatter = new GML({
        featureNS:url,
        featureType: 'generic',
        srsName: 'EPSG:3857' // srs projection of map view
      });
  
      const node = wfsFormatter.writeTransaction(null, [drawnFeature], null, gmlFormatter);
      featureNodes.push(node);
    });
  
    // Serialize all feature nodes
    const serializedFeatures = featureNodes.map(node => {
      const xs = new XMLSerializer();
      return xs.serializeToString(node);
    });
  
    // Concatenate all serialized features
    const payload = serializedFeatures.join('');
  
    // execute POST
    await fetch(url + '/wfs', {
      headers: new Headers({
        'Authorization': 'Basic ' + Buffer.from('admin:myawesomegeoserver').toString('base64'),
        'Content-Type': 'text/xml'
      }),
      method: 'POST',
      body: payload
    });
  
    // clear wfs layer features to force reload from backend to ensure latest properties
    //featuresLayerRef.current.getSource().refresh();
  
    // Display success message or handle any other logic
    console.log('Drawn features successfully posted to PostGIS.');
  }