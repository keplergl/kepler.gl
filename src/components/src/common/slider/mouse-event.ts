// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import document from 'global/document';
import {
  RefObject,
  TouchEvent,
  TouchEventHandler,
  MouseEventHandler as ReactMouseEventHandler,
  MouseEvent
} from 'react';
import {StyleRangeSliderType} from './slider';

function nope() {
  return;
}

type MouseEventHandlerProps = {
  vertical: boolean;
  valueListener: (distance: number) => void;
  toggleMouseOver: () => void;
  track: RefObject<StyleRangeSliderType>;
  setAnchor?: null | ((distance: number) => void);
};

export default class MouseEventHandler {
  private vertical: boolean;
  private valueListener: (distance: number) => void;
  private toggleMouseOver: () => void;
  private track: RefObject<StyleRangeSliderType>; // Set correct type
  private setAnchor: null | ((distance: number) => void); // Set correct type

  constructor({
    vertical = false,
    valueListener = nope,
    toggleMouseOver = nope,
    track,
    setAnchor = null
  }: MouseEventHandlerProps) {
    this.vertical = vertical;
    this.valueListener = valueListener;
    this.toggleMouseOver = toggleMouseOver;
    this.track = track;
    this.setAnchor = setAnchor;
  }

  handleMouseDown: ReactMouseEventHandler = (e: MouseEvent) => {
    document.addEventListener('mouseup', this.mouseup);
    document.addEventListener('mousemove', this.mousemove);
    if (this.setAnchor) {
      const pos = this.getMousePos(e);
      this.setAnchor(this.getDistanceToTrack(pos));
    }
    this.toggleMouseOver();
  };

  private getMousePos(e: MouseEvent) {
    return this.vertical ? e.clientY : e.clientX;
  }

  private getTouchPosition(e: TouchEvent) {
    return this.vertical ? e.touches[0].clientY : e.touches[0].clientX;
  }

  private mouseup = () => {
    document.removeEventListener('mouseup', this.mouseup);
    document.removeEventListener('mousemove', this.mousemove);
    this.toggleMouseOver();
  };

  private getDistanceToTrack(pos: number) {
    if (!this.track.current) {
      return 0;
    }
    const trackRect = this.track.current.getBoundingClientRect();
    return pos - (this.vertical ? trackRect.bottom : trackRect.left);
  }

  private mousemove = (e: MouseEvent) => {
    e.preventDefault();
    const pos = this.getMousePos(e);
    this.valueListener(this.getDistanceToTrack(pos));
  };

  handleTouchStart: TouchEventHandler = (e: TouchEvent) => {
    // TODO: fix touch event
    document.addEventListener('touchend', this.touchend);
    document.addEventListener('touchmove', this.touchmove);
    if (this.setAnchor) {
      const pos = this.getTouchPosition(e);
      this.setAnchor(this.getDistanceToTrack(pos));
    }
    this.toggleMouseOver();
  };

  private touchmove = (e: TouchEvent) => {
    // TODO: touch not tested
    const pos = this.getTouchPosition(e);
    this.valueListener(this.getDistanceToTrack(pos));
  };

  private touchend = () => {
    document.removeEventListener('touchend', this.touchend);
    document.removeEventListener('touchmove', this.touchmove);
    this.toggleMouseOver();
  };
}
