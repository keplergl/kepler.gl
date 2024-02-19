// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';
import {Clock, Close, LineChart, ArrowDown, ArrowUp} from '../common/icons';
import FieldSelectorFactory from '../common/field-selector';
import {SelectTextBold, IconRoundSmall, CenterFlexbox} from '../common/styled-components';
import {TimeWidgetTopProps, TopSectionWrapperProps} from './types';
import {Field} from '@kepler.gl/types';

const TOP_SECTION_HEIGHT = '36px';

const TopSectionWrapper = styled.div.attrs({
  className: 'time-widget--top'
})<TopSectionWrapperProps>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: ${props => props.theme.labelColor};
  height: ${TOP_SECTION_HEIGHT};

  .bottom-widget__y-axis {
    flex-grow: 1;
    margin-left: 20px;
  }

  .bottom-widget__field-select {
    width: 160px;
    display: inline-block;

    .item-selector__dropdown {
      background: transparent;
      padding: 4px 10px 4px 4px;
      border-color: transparent;

      :active,
      :focus,
      &.focus,
      &.active {
        background: transparent;
        border-color: transparent;
      }
    }

    .item-selector__dropdown:hover {
      background: transparent;
      border-color: transparent;

      .item-selector__dropdown__value {
        color: ${props =>
          props.hoverColor ? props.theme[props.hoverColor] : props.theme.textColorHl};
      }
    }
  }

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

TimeWidgetTopFactory.deps = [FieldSelectorFactory];
function TimeWidgetTopFactory(FieldSelector: ReturnType<typeof FieldSelectorFactory>) {
  const TimeWidgetTop: React.FC<TimeWidgetTopProps> = ({
    filter,
    readOnly,
    datasets,
    setFilterPlot,
    onClose,
    isMinified,
    onToggleMinify
  }) => {
    const yAxisFields = useMemo(
      () =>
        ((datasets[filter.dataId[0]] || {}).fields || []).filter(
          (f: Field) => f.type === 'integer' || f.type === 'real'
        ),
      [datasets, filter.dataId]
    );
    const _setFilterPlotYAxis = useCallback(
      value => setFilterPlot({yAxis: value}),
      [setFilterPlot]
    );

    return (
      <TopSectionWrapper>
        <StyledTitle className="bottom-widget__field">
          <CenterFlexbox className="bottom-widget__icon">
            <Clock height="15px" />
          </CenterFlexbox>
          <SelectTextBold>{filter.name}</SelectTextBold>
        </StyledTitle>
        {!isMinified ? (
          <StyledTitle className="bottom-widget__y-axis">
            <CenterFlexbox className="bottom-widget__icon">
              <LineChart height="15px" />
            </CenterFlexbox>
            <div className="bottom-widget__field-select">
              <FieldSelector
                fields={yAxisFields}
                placement="top"
                value={filter.yAxis ? filter.yAxis.name : null}
                onSelect={_setFilterPlotYAxis}
                placeholder="placeholder.yAxis"
                erasable
                showToken={false}
              />
            </div>
          </StyledTitle>
        ) : null}
        <StyledCenterBox>
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
