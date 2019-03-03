// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styled from 'styled-components';
import PanelHeaderAction from 'components/side-panel/panel-header-action';
import {
  EyeSeen,
  EyeUnseen,
  VertDots,
  ArrowDown,
  Trash
} from 'components/common/icons';

import {InlineInput, StyledPanelHeader} from 'components/common/styled-components';

const propTypes = {
  // required
  id: PropTypes.string.isRequired,
  isDragNDropEnabled: PropTypes.bool,
  isVisible: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onToggleVisibility: PropTypes.func.isRequired,

  // optional
  className: PropTypes.string,
  idx: PropTypes.number,
  isConfigActive: PropTypes.bool,
  labelRCGColorValues: PropTypes.arrayOf(PropTypes.number),
  onUpdateLayerLabel: PropTypes.func,
  onRemoveLayer: PropTypes.func
};

const defaultProps = {
  isDragNDropEnabled: true,
  showRemoveLayer: true
};

const StyledLayerPanelHeader = styled(StyledPanelHeader)`
  .layer__remove-layer {
    opacity: 0;
  }
  :hover {
    cursor: pointer;
    background-color: ${props => props.theme.panelBackgroundHover};

    .layer__drag-handle {
      opacity: 1;
    }

    .layer__remove-layer {
      opacity: 1;
    }

    .layer__enable-config {
      color: white
    }
  }
`;

const HeaderLabelSection = styled.div`
  display: flex;
  color: ${props => props.theme.textColor};
`;

const HeaderActionSection = styled.div`
  display: flex;
`;

const LayerTitleSection = styled.div`
  margin-left: 12px;

  .layer__title__type {
    color: ${props => props.theme.subtextColor};
    font-size: 10px;
    line-height: 12px;
    letter-spacing: 0.37px;
    text-transform: capitalize;
  }
`;

const DragHandle = styled.div`
  display: flex;
  align-items: center;
  opacity: 0;

  :hover {
    cursor: move;
    color: ${props => props.theme.textColorHl};
  }
`;

const LayerPanelHeader = ({
  className,
  idx,
  isConfigActive,
  isDragNDropEnabled,
  isVisible,
  label,
  layerId,
  layerType,
  labelRCGColorValues,
  onToggleVisibility,
  onUpdateLayerLabel,
  onToggleEnableConfig,
  onRemoveLayer,
  showRemoveLayer
}) => (
  <StyledLayerPanelHeader
    className={classnames('layer-panel__header', {
      'sort--handle': !isConfigActive
    })}
    active={isConfigActive}
    labelRCGColorValues={labelRCGColorValues}
    onClick={onToggleEnableConfig}
  >
    <HeaderLabelSection className="layer-panel__header__content">
      {isDragNDropEnabled && (
        <DragHandle className="layer__drag-handle">
          <VertDots height="20px" />
        </DragHandle>
      )}
      <PanelHeaderAction
        className="layer__visibility-toggle"
        id={layerId}
        tooltip={isVisible ? 'hide layer' : 'show layer'}
        onClick={onToggleVisibility}
        IconComponent={isVisible ? EyeSeen : EyeUnseen}
        active={isVisible}
        flush
      />
      <LayerTitleSection className="layer__title">
        <div>
          <LayerLabelEditor label={label} onEdit={onUpdateLayerLabel} />
          <div className="layer__title__type">{layerType}</div>
        </div>
      </LayerTitleSection>
    </HeaderLabelSection>
    <HeaderActionSection className="layer-panel__header__actions">
      {showRemoveLayer ? (
        <PanelHeaderAction
          className="layer__remove-layer"
          id={layerId}
          tooltip={'Remove layer'}
          onClick={onRemoveLayer}
          tooltipType="error"
          IconComponent={Trash}
        />
      ) : null}
      <PanelHeaderAction
        className="layer__enable-config"
        id={layerId}
        tooltip={'Layer settings'}
        onClick={onToggleEnableConfig}
        IconComponent={ArrowDown}
      />
    </HeaderActionSection>
  </StyledLayerPanelHeader>
);

const LayerLabelEditor = ({label, onEdit}) => (
  <InlineInput
    type="text"
    className="layer__title__editor"
    value={label}
    onClick={e => {
      e.stopPropagation();
    }}
    onChange={onEdit}
    id="input-layer-label"
  />
);

LayerPanelHeader.propTypes = propTypes;
LayerPanelHeader.defaultProps = defaultProps;

export default LayerPanelHeader;
