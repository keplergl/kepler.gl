// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import {polyfill} from 'react-lifecycles-compat';
import classnames from 'classnames';
import styled from 'styled-components';
import {Map, MapboxMap, MapRef} from 'react-map-gl';
import {
  StyledModalContent,
  InputLight,
  StyledMapContainer,
  StyledModalVerticalPanel,
  StyledModalSection
} from '../common/styled-components';
import {media} from '@kepler.gl/styles';

// Utils
import {getApplicationConfig, transformRequest} from '@kepler.gl/utils';
import {injectIntl, IntlShape} from 'react-intl';
import {FormattedMessage} from '@kepler.gl/localization';
import {NO_BASEMAP_ICON} from '@kepler.gl/constants';
import {InputStyle, MapState} from '@kepler.gl/types';
import {ActionHandler, inputMapStyle, loadCustomMapStyle} from '@kepler.gl/actions';

const MapH = 190;
const MapW = 264;
const ErrorMsg = {
  styleError:
    'Failed to load map style, make sure it is published. For private style, paste in your access token.'
};

const PreviewMap = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 116px;
  flex-shrink: 0;

  .preview-title {
    font-weight: 500;
    font-size: 10px;
    padding: 8px 0px;
  }

  .preview-title.error {
    color: ${props => props.theme.errorColor};
  }

  ${media.portable`
    margin-left: 32px;
  `};

  ${media.palm`
    margin-left: unset;
    .preview-title {
      margin-top: 0px;
    }
  `};
`;

const StyledPreviewImage = styled.div`
  background: ${props => props.theme.modalImagePlaceHolder};
  border-radius: 4px;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.18);
  width: ${MapW}px;
  height: ${MapH}px;
  position: relative;

  .preview-image-placeholder {
    position: absolute;
    top: 0;
    left: 0;
  }

  .preview-image-spinner {
    position: absolute;
    left: calc(50% - 25px);
    top: calc(50% - 25px);
  }
`;

const InlineLink = styled.a`
  font-weight: 500;

  :hover {
    cursor: pointer;
  }
