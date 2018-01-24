import React from 'react';
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

import {InlineInput} from 'components/common/styled-components';

const propTypes = {
  // required
  id: React.PropTypes.string.isRequired,
  isDragNDropEnabled: React.PropTypes.bool,
  isVisible: React.PropTypes.bool.isRequired,
  label: React.PropTypes.string.isRequired,
  onToggleVisibility: React.PropTypes.func.isRequired,

  // optional
  className: React.PropTypes.string,
  idx: React.PropTypes.number,
  isConfigActive: React.PropTypes.bool,
  labelRCGColorValues: React.PropTypes.array,
  onUpdateLayerLabel: React.PropTypes.func,
  onRemoveLayer: React.PropTypes.func
};

const defaultProps = {
  isDragNDropEnabled: true,
  showRemoveLayer: true
};

const StyledLayerPanelHeader = styled.div`
  background-color: ${props =>
  props.active
    ? props.theme.panelBackgroundHover
    : props.theme.panelBackground};
  border-left: 3px solid rgb(${props => props.labelRCGColorValues.join(',')});
  padding: 0 10px 0 0;
  height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: ${props => props.theme.transition};
  
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
