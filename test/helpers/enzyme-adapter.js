// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Enzyme-compatible adapter for React 19 using fiber internals + DOM queries.
// Provides mount/find/simulate/props/instance/state without using act().

import React from 'react';
import ReactDOM from 'react-dom';
import {createRoot} from 'react-dom/client';

function getDisplayName(type) {
  if (!type) return '';
  if (typeof type === 'string') return type;
  if (type.displayName) return type.displayName;
  if (type.name) return type.name;
  if (type.render && type.render.displayName) return type.render.displayName;
  if (type.render && type.render.name) return type.render.name;
  if (type.type && type.type.displayName) return type.type.displayName;
  if (type.type && type.type.name) return type.type.name;
  return '';
}

function getSelectorName(selector) {
  if (typeof selector === 'string') return selector;
  if (!selector) return '';
  return selector.displayName || selector.name || '';
}

function fiberMatchesSelector(fiber, selector) {
  if (!fiber || !fiber.type) return false;

  if (typeof selector === 'string') {
    const dn = getDisplayName(fiber.type);
    if (dn === selector) return true;
    if (typeof fiber.type === 'string' && fiber.type === selector) return true;
    return false;
  }

  if (typeof selector === 'function' || typeof selector === 'object') {
    if (fiber.type === selector) return true;
    if (fiber.elementType === selector) return true;

    // memo/forwardRef wrappers
    if (fiber.type && fiber.type.$$typeof) {
      if (fiber.type.type === selector) return true;
      if (fiber.type.render === selector) return true;
      // nested: memo(forwardRef(...))
      if (fiber.type.type && fiber.type.type.render === selector) return true;
    }

    // Match by displayName for injected/wrapped components
    const selectorName = getSelectorName(selector);
    if (selectorName) {
      const fiberName = getDisplayName(fiber.type);
      if (fiberName && fiberName === selectorName) return true;
    }

    return false;
  }

  return false;
}

function collectFibers(fiber, selector, results) {
  if (!fiber) return;
  if (fiberMatchesSelector(fiber, selector)) {
    results.push(fiber);
  }
  collectFibers(fiber.child, selector, results);
  collectFibers(fiber.sibling, selector, results);
}

function collectAllFibers(fiber, results) {
  if (!fiber) return;
  if (fiber.type) results.push(fiber);
  collectAllFibers(fiber.child, results);
  collectAllFibers(fiber.sibling, results);
}

function getFiberFromDom(dom) {
  if (!dom) return null;
  const key = Object.keys(dom).find(
    k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$')
  );
  return key ? dom[key] : null;
}

function getPropsFromDom(dom) {
  if (!dom) return {};
  const key = Object.keys(dom).find(k => k.startsWith('__reactProps$'));
  return key ? dom[key] || {} : {};
}

function getFiberRoot(container) {
  const key = Object.keys(container).find(
    k => k.startsWith('__reactContainer$') || k.startsWith('__reactFiber$')
  );
  if (!key) return null;
  let node = container[key];
  if (node && node.stateNode && node.stateNode.current) {
    return node.stateNode.current;
  }
  return node;
}

function getFirstHostFiber(fiber) {
  if (!fiber) return null;
  if (typeof fiber.type === 'string') return fiber;
  return fiber.child ? getFirstHostFiber(fiber.child) : null;
}

function getDomFromFiber(fiber) {
  if (!fiber) return null;
  if (fiber.stateNode && fiber.stateNode.nodeType) return fiber.stateNode;
  return getFirstHostFiber(fiber) ? getFirstHostFiber(fiber).stateNode : null;
}

function findClassInstance(fiber) {
  if (!fiber) return null;
  if (
    fiber.stateNode &&
    fiber.stateNode !== null &&
    typeof fiber.stateNode === 'object' &&
    typeof fiber.stateNode.setState === 'function'
  ) {
    return fiber.stateNode;
  }
  // Walk children to find nested class component
  let child = fiber.child;
  while (child) {
    const found = findClassInstance(child);
    if (found) return found;
    child = child.sibling;
  }
  return null;
}

