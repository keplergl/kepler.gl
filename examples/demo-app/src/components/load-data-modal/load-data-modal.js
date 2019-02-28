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
import classnames from 'classnames';
import styled, {ThemeProvider} from 'styled-components';
import PropTypes from 'prop-types';
import {FileUpload, LoadingSpinner, Icons} from 'kepler.gl/components';
import {themeLT} from 'kepler.gl/styles';

import {LOADING_METHODS, ASSETS_URL, LOADING_METHODS_NAMES} from '../../constants/default-settings';

import SampleMapGallery from './sample-data-viewer';
import LoadRemoteMap from './load-remote-map';

const propTypes = {
  // query options
  loadingMethod: PropTypes.object.isRequired,
  currentOption: PropTypes.object.isRequired,
  sampleMaps: PropTypes.arrayOf(PropTypes.object).isRequired,

  // call backs
  onFileUpload: PropTypes.func.isRequired,
  onLoadRemoteMap: PropTypes.func.isRequired,
  onLoadSample: PropTypes.func.isRequired,
  onSwitchToLoadingMethod: PropTypes.func.isRequired
};

const ModalTab = styled.div`
  align-items: flex-end;
  display: flex;
  border-bottom: 1px solid #d8d8d8;
  margin-bottom: 32px;
  justify-content: space-between;

  .load-data-modal__tab__inner {
    display: flex;
  }
  .load-data-modal__tab__item {
    border-bottom: 3px solid transparent;
    cursor: pointer;
    margin-left: 32px;
    padding: 16px 0;
    font-size: 14px;
    font-weight: 400;
    color: ${props => props.theme.subtextColorLT};

    :first-child {
      margin-left: 0;
      padding-left: 0;
    }

    :hover {
      color: ${props => props.theme.textColorLT};
    }
  }

  .load-data-modal__tab__item.active {
    color: ${props => props.theme.textColorLT};
    border-bottom: 3px solid ${props => props.theme.textColorLT};
    font-weight: 500;
  }
`;

const StyledMapIcon = styled.div`
  background-image: url("${ASSETS_URL}icon-demo-map.jpg");
  background-repeat: no-repeat;
  background-size: 64px 48px;
  width: 64px;
  height: 48px;
  border-radius: 2px;
`;

const StyledTrySampleData = styled.div`
  display: flex;
  margin-bottom: 12px;

  .demo-map-title {
    margin-left: 16px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .demo-map-label {
    font-size: 11px;
    color: ${props => props.theme.labelColorLT};
  }

  .demo-map-action {
    display: flex;
    font-size: 14px;
    align-items: center;
    color: ${props => props.theme.titleColorLT};
    cursor: pointer;

    :hover {
      font-weight: 500;
    }

    span {
      white-space: nowrap;
    }
    svg {
      margin-left: 10px;
    }
  }
`;

const StyledSpinner = styled.div`
  text-align: center;
  span {
    margin: 0 auto;
  }
`;

class LoadDataModal extends Component {

  render() {
    const {
      loadingMethod, currentOption, previousMethod,
      sampleMaps, isMapLoading, onSwitchToLoadingMethod,
      error
    } = this.props;

    return (
      <ThemeProvider theme={themeLT}>
        <div className="load-data-modal">
          {isMapLoading ? (
            <StyledSpinner>
              <LoadingSpinner />
            </StyledSpinner>
            ) : (
              <div>
                {loadingMethod.id !== 'sample' ? (
                  <Tabs
                    method={loadingMethod.id}
                    toggleMethod={this.props.onSwitchToLoadingMethod}
                  />
                ) : null}
                {loadingMethod.id === 'upload' ? (
                  <FileUpload onFileUpload={this.props.onFileUpload} />
                ) : null}
                {loadingMethod.id === 'remote' ? (
                  <LoadRemoteMap
                    onLoadRemoteMap={this.props.onLoadRemoteMap}
                    option={this.props.currentOption}
                    error={this.props.error}
                  />
                ) : null}
                {loadingMethod.id === 'sample' ? (
                  <SampleMapGallery
                    sampleData={currentOption}
                    sampleMaps={sampleMaps}
                    back={() => onSwitchToLoadingMethod(previousMethod.id)}
                    onLoadSample={this.props.onLoadSample}
                    error={error} />
                ) : null}
              </div>)
          }
        </div>
      </ThemeProvider>
    );
  }
}

const Tabs = ({method, toggleMethod}) => (
  <ModalTab className="load-data-modal__tab">
    <div className="load-data-modal__tab__inner">
      {LOADING_METHODS.map(
        ({id, label}) =>
          id !== 'sample' ? (
            <div
              className={classnames('load-data-modal__tab__item', {
                active: method && id === method
              })}
              key={id}
              onClick={() => toggleMethod(id)}
            >
              <div>{label}</div>
            </div>
          ) : null
      )}
    </div>
    <TrySampleData onClick={() => toggleMethod(LOADING_METHODS_NAMES.sample)} />
  </ModalTab>
);

const TrySampleData = ({onClick}) => (
  <StyledTrySampleData className="try-sample-data">
    <StyledMapIcon className="demo-map-icon" />
    <div className="demo-map-title">
      <div className="demo-map-label">No data ?</div>
      <div className="demo-map-action" onClick={onClick}>
        <span>Try sample data</span>
        <Icons.ArrowRight height="16px" />
      </div>
    </div>
  </StyledTrySampleData>
);

LoadDataModal.propTypes = propTypes;

export default LoadDataModal;
