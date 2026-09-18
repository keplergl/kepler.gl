// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo, useState} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import {applyFilterConfig, setAnimationConfig} from '@kepler.gl/actions';
import {FILTER_TYPES} from '@kepler.gl/constants';
import {visStateLens} from '@kepler.gl/reducers';
import {VisState} from '@kepler.gl/schemas';
import {AnimationConfig, Filter} from '@kepler.gl/types';
import {FormattedMessage} from '@kepler.gl/localization';

import {CodeAlt} from '../icons';
import IconButton from '../icon-button';
import TippyTooltip from '../tippy-tooltip';
import {withState} from '../../injector';
import JsonEditor from '../json-editor';
import {
  animationConfigToJson,
  applyStatus,
  areJsonEditorsEnabled,
  errorStatus,
  jsonToAnimationConfig,
  jsonToFilterConfig,
  JsonEditorStatus,
  useDebounce
} from '../json-editor-utils';

const StyledPopover = styled.div`
  position: absolute;
  bottom: 40px;
  right: 0;
  z-index: 100;
  width: 360px;
  background-color: ${props => props.theme.sidePanelBg || props.theme.panelBackground};
  border: 1px solid ${props => props.theme.panelBorderColor || props.theme.panelBackgroundHover};
  box-shadow: ${props => props.theme.panelBoxShadow};
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px 0;
  color: ${props => props.theme.titleTextColor || props.theme.textColor};
  font-size: 12px;
  letter-spacing: 0.4px;
`;

const StyledControl = styled.div`
  position: relative;
`;

export type AnimationJsonEditorControlProps = {
  filter?: Filter;
  btnStyle?: Record<string, boolean>;
  buttonHeight?: string;
  showAnimationWindowControl?: boolean;
};

export type AnimationJsonEditorProps = {
  filterId?: string;
  visState?: VisState;
  applyFilterConfig?: typeof applyFilterConfig;
  setAnimationConfig?: typeof setAnimationConfig;
  onClose: () => void;
};

function AnimationJsonEditorFactory() {
  const AnimationJsonEditor: React.FC<AnimationJsonEditorProps> = ({
    filterId,
    visState,
    applyFilterConfig: applyFilterConfigAction,
    setAnimationConfig: setAnimationConfigAction,
    onClose
  }) => {
    const config = useMemo(() => {
      if (!visState) {
        return undefined;
      }
      if (filterId) {
        return visState.filters.find(item => item.id === filterId);
      }
      return visState.animationConfig;
    }, [filterId, visState]);

    const jsonText = useMemo(
      () => animationConfigToJson(config, visState?.schema),
      [config, visState?.schema]
    );
    const debouncedJsonText = useDebounce(jsonText, 300);

    const handleApply = useCallback(
      (text: string): JsonEditorStatus => {
        try {
          if (filterId) {
            const filter = visState?.filters.find(item => item.id === filterId);
            if (!applyFilterConfigAction || !filter) {
              return applyStatus(false);
            }
            applyFilterConfigAction(filterId, jsonToFilterConfig(text, filter));
            return applyStatus(true);
          }
          if (!setAnimationConfigAction) {
            return applyStatus(false);
          }
          setAnimationConfigAction(jsonToAnimationConfig(text) as AnimationConfig);
          return applyStatus(true);
        } catch (error) {
          return errorStatus(error);
        }
      },
      [applyFilterConfigAction, filterId, setAnimationConfigAction, visState]
    );

    return (
      <StyledPopover className="animation-json-editor">
        <StyledHeader>
          <FormattedMessage id="tooltip.editAnimationJson" defaultMessage="Edit animation JSON" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              border: 'none',
              background: 'transparent',
              color: 'inherit',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </StyledHeader>
        <JsonEditor jsonText={debouncedJsonText} onApply={handleApply} height={220} />
      </StyledPopover>
    );
  };

  return withState([visStateLens], () => ({}), {applyFilterConfig, setAnimationConfig})(
    AnimationJsonEditor
  ) as React.FC<AnimationJsonEditorProps>;
}

AnimationJsonEditorControlFactory.deps = [AnimationJsonEditorFactory];

function AnimationJsonEditorControlFactory(
  AnimationJsonEditor: ReturnType<typeof AnimationJsonEditorFactory>
) {
  const AnimationJsonEditorControl: React.FC<AnimationJsonEditorControlProps> = ({
    filter,
    btnStyle = {},
    buttonHeight = '16px',
    showAnimationWindowControl
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleToggle = useCallback(() => setIsOpen(open => !open), []);
    const handleClose = useCallback(() => setIsOpen(false), []);

    if (!areJsonEditorsEnabled() || showAnimationWindowControl) {
      return null;
    }

    const filterId = filter?.type === FILTER_TYPES.timeRange ? filter.id : undefined;

    return (
      <StyledControl className="animation-json-editor-control">
        <TippyTooltip
          placement="top"
          delay={[500, 0]}
          render={() => <FormattedMessage id="tooltip.editAnimationJson" />}
        >
          <IconButton
            className={classnames('playback-control-button animation-json-control-button', {
              active: isOpen
            })}
            {...btnStyle}
            onClick={handleToggle}
          >
            <CodeAlt height={buttonHeight} />
          </IconButton>
        </TippyTooltip>
        {isOpen ? <AnimationJsonEditor filterId={filterId} onClose={handleClose} /> : null}
      </StyledControl>
    );
  };

  return AnimationJsonEditorControl;
}

export default AnimationJsonEditorControlFactory;
export {AnimationJsonEditorFactory};