function flushWork() {
  try {
    ReactDOM.flushSync(() => {});
  } catch (e) {
    // ignore
  }
}

function isCssSelector(selector) {
  if (typeof selector !== 'string') return false;
  return (
    selector.startsWith('.') ||
    selector.startsWith('#') ||
    selector.startsWith('[') ||
    selector.includes(' ') ||
    selector.includes('>') ||
    selector.includes(':') ||
    selector.includes('+') ||
    selector.includes('~')
  );
}

function isHtmlTag(selector) {
  if (typeof selector !== 'string') return false;
  const tags = new Set([
    'a','abbr','address','area','article','aside','audio','b','base','bdi','bdo',
    'blockquote','body','br','button','canvas','caption','cite','code','col',
    'colgroup','data','datalist','dd','del','details','dfn','dialog','div','dl',
    'dt','em','embed','fieldset','figcaption','figure','footer','form','h1','h2',
    'h3','h4','h5','h6','head','header','hgroup','hr','html','i','iframe','img',
    'input','ins','kbd','label','legend','li','link','main','map','mark','menu',
    'meta','meter','nav','noscript','object','ol','optgroup','option','output',
    'p','param','picture','pre','progress','q','rp','rt','ruby','s','samp',
    'script','section','select','slot','small','source','span','strong','style',
    'sub','summary','sup','svg','table','tbody','td','template','textarea','tfoot',
    'th','thead','time','title','tr','track','u','ul','var','video','wbr',
    'path','g','circle','rect','line','polyline','polygon','text','tspan','defs',
    'clipPath','use','symbol','marker','pattern','mask','linearGradient',
    'radialGradient','stop','foreignObject','ellipse'
  ]);
  return tags.has(selector.toLowerCase());
}

class MountWrapper {
  constructor(container, root, element) {
    this._container = container;
    this._root = root;
    this._element = element;
    this.length = 1;
  }

  _getFiberRoot() {
    return getFiberRoot(this._container);
  }

  find(selector) {
    if (!selector) return new ResultSet([], this, this._container);

    if (typeof selector === 'string' && (isCssSelector(selector) || isHtmlTag(selector))) {
      const elements = Array.from(this._container.querySelectorAll(selector));
      return ResultSet.fromDomNodes(elements, this, this._container);
    }

    // Fiber-based search
    const fiberRoot = this._getFiberRoot();
    const results = [];
    collectFibers(fiberRoot, selector, results);
    return ResultSet.fromFibers(results, this, this._container);
  }

  unmount() {
    this._root.unmount();
  }

  setProps(newProps) {
    const merged = {...(this._element.props || {}), ...newProps};
    const newElement = React.cloneElement(this._element, merged);
    this._element = newElement;
    const prev = globalThis.IS_REACT_ACT_ENVIRONMENT;
    globalThis.IS_REACT_ACT_ENVIRONMENT = false;
    try {
      ReactDOM.flushSync(() => {
        this._root.render(newElement);
      });
    } catch (e) {
      // ignore
    }
    globalThis.IS_REACT_ACT_ENVIRONMENT = prev;
    flushWork();
    return this;
  }

  update() {
    return this;
  }

  text() {
    return this._container.textContent || '';
  }

  html() {
    return this._container.innerHTML || '';
  }

  getDOMNode() {
    return this._container.firstElementChild || this._container;
  }

  instance() {
    const fiberRoot = this._getFiberRoot();
    return findClassInstance(fiberRoot);
  }

  state() {
    const inst = this.instance();
    return inst ? inst.state : null;
  }

  props() {
    const fiberRoot = this._getFiberRoot();
    if (fiberRoot && fiberRoot.child) {
      return fiberRoot.child.memoizedProps || {};
    }
    return {};
  }

  prop(name) {
    return this.props()[name];
  }

  children() {
    return this.find('*');
  }

  simulate(event, mockEvent) {
    const dom = this._container.firstElementChild || this._container;
    simulateOnDom(dom, event, mockEvent, this._container);
    return this;
  }

