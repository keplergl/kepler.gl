// Copyright (c) 2021 Uber Technologies, Inc.
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

import React, {useState} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styled from 'styled-components';
import {SortableHandle} from 'react-sortable-hoc';
import PanelHeaderActionFactory from 'components/side-panel/panel-header-action';
import {Copy, ArrowDown, EyeSeen, EyeUnseen, Trash, VertDots} from 'components/common/icons';

import {InlineInput, StyledPanelHeader} from 'components/common/styled-components';
import {FormattedMessage} from 'localization';

const propTypes = {
  // required
  layerId: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onToggleVisibility: PropTypes.func.isRequired,
  onUpdateLayerLabel: PropTypes.func.isRequired,
  onToggleEnableConfig: PropTypes.func.isRequired,
  onRemoveLayer: PropTypes.func.isRequired,
  onDuplicateLayer: PropTypes.func.isRequired,
  isConfigActive: PropTypes.bool.isRequired,

  // optional
  showRemoveLayer: PropTypes.bool,
  label: PropTypes.string,
  layerType: PropTypes.string,
  isDragNDropEnabled: PropTypes.bool,
  labelRCGColorValues: PropTypes.arrayOf(PropTypes.number)
};

export const defaultProps = {
  isDragNDropEnabled: true,
  showRemoveLayer: true
};

const StyledLayerPanelHeader = styled(StyledPanelHeader)`
  height: ${props => props.theme.layerPanelHeaderHeight}px;
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
  }
`;

const HeaderLabelSection = styled.div`
  display: flex;
  color: ${props => props.theme.textColor};
`;

const HeaderActionSection = styled.div`
  display: flex;
`;

const StyledDragHandle = styled.div`
  display: flex;
  align-items: center;
  opacity: 0;
  z-index: 1000;

  :hover {
    cursor: move;
    opacity: 1;
    color: ${props => props.theme.textColorHl};
  }
`;

export const DragHandle = SortableHandle(({className, children}) => (
  <StyledDragHandle className={className}>{children}</StyledDragHandle>
));

export const LayerLabelEditor = ({layerId, label, onEdit}) => (
  <InlineInput
    type="text"
    className="layer__title__editor"
    value={label}
    onClick={e => {
      e.stopPropagation();
    }}
    onChange={onEdit}
    id={`${layerId}:input-layer-label`}
  />
);

export function LayerTitleSectionFactory() {
  const StyledLayerTitleSection = styled.div`
    margin-left: 4px;

    .layer__title__type {
      color: ${props => props.theme.subtextColor};
      font-size: 10px;
      line-height: 12px;
      letter-spacing: 0.37px;
      text-transform: capitalize;
    }
  `;
  const LayerTitleSection = ({layerType, layerId, label, onUpdateLayerLabel}) => (
    <StyledLayerTitleSection className="layer__title">
      <div>
        <LayerLabelEditor layerId={layerId} label={label} onEdit={onUpdateLayerLabel} />
        <div className="layer__title__type">
          {layerType && <FormattedMessage id={`layer.type.${layerType.toLowerCase()}`} />}
        </div>
      </div>
    </StyledLayerTitleSection>
  );
  return LayerTitleSection;
}

LayerPanelHeaderFactory.deps = [LayerTitleSectionFactory, PanelHeaderActionFactory];
const defaultActionIcons = {
  remove: Trash,
  visible: EyeSeen,
  hidden: EyeUnseen,
  enableConfig: ArrowDown,
  duplicate: Copy
};
function LayerPanelHeaderFactory(LayerTitleSection, PanelHeaderAction) {
  const LayerPanelHeader = ({
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
    onDuplicateLayer,
    onRemoveLayer,
    showRemoveLayer,
    actionIcons = defaultActionIcons
  }) => {
    const [isOpen, setOpen] = useState(false);
    const toggleLayerConfigurator = e => {
      setOpen(!isOpen);
      onToggleEnableConfig(e);
    };
    return (
      <StyledLayerPanelHeader
        className={classnames('layer-panel__header', {
          'sort--handle': !isConfigActive
        })}
        active={isConfigActive}
        labelRCGColorValues={labelRCGColorValues}
        onClick={toggleLayerConfigurator}
      >
        <HeaderLabelSection className="layer-panel__header__content">
          {isDragNDropEnabled && (
            <DragHandle className="layer__drag-handle">
              <VertDots height="20px" />
            </DragHandle>
          )}
          <LayerTitleSection
            layerId={layerId}
            label={label}
            onUpdateLayerLabel={onUpdateLayerLabel}
            layerType={layerType}
          />
        </HeaderLabelSection>
        <HeaderActionSection className="layer-panel__header__actions">
          {showRemoveLayer ? (
            <PanelHeaderAction
              className="layer__remove-layer"
              id={layerId}
              tooltip={'tooltip.removeLayer'}
              onClick={onRemoveLayer}
              tooltipType="error"
              IconComponent={actionIcons.remove}
            />
          ) : null}
          <PanelHeaderAction
            className="layer__visibility-toggle"
            id={layerId}
            tooltip={isVisible ? 'tooltip.hideLayer' : 'tooltip.showLayer'}
            onClick={onToggleVisibility}
            IconComponent={isVisible ? actionIcons.visible : actionIcons.hidden}
          />
          <PanelHeaderAction
            className="layer__duplicate"
            id={layerId}
            tooltip={'tooltip.duplicateLayer'}
            onClick={onDuplicateLayer}
            IconComponent={actionIcons.duplicate}
          />
          <PanelHeaderAction
            className={classnames('layer__enable-config ', {
              'is-open': isOpen
            })}
            id={layerId}
            tooltip={'tooltip.layerSettings'}
            onClick={toggleLayerConfigurator}
            IconComponent={actionIcons.enableConfig}
          />
        </HeaderActionSection>
      </StyledLayerPanelHeader>
    );
  };

  LayerPanelHeader.propTypes = propTypes;
  LayerPanelHeader.defaultProps = defaultProps;

  return LayerPanelHeader;
}

export default LayerPanelHeaderFactory;
