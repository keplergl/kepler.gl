// Copyright 2022 Foursquare Labs, Inc. All Rights Reserved.

import document from 'global/document';
import {useCallback, useEffect, useRef, MutableRefObject} from 'react';
export default function useOnClickOutside<T extends HTMLElement>(
  onClose: (e) => void,
  disabled = false
): MutableRefObject<T | null> {
  const containerRef = useRef<T>(null);
  const handleClickOutside = useCallback(
    e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose(e);
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (disabled) {
      return;
    }

    document.addEventListener('click', handleClickOutside, {capture: true});

    return () => {
      document.removeEventListener('click', handleClickOutside, {capture: true});
    };
  }, [handleClickOutside, disabled]);

  return containerRef;
}
