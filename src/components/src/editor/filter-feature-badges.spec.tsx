// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {IntlProvider} from 'react-intl';
import type {Feature, Filter} from '@kepler.gl/types';
import type {MapViewport} from '../annotations/annotation-utils';
import FilterFeatureBadges from './filter-feature-badges';

const feature = {
  type: 'Feature',
  id: 'polygon',
  properties: {},
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [0, 0],
        [2, 0],
        [2, 2],
        [0, 0]
      ]
    ]
  }
} as Feature;
const filters = [{id: 'filter', value: feature}] as Filter[];
const viewport = () =>
  ({project: jest.fn(() => [40, 60]), unproject: jest.fn(() => [2, 2])} as unknown as MapViewport);
function view(props: React.ComponentProps<typeof FilterFeatureBadges>) {
  return (
    <IntlProvider locale="en">
      <FilterFeatureBadges {...props} />
    </IntlProvider>
  );
}

describe('polygon filter badges', () => {
  test.each([undefined, null, {}])('does not render without a projectable viewport: %p', value => {
    render(view({filters, viewport: value as MapViewport}));
    expect(screen.queryByRole('button')).toBeNull();
  });

  test('skips empty values and unsupported geometry without hiding valid filters', () => {
    const vp = viewport();
    render(
      view({
        viewport: vp,
        filters: [
          {id: 'empty'},
          {id: 'point', value: {...feature, geometry: {type: 'Point', coordinates: [1, 1]}}},
          ...filters
        ] as Filter[]
      })
    );
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(vp.project).toHaveBeenCalledTimes(1);
    expect(vp.project).toHaveBeenCalledWith([2, 2]);
  });

  test.each([null, [NaN, 1], [1, Infinity]])(
    'omits invalid projected coordinates: %p',
    projected => {
      const vp = viewport();
      (vp.project as jest.Mock).mockReturnValue(projected);
      render(view({filters, viewport: vp}));
      expect(screen.queryByRole('button')).toBeNull();
    }
  );

  test('selects the original feature without propagating the click to the map', () => {
    const onSelect = jest.fn();
    const onMapClick = jest.fn();
    render(<div onClick={onMapClick}>{view({filters, viewport: viewport(), onSelect})}</div>);
    fireEvent.click(screen.getByRole('button', {name: 'Polygon filter'}));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(feature);
    expect(onMapClick).not.toHaveBeenCalled();
  });

  test('supports an absent selection handler', () => {
    render(view({filters, viewport: viewport()}));
    expect(() => fireEvent.click(screen.getByRole('button'))).not.toThrow();
  });

  test('hides the back side only in globe mode and responds to viewport changes', () => {
    const back = viewport();
    (back.unproject as jest.Mock).mockReturnValue([180, 0]);
    const {rerender} = render(view({filters, viewport: back, isGlobeEnabled: true}));
    expect(screen.queryByRole('button')).toBeNull();
    rerender(view({filters, viewport: viewport(), isGlobeEnabled: true}));
    expect(screen.getAllByRole('button')).toHaveLength(1);
    rerender(view({filters, viewport: back, isGlobeEnabled: false}));
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });
});
