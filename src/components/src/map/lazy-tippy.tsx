// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck
import React, {useState, forwardRef} from 'react';
import Tippy from '@tippyjs/react/headless';
import {isTest} from '@kepler.gl/utils';

const isTestEnv = isTest();

/**
 * Lazy mounting tippy content
 * https://gist.github.com/atomiks/520f4b0c7b537202a23a3059d4eec908
 */
// eslint-disable-next-line react/display-name
const LazyTippy = forwardRef((props, ref) => {
  const [mounted, setMounted] = useState(isTestEnv);

  const lazyPlugin = {
    fn: () => ({
      onMount: () => setMounted(true),
      onHidden: () => setMounted(false)
    })
  };

  const computedProps = {...props};

  computedProps.plugins = [lazyPlugin, ...(props.plugins || [])];

  if (props.render) {
    computedProps.render = (...args) => (mounted ? props.render(...args) : '');
  } else {
    computedProps.content = mounted ? props.content : '';
  }

  return <Tippy {...computedProps} ref={ref} />;
});

export default LazyTippy;
