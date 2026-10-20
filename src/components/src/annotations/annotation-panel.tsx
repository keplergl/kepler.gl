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
  AnnotationTextSide,
  AnnotationTextVerticalPosition,
  ANNOTATION_KINDS,
  ANNOTATION_LINE_WIDTH_OPTIONS,
  ANNOTATION_TEXT_SIDES,
  ANNOTATION_TEXT_VERTICAL_POSITIONS,
  isAnnotationWithArm
} from '@kepler.gl/constants';
import {VisState} from '@kepler.gl/schemas';
import {MapState} from '@kepler.gl/types';

import {withState} from '../injector';
import {
  Add,
  AnnotationText,
  ArrowDown,
  ArrowDownSmall,
  Base,
  BaseProps,
  Circle,
  Copy,
  DrawPoint,
  EyeSeen,
  EyeUnseen,
  Trash
} from '../common/icons';
import {StyledPanelHeader, Tooltip, Button, ButtonGroup} from '../common/styled-components';
import Switch from '../common/switch';
import ItemSelector from '../common/item-selector/item-selector';
import Slider from '../common/slider/slider';
import Portaled from '../common/portaled';
import SingleColorPalette from '../side-panel/layer-panel/single-color-palette';
import {hexToRgb, rgbToHex} from '@kepler.gl/utils';
import {FormattedMessage} from '@kepler.gl/localization';
import {angleForTextPlacement, getTextPlacement} from './annotation-utils';

const AnnotationArrowIcon = (props: Partial<BaseProps>) => (
  <Base viewBox="0 0 24 24" {...props}>
    <path d="M5 19 19 5M7 5h12v12" fill="none" stroke="currentColor" strokeWidth="2" />
  </Base>
);

const AnnotationRulerIcon = (props: Partial<BaseProps>) => (
  <Base viewBox="0 0 24 24" {...props}>
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="7" width="20" height="10" rx="1" />
      <path d="M6 7v5m4-5v3m4-3v5m4-5v3" />
    </g>
  </Base>
);

const ANNOTATION_ICONS = {
  [AnnotationKind.TEXT]: AnnotationText,
  [AnnotationKind.POINT]: DrawPoint,
  [AnnotationKind.ARROW]: AnnotationArrowIcon,
  [AnnotationKind.CIRCLE]: Circle,
  [AnnotationKind.RULER]: AnnotationRulerIcon
};

const MIN_LINE_WIDTH = Math.min(...ANNOTATION_LINE_WIDTH_OPTIONS);
const MAX_LINE_WIDTH = Math.max(...ANNOTATION_LINE_WIDTH_OPTIONS);

// Styled components

const StyledAnnotationPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  pointer-events: none !important;
  flex-grow: 1;
  justify-content: space-between;
  overflow: hidden;
  width: ${({theme}) => theme.effectPanelWidth}px;
  min-width: 0;

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
  min-width: 0;
`;

const StyledAnnotationPanelHeader = styled.div`
  padding: ${({theme}) =>
    `${theme.effectPanelPaddingTop || 8}px ${theme.effectPanelPaddingSide || 16}px 4px ${
      theme.effectPanelPaddingSide || 16
    }px`};
  border-bottom: 1px solid ${props => props.theme.borderColor};
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
  width: fit-content;
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
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 0;
`;

const StyledAnnotationItemWrapper = styled.div`
  font-size: 12px;
  border-radius: 1px;
  margin: 3px 16px;
  min-width: 0;
  overflow: hidden;
`;

const StyledAnnotationItemHeader = styled(StyledPanelHeader)`
  height: ${props => props.theme.effectPanelHeaderHeight}px;
  position: relative;
  align-items: stretch;
  min-width: 0;
  overflow: hidden;

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.panelBackgroundHover};
  }

  border-left: 3px solid ${props => props.theme.panelBackgroundHover};
`;

const HeaderLabelSection = styled.div`
  margin-left: 10px;
  flex-grow: 1;
  flex-shrink: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  // leave space for eye and collapse icons
  padding-right: 50px;
`;

const StyledAnnotationLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme.textColor};
  min-width: 0;
  max-width: 100%;
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
  min-height: ${props => props.theme.inputBoxHeightSmall};
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const StyledAnnotationTypeGroup = styled(ButtonGroup)`
  width: 100%;
  height: ${props => props.theme.inputBoxHeight};
  align-items: stretch;
  margin-bottom: 8px;
`;

const StyledAnnotationTypeButton = styled(Button)<{$active: boolean}>`
  flex: 1;
  min-width: 0;
  height: 100%;
  box-sizing: border-box;
  padding: 0;
  background-color: ${props => props.theme.inputBgd};
  color: ${props => (props.$active ? props.theme.switchTrackBgdActive : props.theme.inputColor)};
  border: 1px solid
    ${props => (props.$active ? props.theme.switchTrackBgdActive : 'transparent')};

  &:hover,
  &:focus,
  &:active {
    background-color: ${props => props.theme.inputBgdHover};
    color: ${props => (props.$active ? props.theme.switchTrackBgdActive : props.theme.inputColor)};
  }

  &:focus-visible {
    outline: 2px solid ${props => props.theme.switchTrackBgdActive};
    outline-offset: -2px;
  }

  svg {
    margin-right: 0;
  }
