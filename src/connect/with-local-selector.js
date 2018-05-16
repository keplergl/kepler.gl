// Copyright (c) 2018 Uber Technologies, Inc.
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

const identity = state => state;

const mergeSelectors = (parentSelector, childSelector) => state =>
  childSelector(parentSelector(state));

const computeSelector = (props, ctx) =>
  mergeSelectors(
    ctx.selector ? ctx.selector : identity,
    props.selector ? props.selector : identity
  );

// store the parent selector in the parent context
// and return the parent component
// when a selector is passed to a container component,
// it will be stored in the context and passed down to child components,
// as well as prop to the given component
const withLocalSelector = ParentComponent => {
  class WithConnectSelector extends Component {
    constructor(props, ctx) {
      super(props, ctx);

      this.selector = computeSelector(props, ctx);
      this.id = props.id;
    }

    getChildContext() {
      return {
        selector: this.selector,
        id: this.id
      };
    }

    componentWillReceiveProps(nextProps, nextContext) {
      this.selector = computeSelector(nextProps, nextContext);
      this.id = nextProps.id;
    }

    render() {
      return <ParentComponent {...this.props} selector={this.selector} />;
    }
  }

  WithConnectSelector.contextTypes = {
    selector: PropTypes.func,
    id: PropTypes.string
  };

  WithConnectSelector.childContextTypes = {
    selector: PropTypes.func,
    id: PropTypes.string
  };

  return WithConnectSelector;
};

export default withLocalSelector;
