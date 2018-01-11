import React, {Component} from 'react';
import TimeWidget from './filters/time-widget';

export default class BottomWidget extends Component {
  render() {
    const {datasets, filters, visStateActions, containerW, uiState, sidePanelWidth, sideNavWidth} = this.props;
    const {activeSidePanel} = uiState;
    const isOpen = Boolean(activeSidePanel);

    const enlargedFilterIdx = filters.findIndex(f => f.enlarged);
    const isAnyFilterAnimating = filters.some(f => f.isAnimating);
    const enlargedFilterWidth = isOpen ? containerW - sidePanelWidth - sideNavWidth :
      containerW - sideNavWidth;

    if (enlargedFilterIdx < 0) {
      return null;
    }

    return (
      <TimeWidget
        fields={datasets[filters[enlargedFilterIdx].dataId].fields}
        setFilterPlot={visStateActions.setFilterPlot}
        setFilter={visStateActions.setFilter}
        toggleAnimation={visStateActions.toggleAnimation}
        enlargeFilter={visStateActions.enlargeFilter}
        width={enlargedFilterWidth}
        isAnyFilterAnimating={isAnyFilterAnimating}
        enlargedIdx={enlargedFilterIdx}
        filter={filters[enlargedFilterIdx]}
      />
    );
  }
}
