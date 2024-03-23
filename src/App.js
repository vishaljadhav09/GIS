import React, { useEffect } from 'react';
import axios from 'axios';
import {getGeoData} from './client/home/HomeClient';
import { fetchHomeGeoData} from './service/home/HomeService';

function App() {


  function parseResponse(responseData) {
    const features = responseData.features.map(feature => ({
      type: 'Feature',
      geometry: {
        type: feature.geometry?.type,
        coordinates: feature.geometry?.coordinates
      },
      properties: feature?.properties
    }));
  
    const geoJSON = {
      type: 'FeatureCollection',
      features: features
    };
  
    return geoJSON;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchHomeGeoData('sf:archsites')
        // Handle response data
     
        const geoJSON = parseResponse(response.data);
console.log(geoJSON,'geoJSON');// Your response data
      } catch (error) {
        // Handle error
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Ensure useEffect runs only once on component mount

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
}

export default App;
