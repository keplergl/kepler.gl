import Long from 'long';
import {S2} from 's2-geometry';

export function getS2Center(s2Token) {
  const paddedToken = s2Token.padEnd(16, '0');
  const s2Id = Long.fromString(paddedToken, 16);
  const {lat, lng} = S2.idToLatLng(s2Id.toString());
  return [lng, lat];
}
