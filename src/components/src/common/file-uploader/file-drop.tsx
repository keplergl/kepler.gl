// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Copied from https://github.com/sarink/react-file-drop
 * For React 16.8 compatibility
 */
import React, {ReactNode, useCallback, useEffect, useState, useRef} from 'react';
import Window from 'global/window';

const isIE = () =>
  Window &&
  Window.navigator &&
  ((Window.navigator.userAgent || []).includes('MSIE') ||
    (Window.navigator.appVersion || []).includes('Trident/'));

const eventHasFiles = event => {
  // In most browsers this is an array, but in IE11 it's an Object :(

  let hasFiles = false;
  if (event.dataTransfer) {
    const types = event.dataTransfer.types;
    for (const keyOrIndex in types) {
      if (types[keyOrIndex] === 'Files') {
        hasFiles = true;
        break;
      }
    }
  }
  return hasFiles;
};

export type FileDropProps = {
  dropEffect?: 'copy' | 'move' | 'link' | 'none';
  frame?: typeof document | typeof Window | HTMLElement;
  className?: string;
  targetClassName?: string;
  draggingOverFrameClassName?: string;
  draggingOverTargetClassName?: string;
  onDragOver?: (event: any) => void;
  onDragLeave?: (event: any) => void;
  onDrop?: (fileList: FileList, event: any) => void;
  onFrameDragEnter?: (event: any) => void;
  onFrameDragLeave?: (event: any) => void;
  onFrameDrop?: (event: any) => void;
  children?: ReactNode;
};

const FileDrop = ({
  dropEffect = 'copy',
  frame = Window ? Window.document : undefined,
  className = 'file-drop',
  targetClassName = 'file-drop-target',
  draggingOverFrameClassName = 'file-drop-dragging-over-frame',
  draggingOverTargetClassName = 'file-drop-dragging-over-target',
  onDragOver,
  onDragLeave,
  onDrop,
  onFrameDragEnter,
  onFrameDragLeave,
  onFrameDrop,
  children
}: FileDropProps) => {
  const [draggingOverTarget, setDraggingOverTarget] = useState(false);
  const [draggingOverFrame, setDraggingOverFrame] = useState(false);
  const [frameDragCounter, setFrameDragCounter] = useState(0);

  const prevFrame = useRef(frame);

  useEffect(() => {
    // componentDidMount
    startFrameListeners(frame);
    resetDragging();
    Window.addEventListener('dragover', handleWindowDragOverOrDrop);
    Window.addEventListener('drop', handleWindowDragOverOrDrop);

    return () => {
      // componentWillUnmount
      stopFrameListeners(frame);
      Window.removeEventListener('dragover', handleWindowDragOverOrDrop);
      Window.removeEventListener('drop', handleWindowDragOverOrDrop);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetDragging = useCallback(() => {
    setFrameDragCounter(0);
    setDraggingOverTarget(false);
    setDraggingOverFrame(false);
  }, []);

  const handleWindowDragOverOrDrop = useCallback(event => {
    // This prevents the browser from trying to load whatever file the user dropped on the window
    event.preventDefault();
  }, []);

  const handleFrameDrag = useCallback(
    event => {
      // Only allow dragging of files
      if (!eventHasFiles(event)) return;

      // We are listening for events on the 'frame', so every time the user drags over any element in the frame's tree,
      // the event bubbles up to the frame. By keeping count of how many "dragenters" we get, we can tell if they are still
      // "draggingOverFrame" (b/c you get one "dragenter" initially, and one "dragenter"/one "dragleave" for every bubble)
      // This is far better than a "dragover" handler, which would be calling `setState` continuously.
      const newDragCounterValue = frameDragCounter + (event.type === 'dragenter' ? 1 : -1);
      setFrameDragCounter(newDragCounterValue);

      if (newDragCounterValue === 1) {
        setDraggingOverFrame(true);
        if (onFrameDragEnter) onFrameDragEnter(event);
        return;
      }

      if (newDragCounterValue === 0) {
        setDraggingOverFrame(false);
        if (onFrameDragLeave) onFrameDragLeave(event);
        return;
      }
    },
    [frameDragCounter, setDraggingOverFrame, onFrameDragEnter, onFrameDragLeave]
  );

  const handleFrameDrop = useCallback(
    event => {
      event.preventDefault();
      if (!draggingOverTarget) {
        resetDragging();
        if (onFrameDrop) onFrameDrop(event);
      }
    },
    [onFrameDrop, draggingOverTarget, resetDragging]
  );

  const handleDragOver = useCallback(
    event => {
      if (eventHasFiles(event)) {
        setDraggingOverTarget(true);
        if (!isIE() && dropEffect) event.dataTransfer.dropEffect = dropEffect;
        if (onDragOver) onDragOver(event);
      }
    },
    [dropEffect, onDragOver]
  );

  const handleDragLeave = useCallback(
    event => {
      setDraggingOverTarget(false);

      if (onDragLeave) onDragLeave(event);
    },
    [onDragLeave]
  );

  const handleDrop = useCallback(
    event => {
      if (onDrop && eventHasFiles(event)) {
        const files = event.dataTransfer ? event.dataTransfer.files : null;
        onDrop(files, event);
      }
      resetDragging();
    },
    [onDrop, resetDragging]
  );

  const stopFrameListeners = useCallback(
    frame => {
      if (frame) {
        frame.removeEventListener('dragenter', handleFrameDrag);
        frame.removeEventListener('dragleave', handleFrameDrag);
        frame.removeEventListener('drop', handleFrameDrop);
      }
    },
    [handleFrameDrag, handleFrameDrop]
  );

  const startFrameListeners = useCallback(
    frame => {
      if (frame) {
        frame.addEventListener('dragenter', handleFrameDrag);
        frame.addEventListener('dragleave', handleFrameDrag);
        frame.addEventListener('drop', handleFrameDrop);
      }
    },
    [handleFrameDrag, handleFrameDrop]
  );

  useEffect(() => {
    // componentDidUpdate
    if (prevFrame.current !== frame) {
      resetDragging();
      stopFrameListeners(prevFrame.current);
      startFrameListeners(frame);

      prevFrame.current = frame;
    }
  }, [frame, resetDragging, stopFrameListeners, startFrameListeners]);

  // Render
  let fileDropTargetClassName = targetClassName;
  if (draggingOverFrame) fileDropTargetClassName += ` ${draggingOverFrameClassName}`;
  if (draggingOverTarget) fileDropTargetClassName += ` ${draggingOverTargetClassName}`;

  return (
    <div
      className={className}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={fileDropTargetClassName}>{children}</div>
    </div>
  );
};

export default FileDrop;
