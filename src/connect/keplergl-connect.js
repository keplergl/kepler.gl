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

import {connect as reduxConnect} from 'react-redux';
import withLocalSelector from './with-local-selector';

const defaultMapStateToProps = (state, _, __) => state;
const defaultMapDispatchToProps = () => (dispatch, _, __) => ({dispatch});

export const connect = (
  mapStateToProps = defaultMapStateToProps,
  makeMapDispatchToProps = defaultMapDispatchToProps,
  reduxMergeProps,
  options
) => BaseComponent => {
  const mapDispatchToProps = makeMapDispatchToProps();
  const reduxMapState = (state, props) => mapStateToProps(props.selector(state), props, state);

  const reduxMapDispatch = (dispatch, props) => mapDispatchToProps(props.dispatch, props, dispatch);

  const ReduxComponent = reduxConnect(
    reduxMapState,
    reduxMapDispatch,
    reduxMergeProps,
    options
  )(BaseComponent);

  // save selector to context so it can be accessed by its children
  return withLocalSelector(ReduxComponent);
};
