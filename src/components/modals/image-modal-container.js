// Copyright (c) 2020 Uber Technologies, Inc.
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
import get from 'lodash.get';

import {MAP_THUMBNAIL_DIMENSION, EXPORT_IMG_RATIOS} from 'constants/default-settings';

/**
 * A wrapper component in modals contain a image preview of the map with cloud providers
 * It sets export image size based on provider thumbnail size
 * @component
 */
export default class ImageModalContainer extends Component {
  static propTypes = {
    onUpdateImageSetting: PropTypes.func.isRequired,
    cloudProviders: PropTypes.arrayOf(PropTypes.object),
    currentProvider: PropTypes.string
  };

  static defaultProps = {
    cloudProviders: [],
    currentProvider: null
  };

  componentDidMount() {
    this._updateThumbSize(true);
  }

  componentDidUpdate(prevProps) {
    // set thumbnail size if provider changes
    if (this.props.currentProvider !== prevProps.currentProvider && this.props.currentProvider) {
      this._updateThumbSize();
    }
  }

  _updateThumbSize(initialMount) {
    if (this.props.currentProvider && this.props.cloudProviders.length) {
      const provider = this.props.cloudProviders.find(p => p.name === this.props.currentProvider);

      if (provider && provider.thumbnail) {
        this.props.onUpdateImageSetting({
          mapW: get(provider, ['thumbnail', 'width']) || MAP_THUMBNAIL_DIMENSION.width,
          mapH: get(provider, ['thumbnail', 'height']) || MAP_THUMBNAIL_DIMENSION.height,
          ratio: EXPORT_IMG_RATIOS.CUSTOM,
          legend: false
        });
      }
    } else if (initialMount) {
      this.props.onUpdateImageSetting({
        mapW: MAP_THUMBNAIL_DIMENSION.width,
        mapH: MAP_THUMBNAIL_DIMENSION.height,
        ratio: EXPORT_IMG_RATIOS.CUSTOM
      });
    }
  }

  render() {
    return <>{this.props.children}</>;
  }
}
