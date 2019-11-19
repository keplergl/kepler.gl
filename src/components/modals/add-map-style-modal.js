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
import {polyfill} from 'react-lifecycles-compat';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styled from 'styled-components';
import MapboxGLMap from 'react-map-gl';
import {
  StyledModalContent,
  InputLight,
  StyledMapContainer
} from 'components/common/styled-components';
import {media} from 'styles/media-breakpoints';

// Utils
import {transformRequest} from 'utils/map-style-utils/mapbox-utils';

const MapH = 190;
const MapW = 264;
const ErrorMsg = {
  styleError:
    'Failed to load map style, make sure it is published. For private style, paste in your access token.'
};

const InstructionPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: 12px;

  .modal-section:first-child {
    margin-top: 24px;
    ${media.palm`
      margin-top: 0;
    `};
  }

  input {
    margin-right: 8px;
  }
`;

const StyledModalSection = styled.div`
  margin-bottom: 32px;

  .modal-section-title {
    font-weight: 500;
  }
  .modal-section-subtitle {
    color: ${props => props.theme.subtextColorLT};
  }

  input {
    margin-top: 8px;
  }

  ${media.portable`
    margin-bottom: 24px;
  `};
  ${media.palm`
    margin-bottom: 16px;
  `};
`;

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

function AddMapStyleModalFactory() {
  class AddMapStyleModal extends Component {
    static propTypes = {
      inputMapStyle: PropTypes.func.isRequired,
      inputStyle: PropTypes.object.isRequired,
      loadCustomMapStyle: PropTypes.func.isRequired,
      mapboxApiAccessToken: PropTypes.string.isRequired,
      mapboxApiUrl: PropTypes.string.isRequired,
      mapState: PropTypes.object.isRequired
    };

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

    componentDidUpdate() {
      const map = this.mapRef && this.mapRef.getMap();
      if (map && this._map !== map) {
        this._map = map;

        map.on('style.load', () => {
          const style = map.getStyle();
          this.loadMapStyleJson(style);
        });

        map.on('error', () => {
          this.loadMaoStyleError();
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
      const {inputStyle, mapState, mapboxApiUrl} = this.props;

      const mapboxApiAccessToken =
        inputStyle.accessToken || this.props.mapboxApiAccessToken;
      const mapProps = {
        ...mapState,
        mapboxApiUrl,
        mapboxApiAccessToken,
        preserveDrawingBuffer: true,
        transformRequest
      };

      return (
        <div className="add-map-style-modal">
          <StyledModalContent>
            <InstructionPanel>
              <StyledModalSection className="modal-section">
                <div className="modal-section-title">
                  1. Publish your style at mapbox or provide access token
                </div>
                <div className="modal-section-subtitle">
                  You can create your own map style at
                  <InlineLink
                    target="_blank"
                    href="https://www.mapbox.com/studio/styles/"
                  >
                    {' '}
                    mapbox
                  </InlineLink>{' '}
                  and
                  <InlineLink
                    target="_blank"
                    href="https://www.mapbox.com/help/studio-manual-publish/"
                  >
                    {' '}
                    publish
                  </InlineLink>{' '}
                  it.
                </div>
                <div className="modal-section-subtitle">
                  To use private style, paste your
                  <InlineLink
                    target="_blank"
                    href="https://www.mapbox.com/help/how-access-tokens-work/"
                  >
                    {' '}
                    access token
                  </InlineLink>{' '}
                  here. *kepler.gl is a client-side application, data stays in
                  your browser..
                </div>
                <InputLight
                  type="text"
                  value={inputStyle.accessToken || ''}
                  onChange={({target: {value}}) =>
                    this.props.inputMapStyle({accessToken: value})
                  }
                  placeholder="e.g. pk.abcdefg.xxxxxx"
                />
              </StyledModalSection>
              <StyledModalSection className="modal-section">
                <div className="modal-section-title">2. Paste style url</div>
                <div className="modal-section-subtitle">
                  What is a
                  <InlineLink
                    target="_blank"
                    href="https://www.mapbox.com/help/studio-manual-publish/#style-url"
                  >
                    {' '}
                    style URL
                  </InlineLink>
                </div>
                <InputLight
                  type="text"
                  value={inputStyle.url || ''}
                  onChange={({target: {value}}) =>
                    this.props.inputMapStyle({url: value})
                  }
                  placeholder="e.g. mapbox://styles/uberdataviz/abcdefghijklmnopq"
                />
              </StyledModalSection>
              <StyledModalSection className="modal-section">
                <div className="modal-section-title">3. Name your style</div>
                <InputLight
                  type="text"
                  value={inputStyle.label || ''}
                  onChange={({target: {value}}) =>
                    this.props.inputMapStyle({label: value})
                  }
                />
              </StyledModalSection>
            </InstructionPanel>
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
                    <MapboxGLMap
                      {...mapProps}
                      ref={el => {
                        this.mapRef = el;
                      }}
                      key={this.state.reRenderKey}
                      width={MapW}
                      height={MapH}
                      mapStyle={inputStyle.url}
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

  return polyfill(AddMapStyleModal);
}

export default AddMapStyleModalFactory;
