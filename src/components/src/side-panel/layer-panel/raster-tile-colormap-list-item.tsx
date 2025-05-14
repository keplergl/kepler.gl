// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';

import {getCategoricalColormapDataUrl, RasterLayerResources} from '@kepler.gl/layers';
import type {CategoricalColormapOptions} from '@kepler.gl/layers';

const StyledColorMapListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .color-name {
    width: calc(40% - 8px);
    margin-right: 8px;
    color: ${props => props.theme.subtextColor};
  }
  .color-image {
    width: 60%;
    height: 10px;
    border-radius: 2px;
    background: ${props => props.theme.panelContentBackground};
    overflow: hidden;
    display: flex;
  }
`;

const ColorMapImg: React.FC<{id: string; categoricalOptions: CategoricalColormapOptions}> = ({
  id,
  categoricalOptions
}) => {
  let url = '';
  if (id === '_categorical') {
    const dataUrl = getCategoricalColormapDataUrl(categoricalOptions);
    if (!dataUrl) {
      return null;
    }
    url = dataUrl;
  } else {
    url = RasterLayerResources.rasterColorMap(id);
  }
  return <img src={url} style={{width: '100%', height: '100%'}} />;
};

export const ColorMapListItem: React.FC<{
  value: {id: string; label: string};
  categoricalOptions: CategoricalColormapOptions;
}> = ({value, categoricalOptions}) => (
  <StyledColorMapListItem>
    <div className="color-name">{value?.label}</div>
    <div className="color-image">
      <ColorMapImg id={value?.id} categoricalOptions={categoricalOptions} />
    </div>
  </StyledColorMapListItem>
);

export const getColorMapListItemComponent = (
  categoricalOptions: CategoricalColormapOptions
): React.FC<{
  value: {id: string; label: string};
}> => {
  return (props: {value: {id: string; label: string}}) => (
    <ColorMapListItem {...props} categoricalOptions={categoricalOptions} />
  );
};
