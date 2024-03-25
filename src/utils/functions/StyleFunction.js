import { Circle as CircleStyle, Fill, Stroke, Style,Icon } from 'ol/style';

export const styleFunction = (feature) => {
    const geometryType = feature.getGeometry().getType();
    let style;

    if (geometryType === 'Point') {
      style = new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({ color: 'blue' }),
          stroke: new Stroke({ color: 'white', width: 2 }),
        }),
      });
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