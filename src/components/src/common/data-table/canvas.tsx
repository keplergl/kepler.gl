// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import styled from 'styled-components';

/*
    ScrollSync works by getting a callback about the dom elements scroll amount
    and then using that to pass into how much to scroll all child components,
    it works great!

    Except... Because scrolling is managed by a separate thread, and JavaScript
    is only periodically notified of the updated position, there's some latency
    issues with this.

    We can hack around this by using a niche property of canvas that removes the
    delay in scroll event firing! Easiest way to reproduce: enable "Trace React updates"
    in React DevTools (it works by overlaying a viewport-wide canvas over the document).
  */
export default styled.canvas`
  height: 100%;
  left: 0;
  pointer-events: none;
  position: absolute;
  top: 0;
  width: 100%;
`;
