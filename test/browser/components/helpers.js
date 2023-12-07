// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {useEffect, useRef} from 'react';

// Hook to check which prop change causing component rerender
export function useTraceUpdate(props) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      // eslint-disable-next-line no-console
      console.log('Changed props:', changedProps);
    }
    prev.current = props;
  });
}

export function useTraceUpdateClass(props, prev) {
  const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
    if (prev[k] !== v) {
      ps[k] = [prev[k], v];
    }
    return ps;
  }, {});
  if (Object.keys(changedProps).length > 0) {
    // eslint-disable-next-line no-console
    console.log('Changed props:', changedProps);
  }
}
