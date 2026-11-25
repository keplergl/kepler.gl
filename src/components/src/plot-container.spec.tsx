// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, render} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';

import {EXPORT_IMG_RATIOS, RESOLUTIONS} from '@kepler.gl/constants';
import {calculateExportImageSize} from '@kepler.gl/utils';
import domtoimage from '../../utils/src/dom-to-image';
import {theme} from '@kepler.gl/styles';
import {mockKeplerProps} from 'test/helpers/mock-state';

import {plotContainerSelector} from './kepler-gl';
import PlotContainerFactory from './plot-container';

test('PNG capture uses the requested size and discards an in-flight older image', async () => {
  jest.useFakeTimers();
  let resolveOldCapture!: (url: string) => void;
  const toPng = jest
    .spyOn(domtoimage, 'toPng')
    .mockImplementationOnce(() => new Promise<string>(resolve => (resolveOldCapture = resolve)))
    .mockResolvedValueOnce('data:image/png;base64,AA==')
    .mockResolvedValueOnce('data:,');
  const setImage = jest.fn();
  const setError = jest.fn();
  type MapProps = React.ComponentProps<Parameters<typeof PlotContainerFactory>[0]>;
  let mapProps!: MapProps;
  const MapContainer = (props: MapProps) => {
    mapProps = props;
    return <div />;
  };
  const Layout = ({children}: React.PropsWithChildren) => <>{children}</>;
  const Plot = PlotContainerFactory(MapContainer, Layout);
  const initialProps = plotContainerSelector(mockKeplerProps);
  const plot = (width, height) => (
    <Plot
      {...initialProps}
      imageSize={
        calculateExportImageSize({
          mapW: 1200,
          mapH: 800,
          ratio: EXPORT_IMG_RATIOS.CUSTOM,
          resolution: RESOLUTIONS.ONE_X,
          customDimensions: {width, height}
        })!
      }
      ratio={EXPORT_IMG_RATIOS.CUSTOM}
      transparentBackground
      setExportImageSetting={jest.fn()}
      setExportImageDataUri={setImage}
      setExportImageError={setError}
    />
  );

  try {
    const {rerender} = render(plot(1200, 800), {
      wrapper: ({children}) => <ThemeProvider theme={theme}>{children}</ThemeProvider>
    });
    act(() => {
      mapProps.onDeckInitialized?.(null, {limits: {maxTextureDimension2D: 6000}});
      mapProps.deckRenderCallbacks?.onDeckAfterRender?.({layers: []});
      mapProps.onMapRender!({isStyleLoaded: () => true} as Parameters<
        NonNullable<MapProps['onMapRender']>
      >[0]);
      jest.advanceTimersByTime(1000);
    });

    rerender(plot(1234, 789));
    await act(async () => {
      jest.advanceTimersByTime(1000);
      resolveOldCapture('data:image/png;base64,AQ==');
    });
    expect(toPng.mock.calls.map(([, options]) => [options.width, options.height])).toEqual([
      [1200, 800],
      [1234, 789]
    ]);
    expect(setImage.mock.calls).toEqual([['data:image/png;base64,AA==']]);

    rerender(plot(5000, 5000));
    await act(async () => jest.advanceTimersByTime(1000));
    expect(toPng).toHaveBeenLastCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({width: 5000, height: 5000})
    );
    expect(setError).toHaveBeenCalledTimes(1);
    expect(setImage).toHaveBeenCalledTimes(1);

    rerender(plot(6001, 1000));
    await act(async () => jest.advanceTimersByTime(1000));
    expect(toPng).toHaveBeenCalledTimes(3);
    expect(setError).toHaveBeenCalledTimes(2);
  } finally {
    toPng.mockRestore();
    jest.useRealTimers();
  }
});
