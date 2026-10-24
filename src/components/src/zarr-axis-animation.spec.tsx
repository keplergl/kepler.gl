// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck
import React, {useState} from 'react';
import {act, fireEvent} from '@testing-library/react';
import {renderWithTheme} from 'test/helpers/component-jest-utils';
import {appInjector} from '@kepler.gl/components';
import ZarrAxisAnimationFactory from './zarr-axis-animation';
import BottomWidgetFactory from './bottom-widget';
import {InitialState} from 'test/helpers/mock-state';
import {KeplerGlLayers} from '@kepler.gl/layers';

const ZarrAxisAnimation = appInjector.get(ZarrAxisAnimationFactory);
const BottomWidget = appInjector.get(BottomWidgetFactory);
const variable = {
  path: 'climate',
  name: 'climate',
  nonSpatialDims: [
    {name: 'band', size: 2, values: ['tavg', 'prec'], kind: 'category'},
    {name: 'month', size: 3, values: [1, 6, 12], kind: 'number'}
  ]
};
const config = {kind: 'dimension', dimension: 'band'};
const pins = {month: 1};

describe('Zarr axis playback', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('uses existing play/reset controls to advance source frames and displays category labels', () => {
    const onFrameChange = jest.fn();
    function Player() {
      const [frameIndex, setFrame] = useState(0);
      return (
        <ZarrAxisAnimation
          variable={variable}
          config={config}
          pins={pins}
          frameIndex={frameIndex}
          label="Climate"
          onFrameChange={index => {
            onFrameChange(index);
            setFrame(index);
          }}
        />
      );
    }
    const {container} = renderWithTheme(<Player />);
    expect(container.textContent).toContain('tavg');
    expect(container.textContent).toContain('prec');
    const buttons = container.querySelectorAll('.playback-control-button');
    fireEvent.click(buttons[0]);
    act(() => jest.advanceTimersByTime(5100));
    expect(onFrameChange).toHaveBeenLastCalledWith(1);
    act(() => jest.advanceTimersByTime(5100));
    expect(onFrameChange).toHaveBeenLastCalledWith(0);
    act(() => jest.advanceTimersByTime(5100));
    expect(onFrameChange).toHaveBeenLastCalledWith(1);
    fireEvent.click(buttons[0]);
    const count = onFrameChange.mock.calls.length;
    act(() => jest.advanceTimersByTime(6000));
    expect(onFrameChange).toHaveBeenCalledTimes(count);
    fireEvent.click(buttons[2]);
    expect(onFrameChange).toHaveBeenCalledTimes(count + 1);
    expect(onFrameChange).toHaveBeenLastCalledWith(0);
  });

  it('does not render an invalid axis', () => {
    const {container} = renderWithTheme(
      <ZarrAxisAnimation
        variable={variable}
        config={{kind: 'dimension', dimension: 'missing'}}
        pins={pins}
        frameIndex={0}
        label="Climate"
        onFrameChange={jest.fn()}
      />
    );
    expect(container.querySelector('section')).toBeNull();
  });

  it('displays a singleton coordinate without an unusable slider or play button', () => {
    const singleton = {...variable, nonSpatialDims: [{name: 'band', size: 1, values: ['tavg']}]};
    const {container} = renderWithTheme(
      <ZarrAxisAnimation
        variable={singleton}
        config={config}
        pins={pins}
        frameIndex={99}
        label="Climate"
        onFrameChange={jest.fn()}
      />
    );
    expect(container.textContent).toContain('tavg');
    expect(container.querySelector('.playback-control-button')).toBeNull();
    expect(container.querySelector('.animation-control__time-slider')).toBeNull();
  });

  it('connects independent visible layer timelines to layer state without advancing the global clock', () => {
    const createLayer = (label, zarrAxis, isVisible = true) =>
      new KeplerGlLayers.ZarrLayer({
        dataId: 'zarr',
        label,
        isVisible,
        visConfig: {zarrAxis, zarrFrame: 0}
      });
    const layers = [
      createLayer('Band', config),
      createLayer('Month', {kind: 'dimension', dimension: 'month'}),
      createLayer('Hidden', config, false),
      createLayer('Automatic', {}),
      createLayer('Disabled', {kind: 'off'})
    ];
    const visStateActions = {layerVisConfigChange: jest.fn(), setLayerAnimationTime: jest.fn()};
    const {getAllByRole, container} = renderWithTheme(
      <BottomWidget
        datasets={{zarr: {metadata: {variable: 'climate', variables: [variable]}}}}
        filters={[]}
        layers={layers}
        animationConfig={InitialState.visState.animationConfig}
        uiState={InitialState.uiState}
        containerW={900}
        sidePanelWidth={300}
        visStateActions={visStateActions}
      />
    );
    expect(getAllByRole('region')).toHaveLength(2);
    fireEvent.click(container.querySelector('.playback-control-button'));
    act(() => jest.advanceTimersByTime(5100));
    expect(visStateActions.layerVisConfigChange).toHaveBeenCalledWith(layers[0], {zarrFrame: 1});
    expect(visStateActions.setLayerAnimationTime).not.toHaveBeenCalled();
  });
});
