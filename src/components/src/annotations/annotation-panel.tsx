// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import {injectIntl, IntlShape} from 'react-intl';
import {
  addAnnotation,
  removeAnnotation,
  updateAnnotation,
  duplicateAnnotation,
  setSelectedAnnotation,
  ActionHandler
} from '@kepler.gl/actions';
import {visStateLens, mapStateLens} from '@kepler.gl/reducers';
import {Annotation} from '@kepler.gl/types';
import {
  AnnotationKind,
  ANNOTATION_KINDS,
  ANNOTATION_LINE_WIDTH_OPTIONS
} from '@kepler.gl/constants';
import {VisState} from '@kepler.gl/schemas';
import {MapState} from '@kepler.gl/types';

import {withState} from '../injector';
import {Add, ArrowDown, ArrowDownSmall, Copy, EyeSeen, EyeUnseen, Trash} from '../common/icons';
import {StyledPanelHeader, Tooltip, Button} from '../common/styled-components';
import Portaled from '../common/portaled';
import SingleColorPalette from '../side-panel/layer-panel/single-color-palette';
import {hexToRgb, rgbToHex} from '@kepler.gl/utils';
import {FormattedMessage} from '@kepler.gl/localization';

// Styled components

const StyledAnnotationPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  pointer-events: none !important;
  flex-grow: 1;
  justify-content: space-between;
  overflow: hidden;

  & > * {
    pointer-events: all;
  }
`;

const StyledAnnotationPanel = styled.div`
  top: 0;
  background-color: ${props => props.theme.sidePanelBg};
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
`;

const StyledAnnotationPanelHeader = styled.div`
  padding: ${({theme}) =>
    `${theme.effectPanelPaddingTop || 8}px ${theme.effectPanelPaddingSide || 16}px 4px ${
      theme.effectPanelPaddingSide || 16
    }px`};
  border-bottom: 1px solid ${props => props.theme.borderColor};
  min-width: ${({theme}) => theme.effectPanelWidth}px;
`;

const StyledPanelHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const StyledPanelTitle = styled.div`
  color: ${props => props.theme.titleTextColor};
  font-size: ${props => props.theme.sidePanelTitleFontsize};
  line-height: ${props => props.theme.sidePanelTitleLineHeight};
  font-weight: 400;
  letter-spacing: 1.25px;
`;

const StyledAddButton = styled.div`
  display: flex;
  align-items: center;
  height: ${props => props.theme.inputBoxHeight};
  width: 100px;
  padding: 4px 10px;
  background-color: ${props => props.theme.secondaryBtnBgd};
  border-radius: ${props => props.theme.primaryBtnRadius};
  font-size: ${props => props.theme.primaryBtnFontSizeDefault};
  color: ${props => props.theme.secondaryBtnActColor};
  cursor: pointer;
  font-weight: 500;
  letter-spacing: 0.3px;
  border: none;
  &:hover {
    background-color: ${props => props.theme.secondaryBtnBgdHover};
  }
`;

const StyledAddIcon = styled(Add)`
  margin-right: 8px;
  height: 16px;
`;

const StyledAnnotationPanelContent = styled.div`
  ${props => props.theme.sidePanelScrollBar};
  padding: 10px 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const StyledAnnotationItemWrapper = styled.div`
  font-size: 12px;
  border-radius: 1px;
  margin: 3px 16px;
`;

const StyledAnnotationItemHeader = styled(StyledPanelHeader)`
  height: ${props => props.theme.effectPanelHeaderHeight}px;
  position: relative;
  align-items: stretch;

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.panelBackgroundHover};
  }

  border-left: 3px solid ${props => props.theme.panelBackgroundHover};
`;

const HeaderLabelSection = styled.div`
  margin-left: 10px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
`;

const StyledAnnotationLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme.textColor};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledAnnotationKind = styled.div`
  font-size: 10px;
  color: ${props => props.theme.subtextColor};
  margin-top: 2px;
`;

const HeaderActionSection = styled.div`
  display: flex;
  position: absolute;
  height: 100%;
  align-items: stretch;
  right: 10px;
  &:hover {
    .annotation-panel__header__actions__hidden {
      opacity: 1;
      background-color: ${props => props.theme.panelBackgroundHover};
    }
  }
`;