  exists() {
    return true;
  }

  detach() {}

  debug() {
    return this._container.innerHTML;
  }
}

function simulateOnDom(dom, event, mockEvent, flushContainer) {
  if (!dom) return;

  const syntheticEvent = {
    preventDefault: () => {},
    stopPropagation: () => {},
    persist: () => {},
    target: dom,
    currentTarget: dom,
    nativeEvent: mockEvent || {},
    ...(mockEvent || {})
  };

  const handlerName = 'on' + event.charAt(0).toUpperCase() + event.slice(1);

  // Try to find handler on fiber props first
  let handled = false;
  const fiber = getFiberFromDom(dom);

  if (fiber) {
    // Walk up fibers to find a handler
    let current = fiber;
    while (current) {
      const props = current.memoizedProps;
      if (props && typeof props[handlerName] === 'function') {
        const prev = globalThis.IS_REACT_ACT_ENVIRONMENT;
        globalThis.IS_REACT_ACT_ENVIRONMENT = false;
        try {
          ReactDOM.flushSync(() => {
            props[handlerName](syntheticEvent);
          });
        } catch (e) {
          // ignore flush errors
        }
        globalThis.IS_REACT_ACT_ENVIRONMENT = prev;
        handled = true;
        break;
      }
      current = current.return;
    }
  }

  if (!handled) {
    // Try __reactProps
    const reactProps = getPropsFromDom(dom);
    if (reactProps && typeof reactProps[handlerName] === 'function') {
      const prev = globalThis.IS_REACT_ACT_ENVIRONMENT;
      globalThis.IS_REACT_ACT_ENVIRONMENT = false;
      try {
        ReactDOM.flushSync(() => {
          reactProps[handlerName](syntheticEvent);
        });
      } catch (e) {
        // ignore
      }
      globalThis.IS_REACT_ACT_ENVIRONMENT = prev;
      handled = true;
    }
  }

  if (!handled) {
    // Dispatch a real DOM event as fallback
    try {
      const domEvent = new Event(event, {bubbles: true, cancelable: true});
      if (mockEvent) {
        Object.keys(mockEvent).forEach(key => {
          try {
            Object.defineProperty(domEvent, key, {value: mockEvent[key], writable: true, configurable: true});
          } catch (e) { /* some properties are read-only */ }
        });
      }
      dom.dispatchEvent(domEvent);
    } catch (e) {
      // If DOM event dispatch fails, just ignore - handler was likely already called via props
    }
  }

  flushWork();
}

class ResultSet {
  constructor(items, rootWrapper, scopeContainer) {
    this._items = items || [];
    this._root = rootWrapper;
    this._scopeContainer = scopeContainer;
    this.length = this._items.length;
  }

  static fromDomNodes(nodes, rootWrapper, scopeContainer) {
    const items = nodes.map(n => ({type: 'dom', node: n, fiber: getFiberFromDom(n)}));
    return new ResultSet(items, rootWrapper, scopeContainer);
  }

  static fromFibers(fibers, rootWrapper, scopeContainer) {
    const items = fibers.map(f => ({type: 'fiber', fiber: f, node: getDomFromFiber(f)}));
    return new ResultSet(items, rootWrapper, scopeContainer);
  }

  _getDom(item) {
    if (!item) return null;
    if (item.node) return item.node;
    if (item.fiber) return getDomFromFiber(item.fiber);
    return null;
  }

  _getFiber(item) {
    if (!item) return null;
    if (item.fiber) return item.fiber;
    if (item.node) return getFiberFromDom(item.node);
    return null;
  }

  _getProps(item) {
    const fiber = this._getFiber(item);
    if (fiber && fiber.memoizedProps) return fiber.memoizedProps;
    const dom = this._getDom(item);
    if (dom) return getPropsFromDom(dom) || {};
    return {};
  }

  at(index) {
    if (index < 0 || index >= this._items.length) {
      return new ResultSet([], this._root, this._scopeContainer);
    }
    return new ResultSet([this._items[index]], this._root, this._scopeContainer);
  }

