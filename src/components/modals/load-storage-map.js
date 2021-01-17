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

import React, {Component} from 'react';
import styled from 'styled-components';
import moment from 'moment';

import LoadingDialog from './loading-dialog';
import {Button} from 'components/common/styled-components';
import CloudTile from './cloud-tile';
import {Base, ArrowLeft} from 'components/common/icons';
import ProviderModalContainer from './provider-modal-container';
import {FormattedMessage} from 'localization';

const StyledProviderSection = styled.div.attrs({
  className: 'provider-selection'
})`
  display: flex;
`;

const StyledSpinner = styled.div`
  text-align: center;
  span {
    margin: 0 auto;
  }
`;

const StyledVisualizationSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const StyledStorageHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 12px;
  line-height: 14px;
`;

const StyledBackBtn = styled.a`
  margin-bottom: 16px;
  color: #3a414c;
  cursor: pointer;

  &:hover {
    font-weight: 500;
  }
`;

const StyledProviderVisSection = styled.div`
  flex: 1 1 auto;
  background-color: #f8f8f9;
  padding: 20px 24px;
  min-height: 280px;

  .title {
    font-size: 14px;
    line-height: 16px;
    font-weight: 500;
    margin-bottom: 16px;

    span {
      text-transform: capitalize;
    }
  }
`;

const StyledSeparator = styled.hr`
  border: solid #bfbfbf;
  border-width: 0 0 1px 0;
  margin-bottom: 16px;
`;

const StyledVisualizationList = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: stretch;
  justify-content: space-between;
`;

const StyledVisualizationItem = styled.div`
  flex: 0 0 auto;
  width: 208px;
  display: flex;
  flex-direction: column;
  padding: 16px 8px;
  color: #3a414c;
  cursor: pointer;
  font-size: 12px;
  line-height: 18px;

  &:hover {
    .vis_item-icon,
    .vis_item-thumb,
    .vis_item-description,
    .vis_item-modification-date {
      opacity: 1;
    }
  }

  .vis_item-icon,
  .vis_item-thumb,
  .vis_item-description,
  .vis_item-modification-date {
    opacity: 0.9;
    transition: opacity 0.4s ease;
  }

  .vis_item-icon {
    position: relative;
    flex: 0 0 108px;
    background-color: #6a7484;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .vis_item-thumb {
    position: relative;
    flex: 0 0 108px;
    background-size: cover;
    background-position: center;
    border-radius: 4px;
  }

  .vis_item-privacy {
    position: absolute;
    top: 0;
    left: 0;
    padding: 3px 6px;
    border-radius: 4px 0;
    background-color: rgba(58, 65, 76, 0.7);
    color: #fff;
    font-size: 11px;
    line-height: 18px;
  }

  .vis_item-title {
    margin-top: 16px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .vis_item-description {
    flex: 1 1 auto;
    margin-top: 8px;
  }

  .vis_item-modification-date {
    margin-top: 16px;
    flex: 1 0 auto;
    color: #6a7484;
    line-height: 15px;
  }
`;

const MapIcon = props => {
  return (
    <div {...props}>
      {props.children}
      <Base height="32px" viewBox={'0 0 16 16'}>
        <path
          fill="#d3d8d6"
          d="m13.6 11.572-3.2 2.1336v-9.2776l3.2-2.1336zm-12-7.144 3.2-2.1336v9.2776l-3.2 2.1336zm13.244 8.2376c0.2224-0.148 0.356-0.3984 0.356-0.6656v-11.2c0-0.2952-0.1624-0.5664-0.4224-0.7048-0.26-0.14-0.576-0.1248-0.8216 0.0392l-4.3128 2.876-3.5432-2.8352c-0.1208-0.0936-0.2952-0.1624-0.472-0.1688-0.1648-0.0064-0.348 0.0464-0.472 0.128l-4.8 3.2c-0.2224 0.1488-0.356 0.3984-0.356 0.6656v11.2c0 0.2952 0.1624 0.5664 0.4224 0.7056 0.1184 0.0632 0.248 0.0944 0.3776 0.0944 0.1552 0 0.3096-0.0448 0.444-0.1344l4.3128-2.876 3.5432 2.8352c0.1448 0.116 0.3216 0.1752 0.5 0.1752 0.1184 0 0.236-0.0248 0.3464-0.0784z"
        />
      </Base>
    </div>
  );
};

const PrivacyBadge = ({privateMap}) => (
  <span className="vis_item-privacy">{privateMap ? 'Private' : 'Public'}</span>
);

