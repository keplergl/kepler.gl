// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import styled, {IStyledComponent} from 'styled-components';
import {Clock, Close, ArrowDown, ArrowUp, Gear} from '../common/icons';
import {SelectTextBold, IconRoundSmall, CenterFlexbox} from '../common/styled-components';
import {TimeWidgetTopProps, TopSectionWrapperProps} from './types';
import {TIME_AGGREGATION, AGGREGATION_TYPES} from '@kepler.gl/constants';

const TOP_SECTION_HEIGHT = '36px';

const TopSectionWrapper: IStyledComponent<'web', TopSectionWrapperProps> = styled.div.attrs({
  className: 'time-widget--top'
})<TopSectionWrapperProps>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: ${props => props.theme.labelColor};
  height: ${TOP_SECTION_HEIGHT};

  .animation-control__speed-control {
    margin-right: -12px;

    .animation-control__speed-slider {
      right: calc(0% - 48px);
    }
  }
`;

const StyledTitle = styled(CenterFlexbox)`
  flex-grow: 0;
  color: ${props => props.theme.textColor};
  margin-right: 10px;

  .bottom-widget__icon {
    margin-right: 6px;
  }
  .bottom-widget__icon.speed {
    margin-right: 0;
  }
`;

const StyledCenterBox = styled(CenterFlexbox)`
  > div {
    margin-left: 4px;
  }
`;

TimeWidgetTopFactory.deps = [];
function TimeWidgetTopFactory() {
  const TimeWidgetTop: React.FC<TimeWidgetTopProps> = ({
    filter,
    readOnly,
    onClose,
    isMinified,
    onToggleMinify,
    onToggleSettings
  }) => {
    const chartTitle = useMemo(() => {
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
      const aggLabel =
        TIME_AGGREGATION.find(a => a.id === aggregation)?.label || aggregation;
      return `${aggLabel} ${filter.yAxis.name} per ${intervalLabel}`;
    }, [filter.yAxis, filter.plotType?.aggregation, filter.plotType?.interval]);

    return (
      <TopSectionWrapper>
        <StyledTitle className="bottom-widget__field">
          <CenterFlexbox className="bottom-widget__icon">
            <Clock height="15px" />
          </CenterFlexbox>
          <SelectTextBold>{chartTitle}</SelectTextBold>
        </StyledTitle>
        <StyledCenterBox>
          {!isMinified ? (
            <IconRoundSmall>
              <Gear height="12px" onClick={onToggleSettings} />
            </IconRoundSmall>
          ) : null}
          <IconRoundSmall>
            {isMinified ? (
              <ArrowUp height="12px" onClick={onToggleMinify} />
            ) : (
              <ArrowDown height="12px" onClick={onToggleMinify} />
            )}
          </IconRoundSmall>
          {!readOnly ? (
            <IconRoundSmall>
              <Close height="12px" onClick={onClose} />
            </IconRoundSmall>
          ) : null}
        </StyledCenterBox>
      </TopSectionWrapper>
    );
  };
  return TimeWidgetTop;
}

export default TimeWidgetTopFactory;
