// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import window from 'global/window';
/* eslint-disable no-use-before-define */
const KeyEvent = Object.assign({}, window.KeyEvent);
/* eslint-enable no-use-before-define */

// event event.keyCode is deprecated, should use event.key in the future
KeyEvent.DOM_VK_UP = KeyEvent.DOM_VK_UP || 38;
KeyEvent.DOM_VK_DOWN = KeyEvent.DOM_VK_DOWN || 40;
KeyEvent.DOM_VK_BACK_SPACE = KeyEvent.DOM_VK_BACK_SPACE || 8;
KeyEvent.DOM_VK_RETURN = KeyEvent.DOM_VK_RETURN || 13;
KeyEvent.DOM_VK_ENTER = KeyEvent.DOM_VK_ENTER || 14;
KeyEvent.DOM_VK_ESCAPE = KeyEvent.DOM_VK_ESCAPE || 27;
KeyEvent.DOM_VK_TAB = KeyEvent.DOM_VK_TAB || 9;
KeyEvent.DOM_VK_DELETE = KeyEvent.DOM_VK_DELETE || 46;

export default KeyEvent;