const VisualizationItem = ({vis, onClick}) => {
  return (
    <StyledVisualizationItem onClick={onClick}>
      {vis.thumbnail ? (
        <div className="vis_item-thumb" style={{backgroundImage: `url(${vis.thumbnail})`}}>
          {vis.hasOwnProperty('privateMap') ? <PrivacyBadge privateMap={vis.privateMap} /> : null}
        </div>
      ) : (
        <MapIcon className="vis_item-icon">
          {vis.hasOwnProperty('privateMap') ? <PrivacyBadge privateMap={vis.privateMap} /> : null}
        </MapIcon>
      )}
      <span className="vis_item-title">{vis.title}</span>
      {vis.description && vis.description.length && (
        <span className="vis_item-description">{vis.description}</span>
      )}
      <span className="vis_item-modification-date">
        Last modified {moment.utc(vis.lastModification).fromNow()}
      </span>
    </StyledVisualizationItem>
  );
};

export const ProviderSelect = ({
  cloudProviders = [],
  onSelect,
  onSetCloudProvider,
  currentProvider
}) =>
  cloudProviders.length ? (
    <StyledProviderSection>
      {cloudProviders.map(provider => (
        <CloudTile
          key={provider.name}
          onSelect={() => onSelect(provider.name)}
          onSetCloudProvider={onSetCloudProvider}
          cloudProvider={provider}
          isSelected={provider.name === currentProvider}
          isConnected={Boolean(provider.getAccessToken && provider.getAccessToken())}
        />
      ))}
    </StyledProviderSection>
  ) : (
    <p>No storage provider available</p>
  );

function LoadStorageMapFactory() {
  class LoadStorageMap extends Component {
    state = {
      showProviderSelect: true
    };

    componentDidMount() {
      this._getSavedMaps();
    }

    componentDidUpdate(prevProps) {
      if (prevProps.currentProvider !== this.props.currentProvider) {
        this._getSavedMaps();
      }
    }

    _getProvider = () => {
      const {currentProvider, cloudProviders} = this.props;
      return (cloudProviders || []).find(p => p.name === currentProvider);
    };

    _getSavedMaps() {
      const provider = this._getProvider();
      if (provider) {
        this.props.getSavedMaps(provider);
        this.setState({showProviderSelect: false});
      }
    }

    _onLoadCloudMap(provider, vis) {
      this.props.onLoadCloudMap({
        loadParams: vis.loadParams,
        provider
      });
    }

    _clickBack = () => {
      this.setState({showProviderSelect: true});
    };

    _selectProvider = providerName => {
      this.props.onSetCloudProvider(providerName);
      const provider = (this.props.cloudProviders || []).find(p => p.name === providerName);
      this.props.getSavedMaps(provider);
      this.setState({showProviderSelect: false});
    };

    render() {
      const {
        visualizations,
        cloudProviders,
        currentProvider,
        isProviderLoading,
        onSetCloudProvider
      } = this.props;

      const provider = this._getProvider();

      return (
        <ProviderModalContainer
          onSetCloudProvider={onSetCloudProvider}
          cloudProviders={cloudProviders}
          currentProvider={currentProvider}
        >
          {this.state.showProviderSelect ? (
            <ProviderSelect
              onSelect={this._selectProvider}
              cloudProviders={cloudProviders}
              onSetCloudProvider={onSetCloudProvider}
              currentProvider={currentProvider}
            />
          ) : (
            <>
              {isProviderLoading && (
                <StyledSpinner>
                  <LoadingDialog size={64} />
                </StyledSpinner>
              )}
              {!isProviderLoading && visualizations && (
                <StyledVisualizationSection>
                  <StyledStorageHeader>
                    <StyledBackBtn>
                      <Button link onClick={this._clickBack}>
                        <ArrowLeft height="14px" />
                        <FormattedMessage id={'modal.loadStorageMap.back'} />
                      </Button>
                    </StyledBackBtn>
                    {provider.getManagementUrl && (
                      <a
                        key={1}
                        href={provider.getManagementUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{textDecoration: 'underline'}}
                      >
                        <FormattedMessage
                          id={'modal.loadStorageMap.back'}
                          values={{displayName: provider.displayName}}
                        />
                      </a>
                    )}
                  </StyledStorageHeader>
                  <StyledProviderVisSection>
                    <span className="title">
                      <span>{currentProvider}</span>
                      <FormattedMessage id={'modal.loadStorageMap.storageMaps'} />
                    </span>
                    <StyledSeparator />
                    <StyledVisualizationList>
                      {visualizations.length ? (
                        visualizations.map(vis => (
                          <VisualizationItem
                            key={vis.id}
                            onClick={() => this._onLoadCloudMap(provider, vis)}
                            vis={vis}
                          />
                        ))
                      ) : (
                        <div className="visualization-list__message">
                          <FormattedMessage id={'modal.loadStorageMap.noSavedMaps'} />
                        </div>
                      )}
                    </StyledVisualizationList>
                  </StyledProviderVisSection>
                </StyledVisualizationSection>
              )}
            </>
          )}
        </ProviderModalContainer>
      );
    }
  }
  return LoadStorageMap;
}

export default LoadStorageMapFactory;