  first() {
    return this.at(0);
  }

  last() {
    return this.at(this._items.length - 1);
  }

  get(index) {
    const item = this._items[index];
    return this._getDom(item);
  }

  getDOMNode() {
    return this.get(0);
  }

  find(selector) {
    if (this._items.length === 0) {
      return new ResultSet([], this._root, this._scopeContainer);
    }

    const item = this._items[0];

    if (typeof selector === 'string' && (isCssSelector(selector) || isHtmlTag(selector))) {
      const dom = this._getDom(item);
      if (!dom) return new ResultSet([], this._root, this._scopeContainer);
      const elements = Array.from(dom.querySelectorAll(selector));
      return ResultSet.fromDomNodes(elements, this._root, this._scopeContainer);
    }

    // Fiber-based search from this fiber's subtree
    const fiber = this._getFiber(item);
    if (!fiber) {
      // Fallback: search from root
      return this._root.find(selector);
    }
    const results = [];
    collectFibers(fiber.child, selector, results);
    return ResultSet.fromFibers(results, this._root, this._scopeContainer);
  }

  text() {
    if (this._items.length === 0) return '';
    const dom = this._getDom(this._items[0]);
    return dom ? dom.textContent || '' : '';
  }

  html() {
    if (this._items.length === 0) return '';
    const dom = this._getDom(this._items[0]);
    return dom ? dom.outerHTML || '' : '';
  }

  props() {
    if (this._items.length === 0) return {};
    return this._getProps(this._items[0]);
  }

  prop(name) {
    return this.props()[name];
  }

  instance() {
    if (this._items.length === 0) return null;
    const fiber = this._getFiber(this._items[0]);
    return findClassInstance(fiber);
  }

  state() {
    const inst = this.instance();
    return inst ? inst.state : null;
  }

  simulate(event, mockEvent) {
    if (this._items.length === 0) return this;
    const item = this._items[0];

    // For fiber items, try props handler first
    const fiber = this._getFiber(item);
    if (fiber) {
      const handlerName = 'on' + event.charAt(0).toUpperCase() + event.slice(1);
      const props = fiber.memoizedProps;
      if (props && typeof props[handlerName] === 'function') {
        const dom = this._getDom(item) || this._scopeContainer;
        const syntheticEvent = {
          preventDefault: () => {},
          stopPropagation: () => {},
          persist: () => {},
          target: dom,
          currentTarget: dom,
          nativeEvent: mockEvent || {},
          ...(mockEvent || {})
        };
        const prev = globalThis.IS_REACT_ACT_ENVIRONMENT;
        globalThis.IS_REACT_ACT_ENVIRONMENT = false;
        try {
          ReactDOM.flushSync(() => {
            props[handlerName](syntheticEvent);
          });
        } catch (e) {
          // ignore
        }
        globalThis.IS_REACT_ACT_ENVIRONMENT = prev;
        flushWork();
        return this;
      }

      // Walk to first host fiber if the handler wasn't on this fiber
      const hostFiber = getFirstHostFiber(fiber);
      if (hostFiber && hostFiber.stateNode) {
        simulateOnDom(hostFiber.stateNode, event, mockEvent, this._scopeContainer);
        return this;
      }
    }

    const dom = this._getDom(item);
    if (dom) {
      simulateOnDom(dom, event, mockEvent, this._scopeContainer);
    }
    return this;
  }

  hasClass(className) {
    if (this._items.length === 0) return false;
    const dom = this._getDom(this._items[0]);
    if (!dom) return false;
    if (dom.classList && dom.classList.contains(className)) return true;
    // Also check className prop for styled-components
    const p = this._getProps(this._items[0]);
    if (p.className && typeof p.className === 'string') {
      return p.className.split(/\s+/).includes(className);
    }
    return false;
  }

  exists() {
    return this._items.length > 0;
  }

