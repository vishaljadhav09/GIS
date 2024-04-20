import { Circle as CircleStyle, Fill, Stroke, Style,Icon } from 'ol/style';

export const styleFunction = (feature) => {
    const geometryType = feature.getGeometry().getType();
    let style;

    if (geometryType === 'Point') {
      style =new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'https://cdn2.iconfinder.com/data/icons/social-media-and-payment/64/-47-32.png'
        })
      })
    } else if (geometryType === 'Polygon') {
      style = new Style({
        fill: new Fill({ color: 'rgba(255, 255, 0, 0.2)' }),
        stroke: new Stroke({ color: 'blue', width: 2 }),
      });
    }else if (geometryType === 'MultiPolygon') {
      style = new Style({
        fill: new Fill({ color: 'rgba(0, 255, 0, 0.2)' }), // Green fill for MultiPolygon
        stroke: new Stroke({ color: 'green', width: 2 }), // Green stroke for MultiPolygon
      });
    }else if (geometryType === 'MultiLineString') {
      style = new Style({
        stroke: new Stroke({ color: 'red', width: 2 }), // Red stroke for MultiLineString
      });
    }
    return style;
  };