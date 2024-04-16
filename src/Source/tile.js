import  * as olSource from "ol/source";

function Tile() {
  // return new TileSource({
  //   url: 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi',
  //   params:{
  //     'LAYERS': 'MODIS_Aqua_CorrectedReflectance_TrueColor',
  //     'TILED': true
  // },
   
  // });

  return new olSource();
}

export default Tile;
