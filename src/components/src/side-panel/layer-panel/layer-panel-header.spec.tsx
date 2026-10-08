// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent} from '@testing-library/react';

import {renderWithTheme} from 'test/helpers/component-jest-utils';
import PanelHeaderActionFactory from '../panel-header-action';
import LayerPanelHeaderFactory, {
  LayerPanelHeaderActionSectionFactory,
  LayerPanelHeaderProps,
  LayerTitleSectionFactory
} from './layer-panel-header';

const LayerPanelHeader = LayerPanelHeaderFactory(
  LayerTitleSectionFactory(),
  LayerPanelHeaderActionSectionFactory(PanelHeaderActionFactory())
);

const noop = jest.fn();

function renderHeader(
  overrides: Partial<
    Pick<LayerPanelHeaderProps, 'allowDuplicate' | 'showJsonEditor' | 'showRemoveLayer'>
  > = {}
) {
  const onToggleEnableConfig = jest.fn();
  const onRemoveLayer = jest.fn();
  const onDuplicateLayer = jest.fn();
  const onZoomToLayer = jest.fn();
  const onToggleJsonEditor = jest.fn();
  const view = renderWithTheme(
    <LayerPanelHeader
      layerId="taro"
      isVisible={true}
      isValid={true}
      isConfigActive={false}
      label="Taro"
      allowDuplicate={true}
      onToggleVisibility={noop}
      onUpdateLayerLabel={noop}
      onResetIsValid={noop}
      onToggleEnableConfig={onToggleEnableConfig}
      onRemoveLayer={onRemoveLayer}
      onDuplicateLayer={onDuplicateLayer}
      onZoomToLayer={onZoomToLayer}
      onToggleJsonEditor={onToggleJsonEditor}
      {...overrides}
    />
  );

  return {
    ...view,
    onToggleEnableConfig,
    onRemoveLayer,
    onDuplicateLayer,
    onZoomToLayer,
    onToggleJsonEditor
  };
}

function openOptions(container: HTMLElement) {
  fireEvent.click(container.querySelector('.layer__options-toggle svg') as SVGElement);
}

describe('LayerPanelHeader options menu', () => {
  test('keeps visibility and settings visible and moves other actions into the menu', () => {
    const {container, onZoomToLayer, onDuplicateLayer, onRemoveLayer, onToggleJsonEditor} =
      renderHeader({showJsonEditor: true});

    expect(container.querySelector('.layer__visibility-toggle')).not.toBeNull();
    expect(container.querySelector('.layer__enable-config')).not.toBeNull();
    expect(container.querySelector('.layer__options-toggle')).not.toBeNull();
    expect(document.querySelector('.layer__zoom-to-layer')).toBeNull();
    expect(document.querySelector('.layer__duplicate')).toBeNull();
    expect(document.querySelector('.layer__remove-layer')).toBeNull();
    expect(document.querySelector('.layer__json-editor')).toBeNull();

    openOptions(container);

    fireEvent.click(document.querySelector('.layer__zoom-to-layer') as HTMLButtonElement);
    expect(onZoomToLayer).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.layer-options-menu')).toBeNull();

    openOptions(container);
    fireEvent.click(document.querySelector('.layer__duplicate') as HTMLButtonElement);
    expect(onDuplicateLayer).toHaveBeenCalledTimes(1);

    openOptions(container);
    fireEvent.click(document.querySelector('.layer__json-editor') as HTMLButtonElement);
    expect(onToggleJsonEditor).toHaveBeenCalledTimes(1);

    openOptions(container);
    fireEvent.click(document.querySelector('.layer__remove-layer') as HTMLButtonElement);
    expect(onRemoveLayer).toHaveBeenCalledTimes(1);
  });

  test('does not toggle the layer configurator when opening the menu', () => {
    const {container, onToggleEnableConfig} = renderHeader();

    openOptions(container);
    expect(onToggleEnableConfig).not.toHaveBeenCalled();
    expect(document.querySelector('.layer__zoom-to-layer')).not.toBeNull();

    fireEvent.click(container.querySelector('.layer__title') as HTMLElement);
    expect(onToggleEnableConfig).toHaveBeenCalledTimes(1);
  });

  test('disables duplicate and hides optional actions', () => {
    const {container, onDuplicateLayer} = renderHeader({
      allowDuplicate: false,
      showJsonEditor: false,
      showRemoveLayer: false
    });

    openOptions(container);
    const duplicate = document.querySelector('.layer__duplicate') as HTMLButtonElement;
    expect(duplicate.disabled).toBe(true);
    fireEvent.click(duplicate);
    expect(onDuplicateLayer).not.toHaveBeenCalled();
    expect(document.querySelector('.layer__json-editor')).toBeNull();
    expect(document.querySelector('.layer__remove-layer')).toBeNull();
  });
});
