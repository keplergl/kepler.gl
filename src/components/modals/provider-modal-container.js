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
import PropTypes from 'prop-types';

/**
 * A wrapper component in modals contain cloud providers.
 * It set default provider by checking which provider has logged in
 * @component
 */
export default class ProviderModalContainer extends Component {
  static propTypes = {
    onSetCloudProvider: PropTypes.func.isRequired,
    cloudProviders: PropTypes.arrayOf(PropTypes.object),
    currentProvider: PropTypes.string
  };

  static defaultProps = {
    cloudProviders: [],
    currentProvider: null
  };

  componentDidMount() {
    this._setDefaultProvider();
  }

  _setDefaultProvider() {
    if (!this.props.currentProvider && this.props.cloudProviders.length) {
      const connected = this.props.cloudProviders.find(
        p => typeof p.getAccessToken === 'function' && p.getAccessToken()
      );

      if (connected && typeof this.props.onSetCloudProvider === 'function') {
        this.props.onSetCloudProvider(connected.name);
      }
    }
  }

  render() {
    return <>{this.props.children}</>;
  }
}
