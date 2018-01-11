import React from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import VisibilityToggle from './visibility-toggle';
import {VertDots} from './icons';
import {Tooltip} from './styled-components';

const StyledLayerPanelItem = styled.div`
  border-left: 4px solid rgb(${props => props.labelRCGColorValues.join(',')});
  
  .label-wrapper {
    text-align: left;
    padding-left: 4px !important;
    
    label {
      color: ${props => props.theme.textColor};
      font-size: 12px;
    }
  }
`;

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
  removeLayer: React.PropTypes.func
};

const defaultProps = {
  isDragNDropEnabled: true,
  showRemoveLayer: true
};

const LayerPanelItem = ({
  className, idx, isConfigActive,
  isDragNDropEnabled, isVisible, label,
  layerId, labelRCGColorValues, onToggleVisibility,
  onUpdateLayerLabel, onToggleEnableConfig, removeLayer,
  showRemoveLayer
}) => (
  <StyledLayerPanelItem
    className={classnames(`soft-tiny--ends layout layout--flush
           layer-panel__header`, {'sort--handle': !isConfigActive})}
    labelRCGColorValues={labelRCGColorValues}
    onClick={onToggleEnableConfig}>
    <div className="layout__item two-thirds soft-tiny--left">
      <div className={`layer-panel-item layout layout--flush ${className}`}>
        {
          isDragNDropEnabled && (
            <div
              className="layout__item one-eighth layer__drag-handle">
              <VertDots/>
            </div>
          )
        }
        <div className="layout__item one-eighth">
          <VisibilityToggle
            id={layerId}
            isVisible={isVisible}
            onClick={onToggleVisibility}/>
        </div>
        <div
          className="label-wrapper layout__item three-quarters layer__title">
          {isConfigActive ?
            <LayerLabelEditor label={label} onEdit={onUpdateLayerLabel}/> :
            <label>{label}</label>
          }
        </div>
      </div>
    </div>
    <div className="layout__item one-third text--right soft-tiny--right">
      {showRemoveLayer && (<RemoveLayer idx={idx} removeLayer={removeLayer}/>)}
      <EnableConfig
        id={layerId}
        isActive={isConfigActive}
        onClick={onToggleEnableConfig}/>
    </div>
  </StyledLayerPanelItem>
);

LayerPanelItem.displayName = 'LayerPanelItem';
LayerPanelItem.propTypes = propTypes;
LayerPanelItem.defaultProps = defaultProps;

export default LayerPanelItem;

const LayerLabelEditor = ({label, onEdit}) => (
  <input
    type="text"
    className="text-input text-input--borderless flush dark layer__title__editor"
    placeholder={label}
    value={label}
    onClick={e => e.stopPropagation()}
    onChange={onEdit}
    id="input-layer-label" />
);

export const EnableConfig = ({id, isActive, onClick, disableTooltip}) => (
  <span className="push-tiny--left layer--toggle">
    <a className="hover align--middle" data-tip data-for={`enable-${id}`}
       onClick={onClick}>
      <i className={classnames('icon icon_down-arrow epsilon', {
        'text-uber-blue': isActive
      })}/>
      {!disableTooltip && <Tooltip id={`enable-${id}`} effect="solid">
        <span>Settings</span>
      </Tooltip>}
    </a>
  </span>
);

const RemoveLayer = ({idx, removeLayer}) => (
  <span className="push-tiny--left layer--toggle">
    <a className="hover align--middle" data-tip data-for={`delete-${idx}`}
       onClick={(e) => {e.stopPropagation(); removeLayer(idx);}}>
      <i className="icon icon_trash epsilon"/>
      <Tooltip id={`delete-${idx}`} effect="solid" type="error">
        <span>Remove layer</span>
      </Tooltip>
    </a>
  </span>
);
