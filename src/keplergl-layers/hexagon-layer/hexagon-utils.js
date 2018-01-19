import {WebMercatorViewport} from 'deck.gl';

export function hexagonToPolygonGeo({object}, properties, radius, mapState) {
  const viewport = new WebMercatorViewport(mapState);

  const screenCenter = viewport.projectFlat(object.centroid);
  const {pixelsPerMeter} = viewport.getDistanceScales();
  const pixRadius = radius * pixelsPerMeter[0];

  const coordinates = [];

  for (let i = 0; i < 6; i++) {
    const vertex = hex_corner(screenCenter, pixRadius, i);
    coordinates.push(viewport.unprojectFlat(vertex));
  }

  coordinates.push(coordinates[0]);

  return {
    geometry: {
      coordinates,
      type: 'LineString'
    },
    properties
  };
}

function hex_corner(center, radius, i) {
  const angle_deg = 60 * i + 30;
  const angle_rad = Math.PI / 180 * angle_deg;

  return [
    center[0] + radius * Math.cos(angle_rad),
    center[1] + radius * Math.sin(angle_rad)
  ];
}
