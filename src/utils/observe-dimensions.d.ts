import {RefObject} from 'react';

export interface Dimensions {
  readonly height: number;
  readonly width: number;
}

export default function useDimensions<T extends Element>(
  throttleDelay?: number
): [RefObject<T>, Dimensions | undefined];

export function observeDimensions(
  target: Element,
  handleResize: (size: Dimensions) => void,
  throttleDelay?: number
);

export function unobserveDimensions(target: Element);
