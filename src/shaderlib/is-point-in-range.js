export default `\

const float R_EARTH = 6371000.; // earth radius in meter

// uniform for brushing
uniform vec2 mousePos;
uniform float brushRadius;

// approximate distance between lng lat in meters
float distanceBetweenLatLng(vec2 source, vec2 target) {

  vec2 delta = (source - target) * PI / 180.;

  float a =
    sin(delta.y / 2.) * sin(delta.y / 2.) +
    cos(source.y * PI / 180.) * cos(target.y * PI / 180.) *
    sin(delta.x / 2.) * sin(delta.x / 2.);

  float c = 2. * atan(sqrt(a), sqrt(1. - a));

  return R_EARTH * c;
}

// range is km
float isPointInRange(vec2 ptLatLng, float enabled) {

  return float(enabled <= 0. || distanceBetweenLatLng(ptLatLng, mousePos) <= brushRadius);
}
`;
