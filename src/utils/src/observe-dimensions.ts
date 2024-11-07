// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import throttle from 'lodash.throttle';
import {useEffect, useRef, useState, RefObject} from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export interface Dimensions {
  readonly height: number;
  readonly width: number;
}

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
        if (target instanceof Element) {
          resizeObserver.observe(target);
          callbacks.set(target, callback);
        }
      },
      unsubscribe(target) {
        if (target instanceof Element) {
          resizeObserver.unobserve(target);
          callbacks.delete(target);
        }
      }
    };
  }
  return _observerRegistry;
}

export function observeDimensions(
  target: Element,
  handleResize: (size: Dimensions | null) => void,
  throttleDelay = DEFAULT_THROTTLE_DELAY
) {
  const registry = getObserverRegistry();
  const handler = throttleDelay > 0 ? throttle(handleResize, throttleDelay) : handleResize;
  registry.subscribe(target, entry => handler(getSize(target, entry)));
}

export function unobserveDimensions(target: Element) {
  const registry = getObserverRegistry();
  registry.unsubscribe(target);
}

function getSize(node, entry): Dimensions | null {
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
 * @returns
 */
export default function useDimensions<T extends Element>(
  nodeRef?: RefObject<T>,
  throttleDelay = DEFAULT_THROTTLE_DELAY
): [RefObject<T>, Dimensions | null] {
  const ref = useRef<T>(null);
  const [size, setSize] = useState(null);

  useEffect(() => {
    const {current} = ref || {};
    if (!current || !nodeRef) {
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
  }, [throttleDelay, ref?.current]);

  return [ref, size];
}
