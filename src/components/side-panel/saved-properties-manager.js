// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {useCallback, useMemo} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {FormattedMessage} from 'localization';
import PanelHeaderActionFactory from 'components/side-panel/panel-header-action';
import {Button, SidePanelDivider, SidePanelSection} from 'components/common/styled-components';
import {
  PanelLabel,
  PanelContent,
  PanelLabelBold,
  PanelLabelWrapper,
  CenterFlexbox
} from 'components/common/styled-components';
import {Add, Upload} from 'components/common/icons';

const StyledLayerGroupItem = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;

  &:last-child {
    margin-bottom: 0;
  }

  .layer-group__visibility-toggle {
    margin-right: 12px;
  }
`;
const LayerLabel = styled(PanelLabelBold)`
  color: ${props => (props.active ? props.theme.textColor : props.theme.labelColor)};
`;

SavedPropertiesManagerFactory.deps = [PanelHeaderActionFactory];

function SavedPropertiesManagerFactory(SavedPropertiesPanel, PanelHeaderAction) {
  const SavedPropertiesManager = ({
    filters = [],
    datasets,
    layers,
    showDatasetTable,
    addSavedProperty,
    setFilter,
    removeFilter,
    enlargeFilter,
    toggleAnimation,
    toggleFilterFeature
  }) => {
    const isAnyFilterAnimating = filters.some(f => f.isAnimating);
    const hadEmptyFilter = filters.some(f => !f.name);
    const hadDataset = Object.keys({}).length;
    // const onClickAddFilter = useCallback(() => {
    //   const defaultDataset = (Object.keys(datasets).length && Object.keys(datasets)[0]) || null;
    //   addFilter(defaultDataset);
    // }, [datasets, addFilter]);
    const onClickAddSavedProperty = useCallback(() => {
      console.log("Adding savedProperty");
    }, [addSavedProperty]);
    // render last added filter first
    const reversedIndex = useMemo(() => {
      return new Array(filters.length)
        .fill(0)
        .map((d, i) => i)
        .reverse();
    }, [filters.length]);

    const saved_properties = [
      {id: 1, name: 'Somewhere'},
      {id: 7, name: 'Here'},
      {id: 42, name: 'There'}
    ];

    return (
      <div className="saved-properties-manager">
        <SidePanelDivider />
        {saved_properties.map(property => (
            <div id='saved-property-item-{property.id}'>{property.name}</div>
        ))
        }
        <Button
          className="add-saved-property-button"
          inactive={hadEmptyFilter || !hadDataset}
          width="105px"
          onClick={onClickAddSavedProperty}
        >
          <Add height="12px" />
          <FormattedMessage id={'savedProperties.addSavedProperty'} />
        </Button>
      </div>
    );
  };

  SavedPropertiesManager.propTypes = {
    datasets: PropTypes.object,
    layers: PropTypes.arrayOf(PropTypes.any).isRequired,
    addSavedProperty: PropTypes.func.isRequired,
    removeFilter: PropTypes.func.isRequired,
    enlargeFilter: PropTypes.func.isRequired,
    toggleAnimation: PropTypes.func.isRequired,
    toggleFilterFeature: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    filters: PropTypes.arrayOf(PropTypes.any).isRequired,
    showDatasetTable: PropTypes.func,

    // fields can be undefined when dataset is not selected
    fields: PropTypes.arrayOf(PropTypes.any)
  };

  return SavedPropertiesManager;
}

export default SavedPropertiesManagerFactory;