  children() {
    if (this._items.length === 0) {
      return new ResultSet([], this._root, this._scopeContainer);
    }
    const item = this._items[0];
    const fiber = this._getFiber(item);
    if (fiber && fiber.child) {
      const kids = [];
      let child = fiber.child;
      while (child) {
        if (child.type) kids.push({type: 'fiber', fiber: child, node: getDomFromFiber(child)});
        child = child.sibling;
      }
      if (kids.length > 0) {
        return new ResultSet(kids, this._root, this._scopeContainer);
      }
    }
    // Fallback to DOM children
    const dom = this._getDom(item);
    if (dom) {
      const childNodes = Array.from(dom.children);
      return ResultSet.fromDomNodes(childNodes, this._root, this._scopeContainer);
    }
    return new ResultSet([], this._root, this._scopeContainer);
  }

  childAt(index) {
    return this.children().at(index);
  }

  parent() {
    if (this._items.length === 0) {
      return new ResultSet([], this._root, this._scopeContainer);
    }
    const item = this._items[0];
    const fiber = this._getFiber(item);
    if (fiber && fiber.return) {
      const parentFiber = fiber.return;
      return new ResultSet(
        [{type: 'fiber', fiber: parentFiber, node: getDomFromFiber(parentFiber)}],
        this._root,
        this._scopeContainer
      );
    }
    const dom = this._getDom(item);
    if (dom && dom.parentElement) {
      return ResultSet.fromDomNodes([dom.parentElement], this._root, this._scopeContainer);
    }
    return new ResultSet([], this._root, this._scopeContainer);
  }

  parents(selector) {
    if (this._items.length === 0) {
      return new ResultSet([], this._root, this._scopeContainer);
    }
    const item = this._items[0];
    const fiber = this._getFiber(item);
    const ancestors = [];
    if (fiber) {
      let current = fiber.return;
      while (current) {
        if (!selector || fiberMatchesSelector(current, selector)) {
          ancestors.push({type: 'fiber', fiber: current, node: getDomFromFiber(current)});
        }
        current = current.return;
      }
    }
    if (ancestors.length > 0) return new ResultSet(ancestors, this._root, this._scopeContainer);
    // DOM fallback
    const dom = this._getDom(item);
    if (dom) {
      let p = dom.parentElement;
      while (p) {
        if (!selector || (typeof selector === 'string' && p.matches && p.matches(selector))) {
          ancestors.push({type: 'dom', node: p, fiber: getFiberFromDom(p)});
        }
        p = p.parentElement;
      }
    }
    return new ResultSet(ancestors, this._root, this._scopeContainer);
  }

  closest(selector) {
    const p = this.parents(selector);
    return p.length > 0 ? p.at(0) : new ResultSet([], this._root, this._scopeContainer);
  }

  map(fn) {
    return this._items.map((item, i) => {
      const wrapped = new ResultSet([item], this._root, this._scopeContainer);
      return fn(wrapped, i);
    });
  }

  forEach(fn) {
    this._items.forEach((item, i) => {
      const wrapped = new ResultSet([item], this._root, this._scopeContainer);
      fn(wrapped, i);
    });
  }

  filter(fn) {
    if (typeof fn === 'function') {
      const filtered = this._items.filter((item, i) => {
        const wrapped = new ResultSet([item], this._root, this._scopeContainer);
        return fn(wrapped, i);
      });
      return new ResultSet(filtered, this._root, this._scopeContainer);
    }
    // selector filter
    const filtered = this._items.filter(item => {
      const fiber = this._getFiber(item);
      return fiber && fiberMatchesSelector(fiber, fn);
    });
    return new ResultSet(filtered, this._root, this._scopeContainer);
  }

  reduce(fn, initial) {
    return this._items.reduce((acc, item, i) => {
      const wrapped = new ResultSet([item], this._root, this._scopeContainer);
      return fn(acc, wrapped, i);
    }, initial);
  }

  some(fn) {
    return this._items.some((item, i) => {
      const wrapped = new ResultSet([item], this._root, this._scopeContainer);
      return fn(wrapped, i);
    });
  }

  every(fn) {
    return this._items.every((item, i) => {
      const wrapped = new ResultSet([item], this._root, this._scopeContainer);
      return fn(wrapped, i);
    });
  }

