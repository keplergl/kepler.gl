import {FunctionComponent} from 'react';
import {Viewport} from 'reducers/map-state-updaters';
import {IntlShape} from 'react-intl';

interface Result {
  center: [number, number],
  place_name: string
}

export type Results = ReadonlyArray<Result>;

type GeocoderProps = {
  mapboxApiAccessToken: string,
  className?: string,
  limit?: number,
  timeout?: number,
  formatItem?: (item: Result) => string,
  viewport: Viewport,
  onSelected: (viewport: Viewport, item: Result) => void,
  onDeleteMarker: () => void,
  transitionDuration: number,
  pointZoom: number,
  width: number
};

type IntlProps = {
  intl: IntlShape
};

export type GeocoderComponent = FunctionComponent<GeocoderPropsProps & IntlProps>;

const Geocoder: FunctionComponent<GeocoderPropsProps>;
export default Geocoder;
