// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {render, screen} from '@testing-library/react';
import {getCategoricalColormapDataUrl, RasterLayerResources} from '@kepler.gl/layers';
import {ColorMapListItem, getColorMapListItemComponent} from './raster-tile-colormap-list-item';

jest.mock('@kepler.gl/layers', () => ({
  getCategoricalColormapDataUrl: jest.fn(),
  RasterLayerResources: {rasterColorMap: jest.fn()}
}));

const categoricalOptions = {minValue: 0, maxValue: 12};
const categorical = {id: '_categorical', label: 'Categories'};

beforeEach(() => jest.resetAllMocks());

test('uses the selected continuous palette resource rather than categorical colors', () => {
  (RasterLayerResources.rasterColorMap as jest.Mock).mockReturnValue('/palettes/viridis.png');
  render(
    <ColorMapListItem
      value={{id: 'viridis', label: 'Viridis'}}
      categoricalOptions={categoricalOptions}
    />
  );
  expect(screen.getByRole('img')).toHaveAttribute('src', '/palettes/viridis.png');
  expect(RasterLayerResources.rasterColorMap).toHaveBeenCalledWith('viridis');
  expect(getCategoricalColormapDataUrl).not.toHaveBeenCalled();
});

test('renders a categorical preview generated from the supplied categories', () => {
  const url = 'data:image/png;base64,cHJldmlldw==';
  (getCategoricalColormapDataUrl as jest.Mock).mockReturnValue(url);
  render(<ColorMapListItem value={categorical} categoricalOptions={categoricalOptions} />);
  expect(screen.getByRole('img')).toHaveAttribute('src', url);
  expect(getCategoricalColormapDataUrl).toHaveBeenCalledWith(categoricalOptions);
  expect(RasterLayerResources.rasterColorMap).not.toHaveBeenCalled();
});

test('keeps the option label without rendering a broken image when no categorical preview exists', () => {
  (getCategoricalColormapDataUrl as jest.Mock).mockReturnValue(null);
  render(<ColorMapListItem value={categorical} categoricalOptions={categoricalOptions} />);
  expect(screen.queryByRole('img')).toBeNull();
  expect(screen.getByText('Categories')).toBeInTheDocument();
  expect(RasterLayerResources.rasterColorMap).not.toHaveBeenCalled();
});

test('binds category options in the list-item factory and updates the selected palette', () => {
  (getCategoricalColormapDataUrl as jest.Mock).mockReturnValue('data:image/png;base64,YQ==');
  (RasterLayerResources.rasterColorMap as jest.Mock).mockReturnValue('/palettes/magma.png');
  const Item = getColorMapListItemComponent(categoricalOptions);
  const {rerender} = render(<Item value={categorical} />);
  expect(getCategoricalColormapDataUrl).toHaveBeenCalledWith(categoricalOptions);
  rerender(<Item value={{id: 'magma', label: 'Magma'}} />);
  expect(screen.getByRole('img')).toHaveAttribute('src', '/palettes/magma.png');
  expect(screen.queryByText('Categories')).toBeNull();
});
