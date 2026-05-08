// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
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
import {AnnotationKind, ANNOTATION_KINDS, ANNOTATION_LINE_WIDTH_OPTIONS} from '@kepler.gl/constants';
import {VisState} from '@kepler.gl/schemas';
import {MapState} from '@kepler.gl/types';

import {withState} from '../injector';
import {Add, ArrowDownSmall} from '../common/icons';
import CompactColorPicker from '../effects/compact-color-picker';
import {hexToRgb, rgbToHex} from '@kepler.gl/utils';

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
    `${theme.effectPanelPaddingTop || 8}px ${theme.effectPanelPaddingSide || 16}px 4px ${theme.effectPanelPaddingSide || 16}px`};
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

const StyledAnnotationItem = styled.div<{$isSelected?: boolean; $lineColor?: string}>`
  background: ${props => props.theme.panelBackground};
  margin: 4px 16px;
  padding: 8px 12px;
  border-radius: 4px;
  border-left: 3px solid ${props => props.$lineColor || '#fff'};
  cursor: pointer;
  transition: background 0.2s;
  ${props => props.$isSelected && `background: ${props.theme.panelBackgroundHover};`}
  &:hover {
    background: ${props => props.theme.panelBackgroundHover};
  }
`;

const StyledAnnotationItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledAnnotationLabel = styled.div`
  font-size: 13px;
  color: ${props => props.theme.textColor};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 140px;
`;

const StyledAnnotationKind = styled.div`
  font-size: 11px;
  color: ${props => props.theme.subtextColor};
`;

const StyledActions = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const StyledActionBtn = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.subtextColor};
  cursor: pointer;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 3px;
  &:hover {
    background: ${props => props.theme.panelBackground};
    color: ${props => props.theme.textColor};
  }
`;

const StyledConfigSection = styled.div`
  padding: 8px 16px 12px 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-bottom: 1px solid ${props => props.theme.borderColor};
`;

const StyledConfigRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StyledConfigLabel = styled.div`
  font-size: 11px;
  color: ${props => props.theme.subtextColor};
  min-width: 60px;
`;

const StyledSelect = styled.select`
  background: ${props => props.theme.inputBgd};
  color: ${props => props.theme.inputColor};
  border: 1px solid ${props => props.theme.inputBorderColor || 'transparent'};
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
`;

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
  const AnnotationManager: React.FC<AnnotationManagerProps> = ({intl, visState, mapState, visStateActions}) => {
    const {annotations, selectedAnnotationId} = visState;

    const handleAddAnnotation = useCallback(() => {
      visStateActions.addAnnotation({
        anchorPoint: [mapState.longitude, mapState.latitude]
      });
    }, [visStateActions, mapState.longitude, mapState.latitude]);

    const handleSelectAnnotation = useCallback(
      (id: string) => {
        visStateActions.setSelectedAnnotation(
          id === selectedAnnotationId ? null : id,
          false
        );
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
                {intl.formatMessage({id: 'annotationManager.addAnnotation', defaultMessage: 'Add Annotation'})}
              </StyledAddButton>
            </StyledPanelHeaderRow>
          </StyledAnnotationPanelHeader>
          <StyledAnnotationPanelContent>
            {annotations.map(annotation => (
              <React.Fragment key={annotation.id}>
                <StyledAnnotationItem
                  $isSelected={annotation.id === selectedAnnotationId}
                  $lineColor={annotation.lineColor}
                  onClick={() => handleSelectAnnotation(annotation.id)}
                >
                  <StyledAnnotationItemHeader>
                    <div>
                      <StyledAnnotationLabel>{annotation.label}</StyledAnnotationLabel>
                      <StyledAnnotationKind>{annotation.kind}</StyledAnnotationKind>
                    </div>
                    <StyledActions>
                      <StyledActionBtn
                        onClick={e => handleToggleVisibility(e, annotation)}
                        title={annotation.isVisible ? 'Hide' : 'Show'}
                      >
                        {annotation.isVisible ? '●' : '○'}
                      </StyledActionBtn>
                      <StyledActionBtn
                        onClick={e => handleDuplicateAnnotation(e, annotation.id)}
                        title="Duplicate"
                      >
                        ⧉
                      </StyledActionBtn>
                      <StyledActionBtn
                        onClick={e => handleRemoveAnnotation(e, annotation.id)}
                        title="Remove"
                      >
                        ✕
                      </StyledActionBtn>
                    </StyledActions>
                  </StyledAnnotationItemHeader>
                </StyledAnnotationItem>
                {annotation.id === selectedAnnotationId ? (
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
                      <CompactColorPicker
                        label="Color"
                        color={hexToRgb(annotation.lineColor)}
                        onSetColor={rgb => handleChangeLineColor(annotation.id, rgb)}
                        Icon={ArrowDownSmall}
                      />
                    </StyledConfigRow>
                  </StyledConfigSection>
                ) : null}
              </React.Fragment>
            ))}
          </StyledAnnotationPanelContent>
        </StyledAnnotationPanel>
      </StyledAnnotationPanelContainer>
    );
  };

  return withState([visStateLens, mapStateLens], state => state, {
    visStateActions: {addAnnotation, removeAnnotation, updateAnnotation, duplicateAnnotation, setSelectedAnnotation}
  })(injectIntl(AnnotationManager)) as React.FC<any>;
}
