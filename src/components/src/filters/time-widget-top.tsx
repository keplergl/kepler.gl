// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect, useMemo, useRef, useState} from 'react';
import styled, {IStyledComponent, useTheme} from 'styled-components';
import {useIntl} from 'react-intl';
import {
  Close,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Gear,
  Play,
  Pause,
  Reset,
  FreeWindow,
  AnchorWindow,
  Interval,
  Save,
  CodeAlt
} from '../common/icons';
import {SelectTextBold, IconRoundSmall, CenterFlexbox} from '../common/styled-components';
import {TimeWidgetTopProps, TopSectionWrapperProps} from './types';
import {TIME_AGGREGATION, AGGREGATION_TYPES, ANIMATION_WINDOW} from '@kepler.gl/constants';
import {FILTER_TYPES} from '@kepler.gl/constants';
import {formatNumber, getNumericPlotInterval, preciseRound} from '@kepler.gl/utils';
import {RangeFilter} from '@kepler.gl/types';
import Portaled from '../common/portaled';
import TippyTooltip from '../common/tippy-tooltip';
import {ContextMenuAction, ContextMenuList} from '../common/context-menu';
import AnimationSpeedSliderFactory from '../common/animation-control/animation-speed-slider';
import {AnimationJsonEditorFactory} from '../common/animation-control/animation-json-editor';
import {isJsonEditorEnabled} from '../common/json-editor-utils';

const TOP_SECTION_HEIGHT = '36px';

const TopSectionWrapper: IStyledComponent<'web', TopSectionWrapperProps> = styled.div.attrs({
  className: 'time-widget--top'
})<TopSectionWrapperProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  color: ${props => props.theme.labelColor};
  container-type: inline-size;
  container-name: timeline-header;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
  padding: 4px 12px;
  background-color: ${props => props.theme.panelBackground};
  min-height: ${TOP_SECTION_HEIGHT};
`;

const StyledTitle = styled(CenterFlexbox)`
  flex: 1;
  min-width: 0;
  color: ${props => props.theme.textColor};
`;

const StyledTitleText = styled(SelectTextBold)`
  min-width: 0;
  line-height: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledCenterBox = styled(CenterFlexbox)`
  flex-shrink: 0;
  gap: 4px;
`;

const PlaybackRow = styled(HeaderRow)`
  justify-content: flex-start;
  background-color: transparent;

  @container timeline-header (max-width: 300px) {
    flex-wrap: wrap;
  }
`;

const CompactHeaderRow = styled(HeaderRow)`
  flex-wrap: wrap;
  gap: 4px 12px;
  background-color: transparent;
`;

const CompactPlayback = styled.div`
  display: flex;
  flex: 1 1 0;
  align-items: center;
  gap: 4px 12px;
  min-width: min(100%, 300px);
`;

const CompactSummary = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 1 auto;
  min-width: 0;
`;

const CompactActions = styled.div`
  margin-left: auto;
