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

import throttle from 'lodash.throttle';
import {useEffect, useRef, useState} from 'react';
import ResizeObserver from 'resize-observer-polyfill';

const DEFAULT_THROTTLE_DELAY = 100;

// Using a single ResizeObserver for all elements can be 10x
// more performant than using a separate ResizeObserver per element
// https://groups.google.com/a/chromium.org/forum/#!msg/blink-dev/z6ienONUb5A/F5-VcUZtBAAJ
let _observerRegistry;

function getObserverRegistry() {
  if (_observerRegistry === undefined) {
    const callbacks = new Map();
    const resizeObserver = new ResizeObserver((entries, observer) => {
      for (const entry of entries) {
        callbacks.get(entry.target)?.(entry, observer);
      }
    });
    _observerRegistry = {
      subscribe(target, callback) {
        resizeObserver.observe(target);
        callbacks.set(target, callback);
      },
      unsubscribe(target) {
        resizeObserver.unobserve(target);
        callbacks.delete(target);
      }
    };
  }
  return _observerRegistry;
}

export function observeDimensions(target, handleResize, throttleDelay = DEFAULT_THROTTLE_DELAY) {
  const registry = getObserverRegistry();
  const handler = throttleDelay > 0 ? throttle(handleResize, throttleDelay) : handleResize;
  registry.subscribe(target, entry => handler(getSize(target, entry)));
}

export function unobserveDimensions(target) {
  const registry = getObserverRegistry();
  registry.unsubscribe(target);
}

function getSize(node, entry) {
  if (entry.contentRect) {
    const {width, height} = entry.contentRect;
    return {width, height};
  }
  if (node.getBoundingClientRect) {
    const {width, height} = node.getBoundingClientRect();
    return {width, height};
  }
  return null;
}

/**
 * Usage example:
 * const [ref, dimensions] = useDimensions<HTMLDivElement>();
 *
 * @param throttleDelay
 * @returns {[React.RefObject<Element>, {width: number, height: number} | null]}
 */
export default function useDimensions(throttleDelay = DEFAULT_THROTTLE_DELAY) {
  const ref = useRef(null);
  const [size, setSize] = useState(null);

  useEffect(() => {
    const {current} = ref;
    if (!current) {
      return;
    }

    let didUnobserve = false;
    observeDimensions(
      current,
      entry => {
        if (didUnobserve) return;
        const newSize = getSize(current, entry);
        if (newSize) {
          // @ts-ignore
          setSize(newSize);
        }
      },
      throttleDelay
    );
    return () => {
      didUnobserve = true;
      unobserveDimensions(current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [throttleDelay]);

  return [ref, size];
}
