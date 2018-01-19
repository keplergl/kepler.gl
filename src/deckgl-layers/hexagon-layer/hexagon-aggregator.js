import {hexbin} from 'd3-hexbin';

/**
 * Use d3-hexbin to performs hexagonal binning from geo points to hexagons
 * @param {Array} data - array of points
 * @param {Number} radius - hexagon radius in meter
 * @param {function} getPosition - get points lon lat
 * @param {Object} viewport - current viewport object

 * @return {Object} - hexagons and countRange
 */
export function pointToHexbin({data, radius, getPosition}, viewport) {
  // get hexagon radius in mercator world unit
  const radiusInPixel = getRadiusInPixel(radius, viewport);

  // add world space coordinates to points
  // filter empty bins
  const screenPoints = data.reduce((accu, pt) => {
    const lat = getPosition(pt)[1];
    const lng = getPosition(pt)[0];

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return accu;
    }

    accu.push(
      Object.assign(
        {
          screenCoord: viewport.projectFlat(getPosition(pt))
        },
        pt
      )
    );

    return accu;
  }, []);

  const newHexbin = hexbin()
    .radius(radiusInPixel)
    .x(d => d.screenCoord[0])
    .y(d => d.screenCoord[1]);

  const hexagonBins = newHexbin(screenPoints);

  return {
    hexagons: hexagonBins.map((hex, index) => ({
      centroid: viewport.unprojectFlat([hex.x, hex.y]),
      points: hex,
      index
    }))
  };
}

/**
 * Get radius in mercator world space coordinates from meter
 * @param {Number} radius - in meter
 * @param {Object} viewport - current viewport object

 * @return {Number} radius in mercator world spcae coordinates
 */
export function getRadiusInPixel(radius, viewport) {
  const {pixelsPerMeter} = viewport.getDistanceScales();

  // x, y distance should be the same
  return radius * pixelsPerMeter[0];
}
