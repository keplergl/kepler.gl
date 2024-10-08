// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import classnames from 'classnames';
import styled from 'styled-components';

import {
  EFFECT_DESCRIPTIONS,
  LIGHT_AND_SHADOW_EFFECT,
  POSTPROCESSING_EFFECTS
} from '@kepler.gl/constants';

import PanelHeaderActionFactory, {PanelHeaderActionIcon} from '../side-panel/panel-header-action';
import {
  ArrowDown,
  ArrowUp,
  EyeSeen,
  EyeUnseen,
  Trash,
  VertDots,
  LightAndShadowEffectIcon,
  InkEffectIcon,
  BrightnessContrastEffectIcon,
  HueSaturationEffectIcon,
  VibranceEffectIcon,
  SepiaEffectIcon,
  DotScreenEffectIcon,
  ColorHalftoneEffectIcon,
  NoiseEffectIcon,
  TriangleBlurEffectIcon,
  ZoomBlurEffectIcon,
  TiltShiftEffectIcon,
  EdgeWorkEffectIcon,
  VignetteEffectIcon,
  MagnifyEffectIcon,
  HexagonalPixelateEffectIcon,
  BaseProps
} from '../common/icons';
import {StyledPanelHeader} from '../common/styled-components';

export type ActionItem = {
  key: string;
  isHidden?: boolean;
  tooltip: string;
  classNames?: Record<string, boolean>;
  icon: PanelHeaderActionIcon;
  tooltipType?: 'error';
  onClick: () => void;
};

export type EffectPanelHeaderProps = {
  type: string;
  listeners: any;
  effectId: string;
  isEnabled: boolean;
  isConfigActive: boolean;
  isJsonEditorActive: boolean;
  showSortHandle?: boolean;
  isDragNDropEnabled: boolean;
  onToggleEnabled: () => void;
  onRemoveEffect: () => void;
  onToggleEnableConfig: () => void;
  actionIcons?: {
    remove: React.ComponentType<Partial<BaseProps>>;
    visible: React.ComponentType<Partial<BaseProps>>;
    hidden: React.ComponentType<Partial<BaseProps>>;
    enableConfig: React.ComponentType<Partial<BaseProps>>;
    disableConfig: React.ComponentType<Partial<BaseProps>>;
  };
  actionItems?: ActionItem[];
};

export const defaultProps = {
  isDragNDropEnabled: true
};

const defaultActionIcons = {
  remove: Trash,
  visible: EyeSeen,
  hidden: EyeUnseen,
  enableConfig: ArrowDown,
  disableConfig: ArrowUp
};

const defaultEffectIcons = {
  [LIGHT_AND_SHADOW_EFFECT.type]: LightAndShadowEffectIcon,
  [POSTPROCESSING_EFFECTS.ink.type]: InkEffectIcon,
  [POSTPROCESSING_EFFECTS.brightnessContrast.type]: BrightnessContrastEffectIcon,
  [POSTPROCESSING_EFFECTS.hueSaturation.type]: HueSaturationEffectIcon,
  [POSTPROCESSING_EFFECTS.vibrance.type]: VibranceEffectIcon,
  [POSTPROCESSING_EFFECTS.sepia.type]: SepiaEffectIcon,
  [POSTPROCESSING_EFFECTS.dotScreen.type]: DotScreenEffectIcon,
  [POSTPROCESSING_EFFECTS.colorHalftone.type]: ColorHalftoneEffectIcon,
  [POSTPROCESSING_EFFECTS.noise.type]: NoiseEffectIcon,
  [POSTPROCESSING_EFFECTS.triangleBlur.type]: TriangleBlurEffectIcon,
  [POSTPROCESSING_EFFECTS.zoomBlur.type]: ZoomBlurEffectIcon,
  [POSTPROCESSING_EFFECTS.tiltShift.type]: TiltShiftEffectIcon,
  [POSTPROCESSING_EFFECTS.edgeWork.type]: EdgeWorkEffectIcon,
  [POSTPROCESSING_EFFECTS.vignette.type]: VignetteEffectIcon,
  [POSTPROCESSING_EFFECTS.magnify.type]: MagnifyEffectIcon,
  [POSTPROCESSING_EFFECTS.hexagonalPixelate.type]: HexagonalPixelateEffectIcon
};

const StyledEffectPanelHeader = styled(StyledPanelHeader)`
  height: ${props => props.theme.effectPanelHeaderHeight}px;
  position: relative;
  align-items: stretch;

  .effect__drag-handle {
    margin-left: -5px;
    color: ${props => props.theme.textColor};
  }

  .effect__drag-handle__placeholder {
    height: 20px;
    padding: 0px;
    margin: 10px 10px 10px 5px;
  }

  :hover {
    cursor: pointer;
    background-color: ${props => props.theme.panelBackgroundHover};
    .effect__drag-handle {
      opacity: 1;
    }
  }

  border-left: 3px solid ${props => props.theme.panelBackgroundHover};
`;

const HeaderActionSection = styled.div`
  display: flex;
  position: absolute;
  height: 100%;
  align-items: stretch;
  right: 10px;
  :hover {
    .effect-panel__header__actions__hidden {
      opacity: 1;
      background-color: ${props => props.theme.panelBackgroundHover};
    }
  }
`;

