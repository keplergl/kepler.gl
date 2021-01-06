import {FunctionComponent} from 'react';
import {Filter} from 'reducers';
import {Layer} from 'layers';

export type PolygonFilterProps = {
  filter: Filter,
  layers: ReadonlyArray<Layer>,
  setLayers: (ids: ReadonlyArray<string>) => void
};

export const PolygonFilter: FunctionComponent<PolygonFilterProps>;

export default function PolygonFilterFactory(): PolygonFilter;
