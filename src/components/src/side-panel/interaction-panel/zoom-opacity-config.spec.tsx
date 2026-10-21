// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, screen} from '@testing-library/react';

import {VisStateActions} from '@kepler.gl/actions';
import {DEFAULT_ZOOM_OPACITY_STOPS} from '@kepler.gl/reducers';
import {renderWithTheme, IntlWrapper} from 'test/helpers/component-jest-utils';

import PanelHeaderActionFactory from '../panel-header-action';
import ZoomOpacityConfigFactory from './zoom-opacity-config';

const ZoomOpacityConfig = ZoomOpacityConfigFactory(PanelHeaderActionFactory());

describe('ZoomOpacityConfig', () => {
  test('renders for existing callers that omit annotations', () => {
    const {container} = renderWithTheme(
      <ZoomOpacityConfig layers={[]} visStateActions={VisStateActions} />
    );

    expect(container.querySelector('.interaction-zoom-opacity')).not.toBeNull();
  });

  test('shortens the helper wording while preserving typography and natural wrapping', () => {
    const {container} = renderWithTheme(
      <IntlWrapper>
        <ZoomOpacityConfig layers={[]} visStateActions={VisStateActions} />
      </IntlWrapper>
    );
    fireEvent.click(container.querySelector('.interaction-zoom-opacity__header') as Element);
    const hint = screen.getByText('Set a zoom range to fade layers and annotations.');
    expect(hint).toHaveStyle({fontSize: '11px', lineHeight: '1.4', marginBottom: '12px'});
    const style = getComputedStyle(hint);
    expect(style.whiteSpace).not.toBe('nowrap');
    expect(style.height).toBe('');
    expect(style.maxHeight).toBe('');
    expect(style.overflow).not.toBe('hidden');
    expect(style.getPropertyValue('-webkit-line-clamp')).toBe('');
  });

  test('adds a controller through the standard plus button without changing its size or label', () => {
    const change = jest.fn();
    const {container} = renderWithTheme(
      <IntlWrapper>
        <ZoomOpacityConfig
          layers={[]}
          visStateActions={{...VisStateActions, interactionConfigChange: change}}
        />
      </IntlWrapper>
    );
    fireEvent.click(container.querySelector('.interaction-zoom-opacity__header') as Element);
    const add = screen.getByRole('button', {name: 'Add controller'});
    expect(add).toHaveStyle({padding: '6px 9px', fontSize: '10px', lineHeight: '14px'});
    const plus = add.querySelector('.data-ex-icons-add');
    expect(plus).toHaveAttribute('height', '12px');
    expect(plus).toHaveAttribute('aria-hidden', 'true');
    expect(plus).toHaveStyle({marginRight: '6px'});
    add.focus();
    expect(add).toHaveFocus();
    fireEvent.click(plus as Element);
    expect(change).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'zoomOpacity',
        enabled: false,
        config: {
          controllers: [{id: expect.any(String), layerIds: [], stops: DEFAULT_ZOOM_OPACITY_STOPS}]
        }
      })
    );
  });
});
