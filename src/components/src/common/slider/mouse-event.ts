// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import document from 'global/document';
import window from 'global/window';
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
  track: RefObject<StyleRangeSliderType | null>;
  setAnchor?: null | ((distance: number) => void);
};

export default class MouseEventHandler {
  private vertical: boolean;
  private valueListener: (distance: number) => void;
  private toggleMouseOver: () => void;
  private track: RefObject<StyleRangeSliderType | null>;
  private setAnchor: null | ((distance: number) => void); // Set correct type
  private dragging = false;

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
    if (this.dragging) {
      return;
    }
    this.dragging = true;
    document.addEventListener('mouseup', this.endDrag);
    document.addEventListener('mousemove', this.mousemove);
    window.addEventListener('blur', this.endDrag);
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

  private endDrag = () => {
    if (!this.dragging) {
      return;
    }
    this.destroy();
    this.toggleMouseOver();
  };

  destroy() {
    document.removeEventListener('mouseup', this.endDrag);
    document.removeEventListener('mousemove', this.mousemove);
    document.removeEventListener('touchend', this.endDrag);
    document.removeEventListener('touchcancel', this.endDrag);
    document.removeEventListener('touchmove', this.touchmove);
    window.removeEventListener('blur', this.endDrag);
    this.dragging = false;
  }

  private getDistanceToTrack(pos: number) {
    if (!this.track.current) {
      return 0;
    }
    const trackRect = this.track.current.getBoundingClientRect();
    return pos - (this.vertical ? trackRect.bottom : trackRect.left);
  }

  private mousemove = (e: MouseEvent) => {
    // A release outside the document may not deliver a mouseup here.
    if (e.buttons === 0) {
      this.endDrag();
      return;
    }
    e.preventDefault();
    const pos = this.getMousePos(e);
    this.valueListener(this.getDistanceToTrack(pos));
  };

  handleTouchStart: TouchEventHandler = (e: TouchEvent) => {
    if (this.dragging) {
      return;
    }
    this.dragging = true;
    // TODO: fix touch event
    document.addEventListener('touchend', this.endDrag);
    document.addEventListener('touchcancel', this.endDrag);
    document.addEventListener('touchmove', this.touchmove);
    window.addEventListener('blur', this.endDrag);
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
}