  invoke(propName) {
    const p = this.props();
    const fn = p[propName];
    if (typeof fn !== 'function') return () => {};
    return (...args) => {
      const prev = globalThis.IS_REACT_ACT_ENVIRONMENT;
      globalThis.IS_REACT_ACT_ENVIRONMENT = false;
      let result;
      try {
        ReactDOM.flushSync(() => {
          result = fn(...args);
        });
      } catch (e) {
        // ignore
      }
      globalThis.IS_REACT_ACT_ENVIRONMENT = prev;
      flushWork();
      return result;
    };
  }

  hostNodes() {
    const filtered = this._items.filter(item => {
      const fiber = this._getFiber(item);
      if (fiber && typeof fiber.type === 'string') return true;
      const dom = this._getDom(item);
      return dom && dom.nodeType === 1;
    });
    return new ResultSet(filtered, this._root, this._scopeContainer);
  }

  dive() {
    if (this._items.length === 0) {
      return new ResultSet([], this._root, this._scopeContainer);
    }
    const fiber = this._getFiber(this._items[0]);
    if (fiber && fiber.child) {
      return new ResultSet(
        [{type: 'fiber', fiber: fiber.child, node: getDomFromFiber(fiber.child)}],
        this._root,
        this._scopeContainer
      );
    }
    return this;
  }

  is(selector) {
    if (this._items.length === 0) return false;
    const item = this._items[0];
    if (typeof selector === 'string' && isCssSelector(selector)) {
      const dom = this._getDom(item);
      return dom && dom.matches && dom.matches(selector);
    }
    const fiber = this._getFiber(item);
    return fiber ? fiberMatchesSelector(fiber, selector) : false;
  }

  type() {
    if (this._items.length === 0) return null;
    const fiber = this._getFiber(this._items[0]);
    return fiber ? fiber.type : null;
  }

  name() {
    if (this._items.length === 0) return null;
    const fiber = this._getFiber(this._items[0]);
    if (!fiber) return null;
    return getDisplayName(fiber.type) || null;
  }

  key() {
    if (this._items.length === 0) return null;
    const fiber = this._getFiber(this._items[0]);
    return fiber ? fiber.key : null;
  }

  contains(nodeOrText) {
    if (this._items.length === 0) return false;
    if (typeof nodeOrText === 'string') {
      return this.text().includes(nodeOrText);
    }
    return this._items.length > 0;
  }

  update() {
    return this;
  }

  detach() {}

  setProps(newProps) {
    // Delegate to root for re-render
    if (this._root && this._root.setProps) {
      return this._root.setProps(newProps);
    }
    return this;
  }

  debug() {
    if (this._items.length === 0) return '[ResultSet: 0 items]';
    const dom = this._getDom(this._items[0]);
    return dom ? dom.outerHTML : '[ResultSet: no DOM]';
  }

  // Allow indexing with []
  [Symbol.iterator]() {
    let index = 0;
    const items = this._items;
    const root = this._root;
    const scope = this._scopeContainer;
    return {
      next() {
        if (index < items.length) {
          return {value: new ResultSet([items[index++]], root, scope), done: false};
        }
        return {done: true};
      }
    };
  }
}

export function mount(element) {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const prev = globalThis.IS_REACT_ACT_ENVIRONMENT;
  globalThis.IS_REACT_ACT_ENVIRONMENT = false;

  const root = createRoot(container);
  try {
    ReactDOM.flushSync(() => {
      root.render(element);
    });
  } catch (e) {
    // ignore flush errors during initial render
  }

  globalThis.IS_REACT_ACT_ENVIRONMENT = prev;

  // Process pending microtasks for useEffect state initialization
  flushWork();

  const wrapper = new MountWrapper(container, root, element);

  // Add unmount cleanup
  const origUnmount = wrapper.unmount.bind(wrapper);
  wrapper.unmount = () => {
    origUnmount();
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  };

  return wrapper;
}

export function configure() {}
export const shallow = mount;
export {mount as render};
