const {h3ToGeo, h3ToGeoBoundary} = require('@uber/h3-transitional');
// process.env.BROWSER || process.env.NODE_ENV === 'test'
//   ? require('@uber/h3-transitional')
//   : {h3ToGeo: null, h3ToGeoBoundary: null, V2: null};

// get vertices should return [lon, lat]
export function getVertices({id}) {
  // always reverse it
  return h3ToGeoBoundary(id).map(d => d.reverse());
}

// get centroid should return [lon, lat]
export function getCentroid({id}) {
  // always reverse it to [lng, lat]
  return h3ToGeo(id).reverse();
}

export function idToPolygonGeo({object}, properties) {
  if (!object || !object.id) {
    return null;
  }

  const vertices = getVertices(object);

  return {
    geometry: {
      coordinates: [...vertices, vertices[0]],
      type: 'LineString'
    },
    properties
  };
}
