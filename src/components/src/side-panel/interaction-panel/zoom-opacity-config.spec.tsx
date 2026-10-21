// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';

import {VisStateActions} from '@kepler.gl/actions';
import {renderWithTheme} from 'test/helpers/component-jest-utils';

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
});
