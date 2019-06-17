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

import React, {PureComponent} from 'react';
import styled from 'styled-components';
import {createSelector} from 'reselect';

import {numFormat} from 'utils/data-utils';
import {CLOUDFRONT} from 'constants/default-settings';

import {
  PanelLabel,
  SidePanelSection,
  StyledPanelHeader,
  PanelSectionTitle,
  Button
} from 'components/common/styled-components';
import FieldSelector from 'components/common/field-selector';
import ProgressBar from 'components/common/progress-bar';
import ItemSelector from 'components/common/item-selector/item-selector';
import {
  DatasetTag,
  DataRowCount
} from 'components/side-panel/source-data-catalog';

const DatasetItem = ({value}) => (
  <div>
    <DatasetTag dataset={value} />
    <DataRowCount className="source-data-rows">{`${numFormat(
      value.allData.length
    )} rows`}</DataRowCount>
  </div>
);

const StyledJoinTablePanel = styled.div`
  height: 360px;
  background-color: ${props => props.theme.sidePanelBg};
  box-shadow: ${props => props.theme.panelBoxShadow};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledJoinTablePanelInner = styled.div`
  display: flex;
  padding: 32px 24px;
  flex-direction: column;
  flex-grow: 1;
`;

const StyledJoinTablePanelContent = styled.div`
  display: flex;
  margin-left: -16px;
  flex-grow: 1;
`;

const StyledJoinTablePanelBottom = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledJoinSymbol = styled.div`
  background-image: url(${CLOUDFRONT}/join-left.png);
  background-size: 48px 30px;
  height: ${props => props.theme.panelHeaderHeight}px;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  position: absolute;
`;

const StyledDatasetDiv = styled.div`
  margin-left: 16px;
  flex-grow: 0;
`;

const StyledDatasetSelector = styled(StyledPanelHeader)`
  width: 240px;
  padding: 0;

  .item-selector {
    flex-grow: 1;

    .item-selector__dropdown {
      height: ${props => props.theme.panelHeaderHeight}px;
      padding: 4px 10px 4px 16px;

      .item-selector__dropdown__value {
        .source-data-rows {
          padding-left: 0;
        }
      }

      .dataset-color {
        display: none;
      }

      :active,
      :focus,
      &.focus,
      &.active {
        border-color: ${props => props.theme.inputBgdActive};
      }
    }
  }
`;

const StyledSymbolDiv = styled.div`
  /* flex-grow: 0; */
  position: relative;
  margin-left: 16px;
  flex-grow: 0;
`;

const StyledTitle = styled(PanelSectionTitle)`
  margin-bottom: 12px;
`;

const StyledLine = styled.div`
  position: absolute;
  border-bottom: 1px solid ${props => props.theme.textColor};
  height: 24px;
  width: calc(100% + 32px);
  top: 24px;
  left: -16px;
`;

const ConfirmButton = ({onClick, disabled}) => (
  <Button onClick={onClick} width="105px" disabled={disabled}>
    Join
  </Button>
);

const CancelButton = ({onClick}) => (
  <Button  link width="105px" onClick={onClick}>
    Cancel
  </Button>
)
const DatasetSelector = ({datasets, selected = {}, options, onSelect}) => (
  <div style={{width: '100%'}}>
    <ItemSelector
      selectedItems={selected.id ? datasets[selected.id] : null}
      options={options}
      getOptionValue={'value'}
      filterOption={'label'}
      multiSelect={false}
      onChange={onSelect}
      placeholder={'Select a Dataset'}
      displayOption={'label'}
      DropDownLineItemRenderComponent={DatasetItem}
    />
  </div>
);

function JoinTablePanelFactory() {
  class JoinTablePanel extends PureComponent {
    /* selectors */
    /* eslint-disable no-invalid-this */
    datasetsSelector = props => props.datasets;
    dsOptionsSelector = createSelector(
      this.datasetsSelector,
      datasets =>
        Object.values(datasets).map(ds => ({
          label: ds.label,
          value: ds.id,
          color: ds.color,
          allData: {
            length: ds.allData.length
          }
        }))
    );
    onSelectSourceDataset = val => {
      this.props.setJoinDataset('source', 'id', val);
    };
    onSelectTargetDataset = val => {
      this.props.setJoinDataset('target', 'id', val);
    };
    onSelectSourceField = val => {
      this.props.setJoinDataset('source', 'field', val);
    };
    onSelectTargetField = val => {
      this.props.setJoinDataset('target', 'field', val);
    };
    onSelectIndexByField = val => {
      this.props.setJoinDataset('target', 'indexBy', val);
    };
    onStartJoinDataset = () => {
      this.props.startJoinDataset(this.props.joinData);
    }
    render() {
      const {joinData, datasets} = this.props;
      const dsOptions = this.dsOptionsSelector(this.props);
      const {source, target, ready} = joinData;

      return (
        <StyledJoinTablePanel>
          {/*<ProgressBar />*/}
          <StyledJoinTablePanelInner>
            <StyledJoinTablePanelContent>
              <StyledDatasetDiv>
                <SidePanelSection>
                  <StyledTitle>Source Dataset</StyledTitle>
                  <StyledDatasetSelector
                    labelRBGColorValues={source.id && datasets[source.id].color}
                  >
                    <DatasetSelector
                      options={dsOptions}
                      datasets={datasets}
                      selected={source}
                      onSelect={this.onSelectSourceDataset}
                    />
                  </StyledDatasetSelector>
                </SidePanelSection>
                {source.id && (
                  <SidePanelSection>
                    <PanelLabel>Select Field to Join</PanelLabel>
                    <FieldSelector
                      fields={datasets[source.id].fields}
                      value={source.field && source.field.name}
                      onSelect={this.onSelectSourceField}
                    />
                  </SidePanelSection>
                )}
              </StyledDatasetDiv>
              <StyledSymbolDiv>
                <StyledTitle>Join Type</StyledTitle>
                <StyledLine />
                <StyledJoinSymbol />
              </StyledSymbolDiv>
              <StyledDatasetDiv>
                <SidePanelSection>
                  <StyledTitle>Dataset to Join</StyledTitle>
                  <StyledDatasetSelector
                    labelRBGColorValues={target.id && datasets[target.id].color}
                  >
                    <DatasetSelector
                      options={dsOptions}
                      datasets={datasets}
                      selected={target}
                      onSelect={this.onSelectTargetDataset}
                    />
                  </StyledDatasetSelector>
                </SidePanelSection>
                {target.id && (
                  <SidePanelSection>
                    <PanelLabel>Select Field to Join</PanelLabel>
                    <FieldSelector
                      fields={datasets[target.id].fields}
                      value={target.field && target.field.name}
                      onSelect={this.onSelectTargetField}
                    />
                  </SidePanelSection>
                )}
                {target.id && (
                  <SidePanelSection>
                    <PanelLabel>Animate By</PanelLabel>
                    <FieldSelector
                      fields={datasets[target.id].fields}
                      value={target.indexBy && target.indexBy.name}
                      onSelect={this.onSelectIndexByField}
                    />
                  </SidePanelSection>
                )}
              </StyledDatasetDiv>
            </StyledJoinTablePanelContent>
            <StyledJoinTablePanelBottom>
              <CancelButton onClick={this.props.onClose}/>
              <ConfirmButton disabled={!ready} onClick={this.onStartJoinDataset}/>
            </StyledJoinTablePanelBottom>
          </StyledJoinTablePanelInner>
        </StyledJoinTablePanel>
      );
    }
  }

  return JoinTablePanel;
}

export default JoinTablePanelFactory;
