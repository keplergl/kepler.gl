// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import {
  getFilterBinThresholds,
  getNumericRangeMinimum,
  getTimelineFromFilter,
  intervalBinFromMarks
} from '@kepler.gl/utils';
import {RangeFilter, TimeRangeFilter} from '@kepler.gl/types';
import {ANIMATION_WINDOW, FILTER_TYPES} from '@kepler.gl/constants';
import AnimationControllerFactory from './common/animation-control/animation-controller';
import {Timeline} from '@kepler.gl/types';

interface FilterAnimationControllerProps {
  filter: TimeRangeFilter | RangeFilter;
  filterIdx: number;
  setFilterAnimationTime: (idx: number, value: string, a: any[]) => void;
  children?: (
    isAnimating: boolean | undefined,
    startAnimation: () => void,
    pauseAnimation: () => void,
    resetAnimation: () => void,
    timeline: Timeline | undefined,
    setTimelineValue: (x: any) => void
  ) => React.ReactElement | null;
}

FilterAnimationControllerFactory.deps = [AnimationControllerFactory];
function FilterAnimationControllerFactory(
  AnimationController: ReturnType<typeof AnimationControllerFactory>
) {
  const FilterAnimationController: React.FC<FilterAnimationControllerProps> = ({
    filter,
    filterIdx,
    setFilterAnimationTime,
    children
  }) => {
    const binThresholds = useMemo(() => {
      return getFilterBinThresholds(filter);
    }, [filter]);
    const isTimeFilter = filter.type === FILTER_TYPES.timeRange;
    const intervalEndOffset = isTimeFilter ? 1 : 0;
    const numericAnimationIncrement = useMemo(() => {
      if (isTimeFilter) {
        return undefined;
      }
      return getNumericRangeMinimum(filter.domain);
    }, [filter.domain, isTimeFilter]);

    const steps = useMemo(() => {
      if (binThresholds) {
        const thresholds = [...binThresholds];
        // pop last threshold
        thresholds.pop();
        return thresholds;
      }

      return null;
    }, [binThresholds]);

    const updateAnimation = useCallback(
      value => {
        switch (filter.animationWindow) {
          case ANIMATION_WINDOW.interval: {
            const idx = value[1];
            if (idx < binThresholds.length - 1) {
              setFilterAnimationTime(
                filterIdx,
                'value',
                intervalBinFromMarks(binThresholds, binThresholds[idx], intervalEndOffset)
              );
            }
            break;
          }
          default:
            setFilterAnimationTime(filterIdx, 'value', value);
            break;
        }
      },
      [filterIdx, binThresholds, filter.animationWindow, intervalEndOffset, setFilterAnimationTime]
    );

    // if filter is synced merge the filter and animation config
    const timeline = getTimelineFromFilter(filter);

    return (
      <AnimationController
        key="filter-control"
        value={filter.value}
        domain={filter.domain}
        speed={filter.speed}
        isAnimating={filter.isAnimating}
        animationWindow={filter.animationWindow}
        steps={steps}
        minimumIncrement={numericAnimationIncrement}
        updateAnimation={updateAnimation}
        // @ts-expect-error different function type, goes to TimeWidget setFilterAnimationTime()
        setTimelineValue={setFilterAnimationTime}
        timeline={timeline}
        children={children}
      />
    );
  };
  return FilterAnimationController;
}

export default FilterAnimationControllerFactory;