`;

const SelectedRange = styled.div`
  flex: 0 1 auto;
  min-width: 0;
  color: ${props => props.theme.textColor};
  font-size: ${props => props.theme.selectFontSize};
  font-weight: 500;
  line-height: 16px;

  .floating-time-display {
    position: static;
    bottom: auto;
    width: auto;
    margin-left: 0;
    justify-content: flex-start;
    pointer-events: auto;
  }

  .floating-time-display__inner {
    background: transparent;
    border-radius: 0;
    height: auto;
    min-width: 0;
    max-width: 100%;
    opacity: 1;
    padding: 0;
    justify-content: flex-start;
    color: inherit;
    font: inherit;
  }

  .animation-control__time-display__top,
  .animation-control__time-display__bottom {
    justify-content: flex-start;
    color: inherit;
    font: inherit;
    min-width: 0;
  }

  .floating-time-display__inner > div,
  .animation-control__time-display__top > div,
  .animation-control__time-display__bottom > div {
    min-width: 0;
    align-items: flex-start;
  }

  .animation-control__horizontal-bar {
    margin: 0 6px;
    flex-shrink: 0;
  }

  .time-value,
  .animation-control__time-value-group {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  @container timeline-header (max-width: 560px) {
    .floating-time-display__inner > div,
    .animation-control__time-display__top > div,
    .animation-control__time-display__bottom > div {
      flex-direction: column;
      align-items: flex-start;
      min-width: 0;
    }

    .animation-control__horizontal-bar {
      display: none;
    }
  }
`;

const ActionSeparator = styled.span`
  height: 16px;
  border-left: 1px solid ${props => props.theme.panelBorderColor};
  margin: 0 2px;
`;

const HeaderButton = styled(IconRoundSmall)`
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 0;
  font: inherit;
  font-size: ${props => props.theme.selectFontSize};
  font-weight: ${props => props.theme.selectFontWeightBold};
  line-height: 16px;
  background-color: transparent;
  color: ${props => props.theme.textColor};

  &:hover {
    background-color: ${props => props.theme.panelBackgroundHover};
    color: ${props => props.theme.panelHeaderIconHover};
  }

  &:focus-visible {
    outline: 2px solid ${props => props.theme.activeColor};
    outline-offset: -2px;
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }

  &[aria-pressed='true'],
  &[aria-haspopup][aria-expanded='true'] {
    background-color: ${props => props.theme.panelBackgroundHover};
    color: ${props => props.theme.panelHeaderIconActive};
  }
`;

const PlayButton = styled(HeaderButton)`
  background-color: ${props => props.theme.panelBackgroundHover};
  color: ${props => props.theme.textColor};
`;

const PopoverContent = styled.div`
  .animation-control__speed-slider,
  .animation-json-editor {
    position: relative;
    top: auto;
    bottom: auto;
    left: auto;
    right: auto;
  }

  .animation-json-editor {
    width: min(360px, calc(100vw - 80px));
    box-sizing: border-box;
  }
`;

const ANIMATION_MODES = [
  {id: ANIMATION_WINDOW.free, labelId: 'tooltip.animationByWindow', Icon: FreeWindow},
  {id: ANIMATION_WINDOW.incremental, labelId: 'tooltip.animationByIncremental', Icon: AnchorWindow},
  {id: ANIMATION_WINDOW.interval, labelId: 'tooltip.animationByInterval', Icon: Interval}
];

TimeWidgetTopFactory.deps = [AnimationSpeedSliderFactory, AnimationJsonEditorFactory];
function TimeWidgetTopFactory(
  AnimationSpeedSlider?: ReturnType<typeof AnimationSpeedSliderFactory>,
  AnimationJsonEditor?: ReturnType<typeof AnimationJsonEditorFactory>
) {
  const TimeWidgetTop: React.FC<TimeWidgetTopProps> = ({
    filter,
    readOnly,
    onClose,
    isMinified,
    onToggleMinify,
    onToggleSettings,
    settingsOpen = false,
    playbackControls,
    rangeDisplay
  }) => {
    const intl = useIntl();
    const theme = useTheme();
    // Portaled remeasures on open; animating its retained coordinates makes
    // the popup travel from the previous position before settling into place.
    const popoverTheme = useMemo(() => ({...theme, transitionFast: 'none'}), [theme]);
    const [popover, setPopover] = useState<'animation' | 'speed' | 'json' | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const speedButtonRef = useRef<HTMLButtonElement>(null);
    const minifyButtonRef = useRef<HTMLButtonElement>(null);
    const restoreMinifyFocus = useRef(false);
    useEffect(() => {
      // Changing layouts remounts the popup anchor. Dismiss the popup instead
      // of retaining an open modal on an initially invisible Portaled instance.
      setPopover(null);
      if (restoreMinifyFocus.current) {
        minifyButtonRef.current?.focus();
        restoreMinifyFocus.current = false;
      }
    }, [isMinified]);
    const toggleMinify = () => {
      const button = minifyButtonRef.current;
      restoreMinifyFocus.current = Boolean(button && button.ownerDocument.activeElement === button);
      onToggleMinify();
    };
    const closePopover = () => {
      // The speed input commits on blur. Outside pointer events can dismiss
      // the popup before the browser moves focus, so commit before unmounting.
      if (
        popover === 'speed' &&
        document.activeElement instanceof HTMLElement &&
        popoverRef.current?.contains(document.activeElement)
      ) {
        document.activeElement.blur();
      }
      if (popover === 'speed') {
        // Restore focus after dismissal's default focus action, unless the user
        // has already moved to another control or opened another popup.
        requestAnimationFrame(() => {
          if (document.activeElement === document.body) {
            speedButtonRef.current?.focus();
          }
        });
      }
      setPopover(null);
    };
    const selectAction = (action: () => void) => () => {
      closePopover();
      action();
    };
    const currentMode =
      ANIMATION_MODES.find(
        mode => mode.id === (playbackControls?.animationWindow || filter.animationWindow)
      ) || ANIMATION_MODES[0];
    const playLabel = intl.formatMessage({
      id: playbackControls?.isAnimating ? 'tooltip.pause' : 'tooltip.play'
    });
    const resetLabel = intl.formatMessage({id: 'tooltip.reset'});
    const speedLabel = intl.formatMessage({id: 'tooltip.speed'});
    const animationItems: ContextMenuAction[] = playbackControls
      ? ANIMATION_MODES.map(mode => ({
          ...mode,
          className: `time-widget-animation-${mode.id}`,
          iconHeight: '16px',
          active: currentMode.id === mode.id,
          disabled: !playbackControls.isAnimatable,
          onClick: selectAction(() => playbackControls.setFilterAnimationWindow(mode.id))
        }))
      : [];
    const headerActions: ContextMenuAction[] = [];

    if (playbackControls?.exportAnimation) {
      headerActions.push({
        className: 'time-widget-export',
        labelId: 'tooltip.videoExport',
        Icon: Save,
        iconHeight: '16px',
        disabled: !playbackControls.isAnimatable,
        onClick: selectAction(playbackControls.exportAnimation)
      });
    }
    if (playbackControls && AnimationJsonEditor && isJsonEditorEnabled('animation')) {
      headerActions.push({
        className: 'time-widget-json',
        labelId: 'tooltip.editAnimationJson',
        Icon: CodeAlt,
        iconHeight: '16px',
        disabled: !playbackControls.isAnimatable,
        onClick: () => setPopover('json')
      });
    }
    const chartTitle = useMemo(() => {
      if (filter.type === FILTER_TYPES.range) {
        const rangeFilter = filter as RangeFilter;
        const xAxisName = Array.isArray(rangeFilter.name) ? rangeFilter.name[0] : rangeFilter.name;
        const binWidth = getNumericPlotInterval(rangeFilter);
        const binLabel = binWidth ? ` (${formatNumber(binWidth, rangeFilter.fieldType)} bins)` : '';
        if (!rangeFilter.yAxis) {
          return `Count of Rows by ${xAxisName}${binLabel}`;
        }
        const aggregation = rangeFilter.plotType?.aggregation || AGGREGATION_TYPES.average;
        const aggLabel = TIME_AGGREGATION.find(a => a.id === aggregation)?.label || aggregation;
        return `${aggLabel} ${rangeFilter.yAxis.name} by ${xAxisName}${binLabel}`;
      }
      const interval = filter.plotType?.interval;
      let intervalLabel = 'Time';
      if (interval) {
        const parts = interval.split('-');
        if (parts.length === 2) {
          intervalLabel = `${parts[0]} ${parts[1]}`;
        }
      }
      if (!filter.yAxis) {
        return `Count of Rows per ${intervalLabel}`;
      }
      const aggregation = filter.plotType?.aggregation || AGGREGATION_TYPES.average;
      const aggLabel = TIME_AGGREGATION.find(a => a.id === aggregation)?.label || aggregation;
      return `${aggLabel} ${filter.yAxis.name} per ${intervalLabel}`;
    }, [filter]);

    const title = (
      <StyledTitle className="bottom-widget__field">
        <TippyTooltip
          placement="top"
          delay={[500, 0]}
          render={() => <span role="tooltip">{chartTitle}</span>}
        >
          <StyledTitleText>{chartTitle}</StyledTitleText>
        </TippyTooltip>
      </StyledTitle>
    );
    const actions = (
      <StyledCenterBox>
        {!isMinified && onToggleSettings ? (
          <TippyTooltip
            placement="top"
            delay={[500, 0]}
            render={() => (
              <span role="tooltip">
                {settingsOpen ? 'Hide settings' : intl.formatMessage({id: 'tooltip.settings'})}
              </span>
            )}
          >
            <HeaderButton
              as="button"
              type="button"
              className="time-widget-settings"
              data-testid="time-widget-settings"
              aria-label={intl.formatMessage({id: 'tooltip.settings'})}
              aria-expanded={settingsOpen}
              onClick={selectAction(onToggleSettings)}
            >
              <Gear height="16px" />
            </HeaderButton>
          </TippyTooltip>
        ) : null}
        {headerActions.map(action => {
          const isJson = action.className === 'time-widget-json';
          const label = intl.formatMessage({id: action.labelId});
          return (
            <TippyTooltip
              key={action.className}
              placement="top"
              delay={[500, 0]}
              render={() => <span role="tooltip">{label}</span>}
            >
              <HeaderButton
                as="button"
                type="button"
                className={action.className}
                data-testid={action.className}
                aria-label={label}
                aria-expanded={isJson ? popover === 'json' : undefined}
                aria-haspopup={isJson ? 'dialog' : undefined}
                disabled={action.disabled}
                onClick={action.onClick}
              >
                <action.Icon height={action.iconHeight} />
              </HeaderButton>
            </TippyTooltip>
          );
        })}
        <ActionSeparator aria-hidden="true" />
        <TippyTooltip
          placement="top"
          delay={[500, 0]}
          render={() => (
            <span role="tooltip">{isMinified ? 'Expand timeline' : 'Collapse timeline'}</span>
          )}
        >
          <HeaderButton
            as="button"
            type="button"
            ref={minifyButtonRef}
            aria-label={isMinified ? 'Expand timeline' : 'Collapse timeline'}
            aria-expanded={!isMinified}
            onClick={toggleMinify}
          >
            {isMinified ? <ArrowUp height="14px" /> : <ArrowDown height="14px" />}
          </HeaderButton>
        </TippyTooltip>
        {!readOnly ? (
          <TippyTooltip
            placement="top"
            delay={[500, 0]}
            render={() => <span role="tooltip">Close timeline</span>}
          >
            <HeaderButton as="button" type="button" aria-label="Close timeline" onClick={onClose}>
              <Close height="14px" />
            </HeaderButton>
          </TippyTooltip>
        ) : null}
      </StyledCenterBox>
    );
    const selectedRange = (
      <SelectedRange role="group" aria-label="Selected range">
        {rangeDisplay}
      </SelectedRange>
    );
    const stepControl = (direction: 'backward' | 'forward') => {
      const isForward = direction === 'forward';
      const onClick = isForward ? playbackControls?.stepForward : playbackControls?.stepBackward;
      if (!onClick) {
        return null;
      }
      const label = intl.formatMessage({
        id: isForward ? 'tooltip.nextInterval' : 'tooltip.previousInterval'
      });
      const key = isForward ? 'ArrowRight' : 'ArrowLeft';
      const Icon = isForward ? ArrowRight : ArrowLeft;
      const canStep = isForward
        ? playbackControls?.canStepForward
        : playbackControls?.canStepBackward;
      return (
        <TippyTooltip
          placement="top"
          delay={[500, 0]}
          render={() => (
            <span role="tooltip">
              {label} (Ctrl/Cmd + {isForward ? '→' : '←'})
            </span>
          )}
        >
          <HeaderButton
            as="button"
            type="button"
            className="time-widget-step"
            data-testid={`time-widget-step-${direction}`}
            aria-label={label}
            aria-keyshortcuts={`Control+${key} Meta+${key}`}
            disabled={!playbackControls?.isAnimatable || canStep === false}
            onClick={onClick}
          >
            <Icon height="16px" />
          </HeaderButton>
        </TippyTooltip>
      );
    };
    const playback = playbackControls ? (
      <StyledCenterBox role="group" aria-label="Playback controls">
        {stepControl('backward')}
        <TippyTooltip
          placement="top"
          delay={[500, 0]}
          render={() => <span role="tooltip">{playLabel}</span>}
        >
          <PlayButton
            as="button"
            type="button"
            data-testid="time-widget-play"
            aria-label={playLabel}
            aria-pressed={playbackControls.isAnimating}
            disabled={!playbackControls.isAnimatable}
            onClick={playbackControls.toggleAnimation}
          >
            {playbackControls.isAnimating ? <Pause height="16px" /> : <Play height="16px" />}
          </PlayButton>
        </TippyTooltip>
        {stepControl('forward')}
        <TippyTooltip
          placement="top"
          delay={[500, 0]}
          render={() => <span role="tooltip">{resetLabel}</span>}
        >
          <HeaderButton
            as="button"
            type="button"
            className="time-widget-reset"
            data-testid="time-widget-reset"
            aria-label={resetLabel}
            disabled={!playbackControls.isAnimatable}
            onClick={playbackControls.resetAnimation}
          >
            <Reset height="16px" />
          </HeaderButton>
        </TippyTooltip>
        {AnimationSpeedSlider ? (
          <TippyTooltip
            placement="top"
            delay={[500, 0]}
            render={() => <span role="tooltip">{speedLabel}</span>}
          >
            <HeaderButton
              as="button"
              type="button"
              ref={speedButtonRef}
              data-testid="time-widget-speed"
              aria-label={speedLabel}
              aria-expanded={popover === 'speed'}
              aria-haspopup="dialog"
              disabled={!playbackControls.isAnimatable}
              onClick={() => setPopover('speed')}
            >
              {preciseRound(playbackControls.speed, 1)}×
            </HeaderButton>
          </TippyTooltip>
        ) : null}
        <TippyTooltip
          placement="top"
          delay={[500, 0]}
          render={() => <span role="tooltip">{intl.formatMessage({id: currentMode.labelId})}</span>}
        >
          <HeaderButton
            as="button"
            type="button"
            data-testid="time-widget-animation-mode"
            aria-label="Animation mode"
            aria-expanded={popover === 'animation'}
            aria-haspopup="dialog"
            disabled={!playbackControls.isAnimatable}
            onClick={() => setPopover('animation')}
          >
            <currentMode.Icon height="16px" />
          </HeaderButton>
        </TippyTooltip>
        <Portaled
          theme={popoverTheme}
          isOpened={popover !== null}
          left={0}
          top={0}
          onClose={closePopover}
          modalProps={{
            onAfterOpen: () => {
              if (popover === 'json') {
                popoverRef.current?.querySelector('textarea')?.focus();
              }
            },
            contentLabel:
              popover === 'speed'
                ? speedLabel
                : popover === 'animation'
                ? 'Animation mode'
                : 'Edit animation JSON'
          }}
        >
          <PopoverContent ref={popoverRef}>
            {popover === 'animation' ? (
              <ContextMenuList className="time-widget-animation-menu" items={animationItems} />
            ) : null}
            {popover === 'speed' && AnimationSpeedSlider ? (
              <AnimationSpeedSlider
                speed={playbackControls.speed}
                updateAnimationSpeed={playbackControls.updateAnimationSpeed}
                onHide={closePopover}
              />
            ) : null}
            {popover === 'json' && AnimationJsonEditor ? (
              <AnimationJsonEditor
                filterId={filter.type === FILTER_TYPES.timeRange ? filter.id : undefined}
                onClose={closePopover}
              />
            ) : null}
          </PopoverContent>
        </Portaled>
      </StyledCenterBox>
    ) : null;

    return (
      <TopSectionWrapper>
        {isMinified ? (
          <CompactHeaderRow>
            <CompactPlayback role="group" aria-label="Timeline playback">
              <CompactSummary>
                {title}
                {rangeDisplay ? selectedRange : null}
              </CompactSummary>
              {playback}
            </CompactPlayback>
            <CompactActions role="group" aria-label="Timeline actions">
              {actions}
            </CompactActions>
          </CompactHeaderRow>
        ) : (
          <>
            <HeaderRow
              role="group"
              aria-label="Timeline actions"
              className="time-widget__title-row"
            >
              {title}
              {actions}
            </HeaderRow>
            {playbackControls || rangeDisplay ? (
              <PlaybackRow
                className="time-widget__playback-row"
                role="group"
                aria-label="Timeline playback"
              >
                {selectedRange}
                {playback}
              </PlaybackRow>
            ) : null}
          </>
        )}
      </TopSectionWrapper>
    );
  };
  return TimeWidgetTop;
}

export default TimeWidgetTopFactory;
