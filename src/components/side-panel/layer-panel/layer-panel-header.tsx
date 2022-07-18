// Copyright (c) 2022 Uber Technologies, Inc.
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

import React, {
  useState,
  ComponentType,
  MouseEventHandler,
  MouseEvent,
  ChangeEventHandler
} from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import {SortableHandle} from 'react-sortable-hoc';
import PanelHeaderActionFactory from 'components/side-panel/panel-header-action';
import {Copy, ArrowDown, EyeSeen, EyeUnseen, Trash, VertDots} from 'components/common/icons';

import {InlineInput, StyledPanelHeader} from 'components/common/styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {RGBColor} from '@kepler.gl/types';
import {BaseProps} from 'components/common/icons/base';

type LayerLabelEditorProps = {
  layerId: string;
  label?: string;
  onEdit: ChangeEventHandler;
  onFocus: ChangeEventHandler;
  onBlur: ChangeEventHandler;
};

type LayerTitleSectionProps = {
  layerType?: string | null;
  layerId: string;
  label?: string;
  onUpdateLayerLabel: ChangeEventHandler;
  onFocus: ChangeEventHandler;
  onBlur: ChangeEventHandler;
};

type LayerPanelHeaderProps = {
  layerId: string;
  isVisible: boolean;
  onToggleVisibility: MouseEventHandler;
  onUpdateLayerLabel: ChangeEventHandler;
  onToggleEnableConfig: MouseEventHandler;
  onRemoveLayer: MouseEventHandler;
  onDuplicateLayer: MouseEventHandler;
  isConfigActive: boolean;
  showRemoveLayer?: boolean;
  label?: string;
  layerType?: string | null;
  isDragNDropEnabled?: boolean;
  labelRCGColorValues?: RGBColor | null;
  actionIcons?: {
    remove: ComponentType<Partial<BaseProps>>;
    visible: ComponentType<Partial<BaseProps>>;
    hidden: ComponentType<Partial<BaseProps>>;
    enableConfig: ComponentType<Partial<BaseProps>>;
    resetIsValid: ComponentType<Partial<BaseProps>>;
    duplicate: ComponentType<Partial<BaseProps>>;
  };
};

export const defaultProps = {
  isDragNDropEnabled: true,
  showRemoveLayer: true
};

const StyledLayerPanelHeader = styled(StyledPanelHeader)`
  height: ${props => props.theme.layerPanelHeaderHeight}px;
  position: relative;
  align-items: stretch;

  .layer__remove-layer {
    opacity: 0;
  }

  .layer__drag-handle__placeholder {
    height: 20px;
    padding: 10px;
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
  flex-grow: 1;
  align-items: stretch;
  // leave space for eye and collapse icon
  padding-right: 50px;
`;

const HeaderActionSection = styled.div`
  display: flex;
  position: absolute;
  height: 100%;
  align-items: stretch;
  right: 10px;
  pointer-events: ${props => (props.isEditingLabel ? 'none' : 'all')};
  :hover {
    .layer-panel__header__actions__hidden {
      opacity: 1;
      background-color: ${props => props.theme.panelBackgroundHover};
    }
  }
`;

// Hiden actions only show up on hover
const StyledPanelHeaderHiddenActions = styled.div.attrs({
  className: 'layer-panel__header__actions__hidden'
})`
  opacity: 0;
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.panelBackground};
  transition: ${props => props.theme.transition};
  :hover {
    opacity: 1;
  }
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

export const LayerLabelEditor: React.FC<LayerLabelEditorProps> = ({
  layerId,
  label,
  onEdit,
  onFocus,
  onBlur
}) => (
  <InlineInput
    type="text"
    className="layer__title__editor"
    value={label}
    onClick={(e: MouseEvent) => {
      e.stopPropagation();
    }}
    onChange={onEdit}
    onFocus={onFocus}
    onBlur={onBlur}
    id={`${layerId}:input-layer-label`}
  />
);

export function LayerTitleSectionFactory() {
  const StyledLayerTitleSection = styled.div`
    margin-left: 4px;
    flex-grow: 1;
    align-items: center;
    display: flex;
    .layer__title__inner {
      flex-grow: 1;
    }

    .layer__title__type {
      color: ${props => props.theme.subtextColor};
      font-size: 10px;
      line-height: 12px;
      letter-spacing: 0.37px;
      text-transform: capitalize;
    }
  `;
  const LayerTitleSection: React.FC<LayerTitleSectionProps> = ({
    layerType,
    layerId,
    label,
    onUpdateLayerLabel,
    onFocus,
    onBlur
  }) => (
    <StyledLayerTitleSection className="layer__title">
      <div>
        <LayerLabelEditor
          layerId={layerId}
          label={label}
          onEdit={onUpdateLayerLabel}
          onFocus={onFocus}
          onBlur={onBlur}
        />
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

function LayerPanelHeaderFactory(
  LayerTitleSection: ReturnType<typeof LayerTitleSectionFactory>,
  PanelHeaderAction: ReturnType<typeof PanelHeaderActionFactory>
) {
  const LayerPanelHeader: React.FC<LayerPanelHeaderProps> = ({
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
    const [isEditingLabel, setIsEditingLabel] = useState(false);

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
          {isDragNDropEnabled ? (
            <DragHandle className="layer__drag-handle">
              <VertDots height="20px" />
            </DragHandle>
          ) : (
            <div className="layer__drag-handle__placeholder" />
          )}
          <LayerTitleSection
            layerId={layerId}
            label={label}
            onUpdateLayerLabel={onUpdateLayerLabel}
            layerType={layerType}
            onFocus={() => {
              setIsEditingLabel(true);
            }}
            onBlur={() => {
              setIsEditingLabel(false);
            }}
          />
        </HeaderLabelSection>
        <HeaderActionSection
          className="layer-panel__header__actions"
          isEditingLabel={isEditingLabel}
        >
          <StyledPanelHeaderHiddenActions>
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
              className="layer__duplicate"
              id={layerId}
              tooltip={'tooltip.duplicateLayer'}
              onClick={onDuplicateLayer}
              IconComponent={actionIcons.duplicate}
            />
          </StyledPanelHeaderHiddenActions>
          <PanelHeaderAction
            className="layer__visibility-toggle"
            id={layerId}
            tooltip={isVisible ? 'tooltip.hideLayer' : 'tooltip.showLayer'}
            onClick={onToggleVisibility}
            IconComponent={isVisible ? actionIcons.visible : actionIcons.hidden}
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

  LayerPanelHeader.defaultProps = defaultProps;

  return LayerPanelHeader;
}

export default LayerPanelHeaderFactory;
