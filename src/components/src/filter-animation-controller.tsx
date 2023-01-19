import React, {useCallback, useMemo} from 'react';
import {getIntervalBins, getTimelineFromFilter} from '@kepler.gl/utils';
import {TimeRangeFilter} from '@kepler.gl/types';
import {ANIMATION_WINDOW} from '@kepler.gl/constants';
import AnimationControllerFactory from './common/animation-control/animation-controller';

interface FilterAnimationControllerProps {
  filter: TimeRangeFilter & {animationWindow?: string};
  filterIdx: number;
  setFilterAnimationTime: (idx: number, value: string, a: any[]) => void;
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
    const intervalBins = useMemo(() => getIntervalBins(filter), [filter]);

    const steps = useMemo(() => (intervalBins ? intervalBins.map(x => x.x0) : null), [
      intervalBins
    ]);

    const updateAnimation = useCallback(
      value => {
        switch (filter.animationWindow) {
          case ANIMATION_WINDOW.interval:
            const idx = value[1];
            setFilterAnimationTime(filterIdx, 'value', [
              intervalBins[idx].x0,
              intervalBins[idx].x1 - 1
            ]);
            break;
          default:
            setFilterAnimationTime(filterIdx, 'value', value);
            break;
        }
      },
      [filterIdx, intervalBins, filter.animationWindow, setFilterAnimationTime]
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