type StyledHiddenActionsProps = {$isConfigActive: boolean};
const StyledPanelHeaderHiddenActions = styled.div.attrs({
  className: 'annotation-panel__header__actions__hidden'
})<StyledHiddenActionsProps>`
  opacity: 0;
  display: flex;
  align-items: center;
  transition: opacity 0.4s ease, background-color 0.4s ease;
  background-color: ${props =>
    props.$isConfigActive ? props.theme.panelBackgroundHover : props.theme.panelBackground};

  &:hover {
    opacity: 1;
  }
`;

const HeaderActionWrapper = styled.div<{$active?: boolean; $hoverColor?: string}>`
  margin-left: 8px;
  display: flex;
  align-items: center;
  color: ${props =>
    props.$active ? props.theme.panelHeaderIconActive : props.theme.panelHeaderIcon};
  cursor: pointer;

  &:hover {
    color: ${props =>
      props.$hoverColor ? props.theme[props.$hoverColor] : props.theme.panelHeaderIconHover};
  }
`;

const StyledConfigSection = styled.div`
  position: relative;
  margin: ${props => props.theme.effectConfiguratorMargin};
  padding: ${props => props.theme.effectConfiguratorPadding};
`;

const StyledConfigRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 9px;
`;

const StyledConfigLabel = styled.div`
  font-size: ${props => props.theme.inputFontSize};
  color: ${props => props.theme.effectPanelTextSecondary1};
  text-transform: capitalize;
`;

const StyledSelect = styled.select`
  background: ${props => props.theme.inputBgd};
  color: ${props => props.theme.inputColor};
  border: 1px solid ${props => props.theme.inputBorderColor || 'transparent'};
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  width: 100px;
`;

const StyledColorButtonWrapper = styled.div`
  width: 100px;
  .button {
    color: ${props => props.theme.effectPanelTextSecondary2};
    display: flex;
    gap: 5px;
    border: none;
    transition: background 0.2s;
    background-color: ${props => props.theme.inputBgd};
    padding: 8px 5px 8px 10px;
    &:active {
      color: ${props => props.theme.effectPanelTextMain};
      background-color: ${props => props.theme.inputBgdHover};
    }
    &:hover {
      color: ${props => props.theme.effectPanelTextMain};
      background-color: ${props => props.theme.inputBgdHover};
    }
    & > svg {
      margin-right: 0;
    }
  }
`;

const StyledColorDropdown = styled.div`
  ${props => props.theme.panelDropdownScrollBar}
  background-color: ${props => props.theme.panelBackground};
  box-shadow: ${props => props.theme.panelBoxShadow};
  border-radius: ${props => props.theme.panelBorderRadius};
  overflow-y: auto;
  max-height: 500px;
  position: relative;
  z-index: 999;
  width: 220px;
