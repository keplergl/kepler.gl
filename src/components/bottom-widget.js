import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TimeWidget from './filters/time-widget';

const propsTypes = {
  filters: PropTypes.array,
  datasets: PropTypes.object,
  uiState: PropTypes.object,
  visStateActions: PropTypes.object,
  sidePanelWidth: PropTypes.number,
  containerW: PropTypes.number
};

const MaxWidth = 1080;

export const TimeWidgetFactory = () => TimeWidget;
bottomWidgetFactory.deps = [TimeWidgetFactory];

export function bottomWidgetFactory(BottomTimeWidget) {

  class BottomWidget extends Component {
    render() {
      const {
        datasets,
        filters,
        visStateActions,
        containerW,
        uiState,
        sidePanelWidth
      } = this.props;
      const {activeSidePanel} = uiState;
      const isOpen = Boolean(activeSidePanel);

      const enlargedFilterIdx = filters.findIndex(f => f.enlarged);
      const isAnyFilterAnimating = filters.some(f => f.isAnimating);
      const enlargedFilterWidth = isOpen ? containerW - sidePanelWidth : containerW;

      if (enlargedFilterIdx < 0) {
        return null;
      }

      return (
        <BottomTimeWidget
          fields={datasets[filters[enlargedFilterIdx].dataId].fields}
          setFilterPlot={visStateActions.setFilterPlot}
          setFilter={visStateActions.setFilter}
          toggleAnimation={visStateActions.toggleAnimation}
          updateAnimationSpeed={visStateActions.updateAnimationSpeed}
          enlargeFilter={visStateActions.enlargeFilter}
          width={Math.min(MaxWidth, enlargedFilterWidth)}
          isAnyFilterAnimating={isAnyFilterAnimating}
          enlargedIdx={enlargedFilterIdx}
          filter={filters[enlargedFilterIdx]}
        />
      );
    }
  }

  BottomWidget.propsTypes = propsTypes;

  return BottomWidget;
}