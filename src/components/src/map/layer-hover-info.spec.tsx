// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {render, screen} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import {IntlWrapper} from 'test/helpers/component-jest-utils';
import LayerHoverInfoFactory from './layer-hover-info';

const LayerHoverInfo = LayerHoverInfoFactory();

test('keeps the new tooltip image when the source changes and releases it on unmount', () => {
  const renderTooltip = (src: string) => (
    <ThemeProvider theme={theme}>
      <IntlWrapper>
        <LayerHoverInfo
          layer={{config: {label: 'Photos'}}}
          data={{wmsFeatureData: [{name: 'Photo<img>', value: src}]}}
        />
      </IntlWrapper>
    </ThemeProvider>
  );
  const {rerender, unmount} = render(renderTooltip('https://example.com/first.png'));

  rerender(renderTooltip('https://example.com/second.png'));
  const image = screen.getByRole('img');
  expect(image).toHaveAttribute('src', 'https://example.com/second.png');

  unmount();
  expect(image).not.toHaveAttribute('src');
});