`;

interface AddMapStyleModalProps {
  inputMapStyle: ActionHandler<typeof inputMapStyle>;
  inputStyle: InputStyle;
  loadCustomMapStyle: ActionHandler<typeof loadCustomMapStyle>;
  mapboxApiAccessToken: string;
  mapboxApiUrl?: string;
  mapState: MapState;
  intl: IntlShape;
}

function AddMapStyleModalFactory() {
  class AddMapStyleModal extends Component<AddMapStyleModalProps> {
    state = {
      reRenderKey: 0,
      previousToken: null
    };

    static getDerivedStateFromProps(props, state) {
      if (
        props.inputStyle &&
        props.inputStyle.accessToken &&
        props.inputStyle.accessToken !== state.previousToken
      ) {
        // toke has changed
        // ReactMapGl doesn't re-create map when token has changed
        // here we force the map to update

        return {
          reRenderKey: state.reRenderKey + 1,
          previousToken: props.inputStyle.accessToken
        };
      }

      return null;
    }

    mapRef: MapRef | null | undefined;
    _map: MapboxMap | undefined;

    componentDidUpdate() {
      const map = this.mapRef && this.mapRef.getMap();
      if (map && this._map !== map) {
        this._map = map;

        map.on('style.load', () => {
          const style = map.getStyle();
          this.loadMapStyleJson(style);
        });

        map.on('error', () => {
          this.loadMapStyleError();
        });
      }
    }

    loadMapStyleJson = style => {
      this.props.loadCustomMapStyle({style, error: false});
    };

    loadMapStyleError = () => {
      this.props.loadCustomMapStyle({error: true});
    };

    render() {
      const {inputStyle, mapState, mapboxApiUrl, intl} = this.props;

      const mapboxApiAccessToken = inputStyle.accessToken || this.props.mapboxApiAccessToken;
      const mapProps = {
        ...mapState,
        baseApiUrl: mapboxApiUrl,
        mapboxAccessToken: mapboxApiAccessToken,
        mapLib: getApplicationConfig().getMapLib(),
        preserveDrawingBuffer: true,
        transformRequest
      };

      return (
        <div className="add-map-style-modal">
          <StyledModalContent>
            <StyledModalVerticalPanel>
              <StyledModalSection>
                <div className="modal-section-title">
                  <FormattedMessage id={'modal.addStyle.pasteTitle'} />
                </div>
                <div className="modal-section-subtitle">
                  {intl.formatMessage({id: 'modal.addStyle.pasteSubtitle0'})}
                  <InlineLink
                    target="_blank"
                    href="https://www.mapbox.com/help/studio-manual-publish/#style-url"
                  >
                    {' '}
                    {intl.formatMessage({id: 'modal.addStyle.pasteSubtitle2'})}
                  </InlineLink>{' '}
                  {intl.formatMessage({id: 'modal.addStyle.pasteSubtitle3'})}
                  <InlineLink
                    target="_blank"
                    href="https://docs.mapbox.com/mapbox-gl-js/style-spec"
                  >
                    {' '}
                    {intl.formatMessage({id: 'modal.addStyle.pasteSubtitle4'})}
                  </InlineLink>
                </div>
                <InputLight
                  type="text"
                  value={inputStyle.url || ''}
                  onChange={({target: {value}}) =>
                    this.props.inputMapStyle({
                      url: value,
                      id: 'Custom Style',
                      icon: NO_BASEMAP_ICON
                    })
                  }
                  placeholder="e.g. https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                />
              </StyledModalSection>

              {/* <StyledModalSection>
                <div className="modal-section-title">
                  <FormattedMessage id={'modal.addStyle.publishTitle'} />
                </div>
                <div className="modal-section-subtitle">
                  {intl.formatMessage({id: 'modal.addStyle.publishSubtitle1'})}
                  <InlineLink target="_blank" href="https://www.mapbox.com/studio/styles/">
                    {' '}
                    mapbox
                  </InlineLink>{' '}
                  {intl.formatMessage({id: 'modal.addStyle.publishSubtitle2'})}
                  <InlineLink
                    target="_blank"
                    href="https://www.mapbox.com/help/studio-manual-publish/"
                  >
                    {' '}
                    {intl.formatMessage({id: 'modal.addStyle.publishSubtitle3'})}
                  </InlineLink>{' '}
                  {intl.formatMessage({id: 'modal.addStyle.publishSubtitle4'})}
                </div>

                <div className="modal-section-subtitle">
                  {intl.formatMessage({id: 'modal.addStyle.publishSubtitle5'})}
                  <InlineLink
                    target="_blank"
                    href="https://www.mapbox.com/help/how-access-tokens-work/"
                  >
                    {' '}
                    {intl.formatMessage({id: 'modal.addStyle.publishSubtitle6'})}
                  </InlineLink>{' '}
                  {intl.formatMessage({id: 'modal.addStyle.publishSubtitle7'})}
                </div>
                <InputLight
                  type="text"
                  value={inputStyle.accessToken || ''}
                  onChange={({target: {value}}) => this.props.inputMapStyle({accessToken: value})}
                  placeholder={intl.formatMessage({id: 'modal.addStyle.exampleToken'})}
                />
              </StyledModalSection> */}

              <StyledModalSection>
                <div className="modal-section-title">
                  <FormattedMessage id={'modal.addStyle.namingTitle'} />
                </div>
                <InputLight
                  type="text"
                  value={inputStyle.label || ''}
                  onChange={({target: {value}}) => this.props.inputMapStyle({label: value})}
                />
              </StyledModalSection>
            </StyledModalVerticalPanel>
            <PreviewMap>
              <div
                className={classnames('preview-title', {
                  error: inputStyle.error
                })}
              >
                {inputStyle.error
                  ? ErrorMsg.styleError
                  : (inputStyle.style && inputStyle.style.name) || ''}
              </div>
              <StyledPreviewImage className="preview-image">
                {!inputStyle.isValid ? (
                  <div className="preview-image-spinner" />
                ) : (
                  <StyledMapContainer>
                    <Map
                      {...mapProps}
                      ref={el => {
                        this.mapRef = el;
                      }}
                      key={this.state.reRenderKey}
                      style={{
                        width: MapW,
                        height: MapH
                      }}
                      mapStyle={inputStyle.url === null ? undefined : inputStyle.url}
                    />
                  </StyledMapContainer>
                )}
              </StyledPreviewImage>
            </PreviewMap>
          </StyledModalContent>
        </div>
      );
    }
  }

  return injectIntl(polyfill(AddMapStyleModal));
}

export default AddMapStyleModalFactory;
