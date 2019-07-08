// Copyright (c) 2019 Uber Technologies, Inc.
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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {Button} from 'components/common/styled-components';
import {DEFAULT_LAYER_GROUPS} from 'constants/default-settings';
import OverviewPanelFactory from './overview-panel/overview-panel';

OverviewManagerFactory.deps = [OverviewPanelFactory];
// MapManagerFactory.deps = [
//   MapStyleSelectorFactory,
//   LayerGroupSelectorFactory
// ];

function OverviewManagerFactory(OverviewPanel) {
  return class OverviewManager extends Component {

    render() {
      return (
        <div className="overview-panel">
          <OverviewPanel
            scores={this.props.scores}
            selectedIndicator={this.props.selectedIndicator}
            onConfigChange={this.props.onConfigChange}
            filters={this.props.filters}
            datasets={this.props.datasets}            
            setFilter={this.props.setFilter}
            paginationFunc={this.props.paginationFunc}
            reverseFunc={this.props.reverseFunc}
            rankingReverse={this.props.rankingReverse}
            rankingPage={this.props.rankingPage}
            legends={this.props.legends}
            changeBarangay={this.props.changeBarangay}
          />
        </div>
      );
    }
  };
}

export default OverviewManagerFactory;