// Hiden actions only show up on hover
type StyledPanelHeaderHiddenActionsProps = {isConfigActive: boolean};
const StyledPanelHeaderHiddenActions = styled.div.attrs({
  className: 'effect-panel__header__actions__hidden'
})<StyledPanelHeaderHiddenActionsProps>`
  opacity: 0;
  display: flex;
  align-items: center;
  transition: opacity 0.4s ease, background-color 0.4s ease;
  background-color: ${props =>
    props.isConfigActive ? props.theme.panelBackgroundHover : props.theme.panelBackground};

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

const DragHandle = ({className, listeners, children}) => (
  <StyledDragHandle className={className} {...listeners}>
    {children}
  </StyledDragHandle>
);

EffectPanelHeaderActionSectionFactory.deps = [PanelHeaderActionFactory];

export function EffectPanelHeaderActionSectionFactory(
  PanelHeaderAction: ReturnType<typeof PanelHeaderActionFactory>
): React.FC<EffectPanelHeaderProps> {
  const EffectPanelHeaderActionSection = (props: EffectPanelHeaderProps) => {
    const {
      effectId,
      isEnabled,
      isConfigActive,
      onToggleEnabled,
      onRemoveEffect,
      onToggleEnableConfig,
      actionItems,
      actionIcons = defaultActionIcons
    } = props;

    const effectActionItems: ActionItem[] = useMemo(
      () =>
        actionItems ?? [
          {
            key: 'remove-effect',
            isHidden: true,
            tooltip: 'tooltip.removeEffect',
            tooltipType: 'error',
            onClick: onRemoveEffect,
            icon: actionIcons.remove
          },
          {
            key: 'visibility-toggle',
            tooltip: isEnabled ? 'tooltip.disableEffect' : 'tooltip.enabledEffect',
            onClick: onToggleEnabled,
            icon: isEnabled ? actionIcons.visible : actionIcons.hidden
          },
          {
            key: 'enable-config',
            classNames: {'is-open': isConfigActive},
            tooltip: 'tooltip.effectSettings',
            onClick: onToggleEnableConfig,
            icon: actionIcons.enableConfig
          }
        ],
      [
        actionItems,
        actionIcons,
        isEnabled,
        isConfigActive,
        onRemoveEffect,
        onToggleEnabled,
        onToggleEnableConfig
      ]
    );

    return (
      <HeaderActionSection className="effect-panel__header__actions">
        <StyledPanelHeaderHiddenActions isConfigActive={isConfigActive}>
          {effectActionItems
            .filter((item: ActionItem) => Boolean(item.isHidden))
            .map((item: ActionItem) => (
              <PanelHeaderAction
                key={item.key}
                className={`effect__${item.key}`}
                testId={`${item.key}-action`}
                id={effectId}
                tooltip={item.tooltip}
                onClick={item.onClick}
                tooltipType={item.tooltipType}
                IconComponent={item.icon}
              />
            ))}
        </StyledPanelHeaderHiddenActions>
        {effectActionItems
          .filter((item: ActionItem) => !item.isHidden)
          .map((item: ActionItem) => (
            <PanelHeaderAction
              key={item.key}
              className={classnames(`effect__${item.key}`, item.classNames)}
              testId={`${item.key}-action`}
              id={effectId}
              tooltip={item.tooltip}
              onClick={item.onClick}
              tooltipType={item.tooltipType}
              IconComponent={item.icon}
            />
          ))}
      </HeaderActionSection>
    );
  };

  return EffectPanelHeaderActionSection;
}

const StyledEffectTitleSection = styled.div`
  margin-left: 8px;
  flex-grow: 1;
  align-items: center;
  display: flex;
  color: ${props => props.theme.textColor};
`;

const IconPlaceholder = styled.div`
  width: 20px;
  height: 20px;
`;

const EffectIconWrapper = styled.div`
  height: 18px;
  margin: auto;
  color: ${props => props.theme.textColor};
`;

EffectPanelHeaderFactory.deps = [EffectPanelHeaderActionSectionFactory];

function EffectPanelHeaderFactory(
  EffectPanelHeaderActionSection: ReturnType<typeof EffectPanelHeaderActionSectionFactory>
): React.FC<EffectPanelHeaderProps> {
  const EffectPanelHeader = (props: EffectPanelHeaderProps) => {
    const {
      isConfigActive,
      isDragNDropEnabled = true,
      type,
      onToggleEnableConfig,
      listeners,
      showSortHandle = true
    } = props;

    const label = useMemo(() => {
      const description = EFFECT_DESCRIPTIONS.find(_description => _description.type === type);
      return description?.name || 'Effect';
    }, [type]);

    const EffectIcon = defaultEffectIcons[type];

    return (
      <StyledEffectPanelHeader
        className={classnames('effect-panel__header', {
          'sort--handle': !isConfigActive
        })}
        active={isConfigActive}
        onClick={onToggleEnableConfig}
      >
        {isDragNDropEnabled ? (
          <DragHandle className="effect__drag-handle" listeners={listeners}>
            {showSortHandle ? <VertDots height="20px" /> : <IconPlaceholder />}
          </DragHandle>
        ) : (
          <div className="effect__drag-handle__placeholder" />
        )}

        <EffectIconWrapper>{EffectIcon ? <EffectIcon height="18px" /> : null}</EffectIconWrapper>

        <StyledEffectTitleSection>{label}</StyledEffectTitleSection>

        <EffectPanelHeaderActionSection {...props} />
      </StyledEffectPanelHeader>
    );
  };

  return EffectPanelHeader;
}

export default EffectPanelHeaderFactory;