`;

const InlineColorPicker: React.FC<{
  color: [number, number, number];
  onSetColor: (value: [number, number, number]) => void;
}> = ({color, onSetColor}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const hexColor = React.useMemo(() => rgbToHex(color), [color]);
  const colorBlockStyle = React.useMemo(
    () => ({width: 16, height: 16, backgroundColor: hexColor, borderRadius: 2}),
    [hexColor]
  );
  const handleSelectColor = React.useCallback(
    (v: any) => {
      onSetColor(v);
    },
    [onSetColor]
  );

  return (
    <StyledColorButtonWrapper>
      <Button onClick={() => setIsOpen(!isOpen)}>
        <div style={colorBlockStyle} />
        <ArrowDownSmall />
      </Button>
      <Portaled top={0} left={0} isOpened={isOpen} onClose={() => setIsOpen(false)}>
        <StyledColorDropdown>
          <SingleColorPalette selectedColor={hexColor} onSelectColor={handleSelectColor} />
        </StyledColorDropdown>
      </Portaled>
    </StyledColorButtonWrapper>
  );
};

// Types
export type AnnotationManagerState = {
  visState: VisState;
  mapState: MapState;
  visStateActions: {
    addAnnotation: ActionHandler<typeof addAnnotation>;
    removeAnnotation: ActionHandler<typeof removeAnnotation>;
    updateAnnotation: ActionHandler<typeof updateAnnotation>;
    duplicateAnnotation: ActionHandler<typeof duplicateAnnotation>;
    setSelectedAnnotation: ActionHandler<typeof setSelectedAnnotation>;
  };
};

export type AnnotationManagerProps = {
  intl: IntlShape;
} & AnnotationManagerState;

AnnotationManagerFactory.deps = [];

export default function AnnotationManagerFactory(): React.FC<any> {
  const AnnotationManager: React.FC<AnnotationManagerProps> = ({
    intl,
    visState,
    mapState,
    visStateActions
  }) => {
    const {annotations, selectedAnnotationId} = visState;

    const handleAddAnnotation = useCallback(() => {
      visStateActions.addAnnotation({
        anchorPoint: [mapState.longitude, mapState.latitude]
      });
    }, [visStateActions, mapState.longitude, mapState.latitude]);

    const handleSelectAnnotation = useCallback(
      (id: string) => {
        visStateActions.setSelectedAnnotation(id === selectedAnnotationId ? null : id, false);
      },
      [visStateActions, selectedAnnotationId]
    );

    const handleRemoveAnnotation = useCallback(
      (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        visStateActions.removeAnnotation(id);
      },
      [visStateActions]
    );

    const handleDuplicateAnnotation = useCallback(
      (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        visStateActions.duplicateAnnotation(id);
      },
      [visStateActions]
    );

    const handleToggleVisibility = useCallback(
      (e: React.MouseEvent, annotation: Annotation) => {
        e.stopPropagation();
        visStateActions.updateAnnotation(annotation.id, {isVisible: !annotation.isVisible});
      },
      [visStateActions]
    );

    const handleChangeKind = useCallback(
      (id: string, kind: AnnotationKind) => {
        visStateActions.updateAnnotation(id, {kind});
      },
      [visStateActions]
    );

    const handleChangeLineWidth = useCallback(
      (id: string, lineWidth: number) => {
        visStateActions.updateAnnotation(id, {lineWidth});
      },
      [visStateActions]
    );

    const handleChangeLineColor = useCallback(
      (id: string, rgb: [number, number, number]) => {
        const lineColor = rgbToHex(rgb);
        visStateActions.updateAnnotation(id, {lineColor});
      },
      [visStateActions]
    );

    return (
      <StyledAnnotationPanelContainer className="annotation-manager">
        <StyledAnnotationPanel>
          <StyledAnnotationPanelHeader>
            <StyledPanelHeaderRow>
              <StyledPanelTitle>
                {intl.formatMessage({id: 'annotationManager.title', defaultMessage: 'Annotations'})}
              </StyledPanelTitle>
              <StyledAddButton onClick={handleAddAnnotation}>
                <StyledAddIcon />
                {intl.formatMessage({id: 'annotationManager.addAnnotation', defaultMessage: 'Add'})}
              </StyledAddButton>
            </StyledPanelHeaderRow>
          </StyledAnnotationPanelHeader>
          <StyledAnnotationPanelContent>
            {annotations.map(annotation => {
              const isSelected = annotation.id === selectedAnnotationId;
              return (
                <StyledAnnotationItemWrapper key={annotation.id}>
                  <StyledAnnotationItemHeader
                    active={isSelected}
                    onClick={() => handleSelectAnnotation(annotation.id)}
                  >
                    <HeaderLabelSection>
                      <StyledAnnotationLabel>{annotation.label}</StyledAnnotationLabel>
                      <StyledAnnotationKind>{annotation.kind}</StyledAnnotationKind>
                    </HeaderLabelSection>

                    <HeaderActionSection className="annotation-panel__header__actions">
                      <StyledPanelHeaderHiddenActions $isConfigActive={isSelected}>
                        <HeaderActionWrapper
                          $hoverColor="negative"
                          data-tip
                          data-for={`remove-annotation_${annotation.id}`}
                          onClick={e => handleRemoveAnnotation(e, annotation.id)}
                        >
                          <Trash height="16px" />
                        </HeaderActionWrapper>
                        <Tooltip
                          id={`remove-annotation_${annotation.id}`}
                          effect="solid"
                          delayShow={500}
                          type="error"
                        >
                          <span>
                            <FormattedMessage id="tooltip.removeAnnotation" />
                          </span>
                        </Tooltip>

                        <HeaderActionWrapper
                          data-tip
                          data-for={`duplicate-annotation_${annotation.id}`}
                          onClick={e => handleDuplicateAnnotation(e, annotation.id)}
                        >
                          <Copy height="16px" />
                        </HeaderActionWrapper>
                        <Tooltip
                          id={`duplicate-annotation_${annotation.id}`}
                          effect="solid"
                          delayShow={500}
                        >
                          <span>
                            <FormattedMessage id="tooltip.duplicateAnnotation" />
                          </span>
                        </Tooltip>
                      </StyledPanelHeaderHiddenActions>

                      <HeaderActionWrapper
                        data-tip
                        data-for={`visibility-annotation_${annotation.id}`}
                        onClick={e => handleToggleVisibility(e, annotation)}
                      >
                        {annotation.isVisible ? (
                          <EyeSeen height="16px" />
                        ) : (
                          <EyeUnseen height="16px" />
                        )}
                      </HeaderActionWrapper>
                      <Tooltip
                        id={`visibility-annotation_${annotation.id}`}
                        effect="solid"
                        delayShow={500}
                      >
                        <span>
                          <FormattedMessage
                            id={
                              annotation.isVisible
                                ? 'tooltip.hideAnnotation'
                                : 'tooltip.showAnnotation'
                            }
                          />
                        </span>
                      </Tooltip>

                      <HeaderActionWrapper
                        $active={isSelected}
                        className={classnames('annotation__enable-config', {
                          'is-open': isSelected
                        })}
                        data-tip
                        data-for={`config-annotation_${annotation.id}`}
                        onClick={() => handleSelectAnnotation(annotation.id)}
                      >
                        <ArrowDown height="16px" />
                      </HeaderActionWrapper>
                      <Tooltip
                        id={`config-annotation_${annotation.id}`}
                        effect="solid"
                        delayShow={500}
                      >
                        <span>
                          <FormattedMessage id="tooltip.annotationSettings" />
                        </span>
                      </Tooltip>
                    </HeaderActionSection>
                  </StyledAnnotationItemHeader>

                  {isSelected ? (
                    <StyledConfigSection>
                      <StyledConfigRow>
                        <StyledConfigLabel>Type</StyledConfigLabel>
                        <StyledSelect
                          value={annotation.kind}
                          onChange={e =>
                            handleChangeKind(annotation.id, e.target.value as AnnotationKind)
                          }
                        >
                          {ANNOTATION_KINDS.map(k => (
                            <option key={k.id} value={k.id}>
                              {k.label}
                            </option>
                          ))}
                        </StyledSelect>
                      </StyledConfigRow>
                      <StyledConfigRow>
                        <StyledConfigLabel>Line Width</StyledConfigLabel>
                        <StyledSelect
                          value={annotation.lineWidth}
                          onChange={e =>
                            handleChangeLineWidth(annotation.id, Number(e.target.value))
                          }
                        >
                          {ANNOTATION_LINE_WIDTH_OPTIONS.map(w => (
                            <option key={w} value={w}>
                              {w}px
                            </option>
                          ))}
                        </StyledSelect>
                      </StyledConfigRow>
                      <StyledConfigRow>
                        <StyledConfigLabel>Color</StyledConfigLabel>
                        <InlineColorPicker
                          color={hexToRgb(annotation.lineColor)}
                          onSetColor={rgb => handleChangeLineColor(annotation.id, rgb)}
                        />
                      </StyledConfigRow>
                    </StyledConfigSection>
                  ) : null}
                </StyledAnnotationItemWrapper>
              );
            })}
          </StyledAnnotationPanelContent>
        </StyledAnnotationPanel>
      </StyledAnnotationPanelContainer>
    );
  };

  return withState([visStateLens, mapStateLens], state => state, {
    visStateActions: {
      addAnnotation,
      removeAnnotation,
      updateAnnotation,
      duplicateAnnotation,
      setSelectedAnnotation
    }
  })(injectIntl(AnnotationManager)) as React.FC<any>;
}