`;

const StyledConfigLabel = styled.div`
  font-size: ${props => props.theme.inputFontSize};
  color: ${props => props.theme.effectPanelTextSecondary1};
  text-transform: capitalize;
`;

const StyledSelect = styled(ItemSelector).attrs({size: 'small'})`
  width: 100px;

  .item-selector__dropdown {
    box-sizing: border-box;
  }
`;

const StyledLineWidthSlider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
  margin-left: 16px;
  height: ${props => props.theme.inputBoxHeightSmall};
  padding-left: 6px;
  box-sizing: border-box;

  &:focus-visible {
    outline: 2px solid ${props => props.theme.switchTrackBgdActive};
    outline-offset: 2px;
  }

  span.annotation-line-width-value {
    min-width: 28px;
    text-align: right;
    color: ${props => props.theme.effectPanelTextSecondary2};
    font-size: ${props => props.theme.inputFontSize};
  }
`;

const StyledColorButtonWrapper = styled.div`
  width: 100px;
  .button {
    width: 100%;
    height: ${props => props.theme.inputBoxHeightSmall};
    box-sizing: border-box;
    color: ${props => props.theme.effectPanelTextSecondary2};
    display: flex;
    justify-content: space-between;
    gap: 5px;
    border: none;
    transition: background 0.2s;
    background-color: ${props => props.theme.inputBgd};
    padding: 4px 5px 4px 10px;
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

    const handleLineWidthKeyDown = useCallback(
      (event: React.KeyboardEvent, annotation: Annotation) => {
        const widths: Record<string, number> = {
          ArrowLeft: annotation.lineWidth - 1,
          ArrowDown: annotation.lineWidth - 1,
          ArrowRight: annotation.lineWidth + 1,
          ArrowUp: annotation.lineWidth + 1,
          Home: MIN_LINE_WIDTH,
          End: MAX_LINE_WIDTH
        };
        const width = widths[event.key];
        if (!Number.isFinite(width)) return;
        event.preventDefault();
        event.stopPropagation();
        const lineWidth = Math.min(MAX_LINE_WIDTH, Math.max(MIN_LINE_WIDTH, Math.round(width)));
        if (lineWidth !== annotation.lineWidth) {
          handleChangeLineWidth(annotation.id, lineWidth);
        }
      },
      [handleChangeLineWidth]
    );

    const handleChangeLineColor = useCallback(
      (id: string, rgb: [number, number, number]) => {
        const lineColor = rgbToHex(rgb);
        visStateActions.updateAnnotation(id, {lineColor});
      },
      [visStateActions]
    );

    const handleToggleRulerText = useCallback(
      (id: string, property: 'showCustomText' | 'showDistance', checked: boolean) => {
        visStateActions.updateAnnotation(id, {[property]: checked});
      },
      [visStateActions]
    );

    const handleChangeTextPlacement = useCallback(
      (
        annotation: Annotation,
        next: {
          textSide?: AnnotationTextSide;
          textVerticalPosition?: AnnotationTextVerticalPosition;
        }
      ) => {
        const current = getTextPlacement(annotation);
        const textSide = next.textSide ?? current.side;
        const textVerticalPosition = next.textVerticalPosition ?? current.vertical;
        visStateActions.updateAnnotation(annotation.id, {
          textSide,
          textVerticalPosition,
          ...(isAnnotationWithArm(annotation)
            ? {angle: angleForTextPlacement(textSide, textVerticalPosition)}
            : {})
        });
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
              const textPlacement = getTextPlacement(annotation);
              return (
                <StyledAnnotationItemWrapper key={annotation.id}>
                  <StyledAnnotationItemHeader
                    $active={isSelected}
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
                      <StyledAnnotationTypeGroup
                        role="group"
                        aria-label={intl.formatMessage({
                          id: 'annotationManager.type',
                          defaultMessage: 'Type'
                        })}
                      >
                        {ANNOTATION_KINDS.map(({id, label}) => {
                          const Icon = ANNOTATION_ICONS[id];
                          return (
                            <StyledAnnotationTypeButton
                              key={id}
                              type="button"
                              title={label}
                              aria-label={label}
                              aria-pressed={annotation.kind === id}
                              $active={annotation.kind === id}
                              onClick={() => handleChangeKind(annotation.id, id)}
                            >
                              <Icon height="20px" aria-hidden="true" focusable="false" />
                            </StyledAnnotationTypeButton>
                          );
                        })}
                      </StyledAnnotationTypeGroup>
                      <StyledConfigRow>
                        <StyledConfigLabel>
                          {intl.formatMessage({
                            id: 'annotationManager.lineWidth',
                            defaultMessage: 'Line Width'
                          })}
                        </StyledConfigLabel>
                        <StyledLineWidthSlider
                          role="slider"
                          tabIndex={0}
                          aria-label={intl.formatMessage({
                            id: 'annotationManager.lineWidth',
                            defaultMessage: 'Line Width'
                          })}
                          aria-valuemin={MIN_LINE_WIDTH}
                          aria-valuemax={MAX_LINE_WIDTH}
                          aria-valuenow={annotation.lineWidth}
                          aria-valuetext={`${annotation.lineWidth}px`}
                          onKeyDown={event => handleLineWidthKeyDown(event, annotation)}
                        >
                          <Slider
                            minValue={MIN_LINE_WIDTH}
                            maxValue={MAX_LINE_WIDTH}
                            value0={MIN_LINE_WIDTH}
                            value1={annotation.lineWidth}
                            step={1}
                            isRanged={false}
                            onSlider1Change={width => handleChangeLineWidth(annotation.id, width)}
                          />
                          <span className="annotation-line-width-value">
                            {annotation.lineWidth}px
                          </span>
                        </StyledLineWidthSlider>
                      </StyledConfigRow>
                      <StyledConfigRow>
                        <StyledConfigLabel>
                          {intl.formatMessage({
                            id: 'annotationManager.color',
                            defaultMessage: 'Color'
                          })}
                        </StyledConfigLabel>
                        <InlineColorPicker
                          color={hexToRgb(annotation.lineColor)}
                          onSetColor={rgb => handleChangeLineColor(annotation.id, rgb)}
                        />
                      </StyledConfigRow>
                      {annotation.kind === AnnotationKind.RULER ? (
                        <>
                          <StyledConfigRow>
                            <StyledConfigLabel
                              as="label"
                              htmlFor={`annotation-${annotation.id}-show-custom-text`}
                            >
                              {intl.formatMessage({
                                id: 'annotationManager.customText',
                                defaultMessage: 'Custom Text'
                              })}
                            </StyledConfigLabel>
                            <Switch
                              id={`annotation-${annotation.id}-show-custom-text`}
                              checked={annotation.showCustomText}
                              onChange={event =>
                                handleToggleRulerText(
                                  annotation.id,
                                  'showCustomText',
                                  event.target.checked
                                )
                              }
                            />
                          </StyledConfigRow>
                          <StyledConfigRow>
                            <StyledConfigLabel
                              as="label"
                              htmlFor={`annotation-${annotation.id}-show-distance`}
                            >
                              {intl.formatMessage({
                                id: 'annotationManager.distance',
                                defaultMessage: 'Distance'
                              })}
                            </StyledConfigLabel>
                            <Switch
                              id={`annotation-${annotation.id}-show-distance`}
                              checked={annotation.showDistance}
                              onChange={event =>
                                handleToggleRulerText(
                                  annotation.id,
                                  'showDistance',
                                  event.target.checked
                                )
                              }
                            />
                          </StyledConfigRow>
                        </>
                      ) : (
                        <>
                          <StyledConfigRow>
                            <StyledConfigLabel>
                              {intl.formatMessage({
                                id: 'annotationManager.textSide',
                                defaultMessage: 'Text Side'
                              })}
                            </StyledConfigLabel>
                            <StyledSelect
                              selectedItems={ANNOTATION_TEXT_SIDES.find(
                                s => s.id === textPlacement.side
                              )}
                              options={ANNOTATION_TEXT_SIDES}
                              displayOption="label"
                              getOptionValue="id"
                              multiSelect={false}
                              searchable={false}
                              onChange={side => {
                                if (side == null) return;
                                handleChangeTextPlacement(annotation, {
                                  textSide: side as AnnotationTextSide
                                });
                              }}
                            />
                          </StyledConfigRow>
                          <StyledConfigRow>
                            <StyledConfigLabel>
                              {intl.formatMessage({
                                id: 'annotationManager.textPlacement',
                                defaultMessage: 'Placement'
                              })}
                            </StyledConfigLabel>
                            <StyledSelect
                              selectedItems={ANNOTATION_TEXT_VERTICAL_POSITIONS.find(
                                p => p.id === textPlacement.vertical
                              )}
                              options={ANNOTATION_TEXT_VERTICAL_POSITIONS}
                              displayOption="label"
                              getOptionValue="id"
                              multiSelect={false}
                              searchable={false}
                              onChange={position => {
                                if (position == null) return;
                                handleChangeTextPlacement(annotation, {
                                  textVerticalPosition: position as AnnotationTextVerticalPosition
                                });
                              }}
                            />
                          </StyledConfigRow>
                        </>
                      )}
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
