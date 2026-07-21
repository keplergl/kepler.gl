import React, {useCallback, useEffect, useRef, useState} from 'react';
import html2canvas from 'html2canvas';

interface ScreenshotWrapperProps {
  children: React.ReactNode;
  startScreenCapture: boolean;
  setScreenCaptured: (screenshot: string) => void;
  setStartScreenCapture: (flag: boolean) => void;
  className?: string;
}

/**
 * Lightweight screenshot selection wrapper.
 * Replaces @openassistant/ui's ScreenshotWrapper to avoid HeroUI dependency.
 */
export function ScreenshotWrapper({
  children,
  startScreenCapture,
  setScreenCaptured,
  setStartScreenCapture,
  className
}: ScreenshotWrapperProps) {
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [clipWidth, setClipWidth] = useState(0);
  const [clipHeight, setClipHeight] = useState(0);
  const [clipTop, setClipTop] = useState(0);
  const [clipLeft, setClipLeft] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [borderStyle, setBorderStyle] = useState<string | number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!startScreenCapture) return;
      setStartX(e.clientX);
      setStartY(e.clientY);
      setClipTop(e.clientY);
      setClipLeft(e.clientX);
      setIsDragging(true);
      setBorderStyle(`${windowWidth}px ${windowHeight}px`);
    },
    [startScreenCapture, windowWidth, windowHeight]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!startScreenCapture || !isDragging) return;

      const x = e.clientX;
      const y = e.clientY;
      const goingDown = y >= startY;
      const goingRight = x >= startX;

      let top = startY;
      let left = startX;
      let w = 0;
      let h = 0;
      let border: string;

      if (goingDown && goingRight) {
        border = `${startY}px ${windowWidth - x}px ${windowHeight - y}px ${startX}px`;
        w = x - startX;
        h = y - startY;
      } else if (goingDown && !goingRight) {
        border = `${startY}px ${windowWidth - startX}px ${windowHeight - y}px ${x}px`;
        w = startX - x;
        h = y - startY;
        left = x;
      } else if (!goingDown && goingRight) {
        border = `${y}px ${windowWidth - x}px ${windowHeight - startY}px ${startX}px`;
        w = x - startX;
        h = startY - y;
        top = y;
      } else {
        border = `${y}px ${windowWidth - startX}px ${windowHeight - startY}px ${x}px`;
        w = startX - x;
        h = startY - y;
        top = y;
        left = x;
      }

      setBorderStyle(border);
      setClipWidth(w);
      setClipHeight(h);
      setClipTop(top);
      setClipLeft(left);
    },
    [startScreenCapture, isDragging, startX, startY, windowWidth, windowHeight]
  );

  const captureRegion = useCallback(async () => {
    const body = document.querySelector('body');
    if (!body) return;

    const dpr = window.devicePixelRatio;
    const canvases = document.querySelectorAll('canvas');
    const canvasData: string[] = [];

    await new Promise<void>(resolve => {
      window.requestAnimationFrame(() => {
        canvases.forEach(c => canvasData.push(c.toDataURL()));
        resolve();
      });
    });

    const fullCanvas = await html2canvas(body, {
      scale: dpr,
      backgroundColor: null,
      useCORS: true,
      onclone: (doc: Document) => {
        doc.querySelectorAll('canvas').forEach((c, i) => {
          const parent = c.parentNode;
          const img = doc.createElement('img');
          img.src = canvasData[i];
          parent?.replaceChild(img, c);
        });
      }
    });

    const crop = document.createElement('canvas');
    const ctx = crop.getContext('2d');
    crop.width = clipWidth;
    crop.height = clipHeight;
    if (ctx) {
      ctx.drawImage(
        fullCanvas,
        clipLeft * dpr,
        clipTop * dpr,
        clipWidth * dpr,
        clipHeight * dpr,
        0,
        0,
        clipWidth,
        clipHeight
      );
      setScreenCaptured(crop.toDataURL());
    }
  }, [clipWidth, clipHeight, clipLeft, clipTop, setScreenCaptured]);

  const handleMouseUp = useCallback(() => {
    if (!startScreenCapture) return;
    captureRegion();
    setIsDragging(false);
    setBorderStyle(0);
    setStartScreenCapture(false);
  }, [startScreenCapture, captureRegion, setStartScreenCapture]);

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      <div
        className={`min-w-100 relative flex w-screen ${startScreenCapture ? 'h-screen' : 'h-full'} flex-row items-start border-none ${className || ''}`}
      >
        {children}
      </div>
      {startScreenCapture && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-gray-50/50"
          style={{
            zIndex: 2147483645,
            borderWidth: typeof borderStyle === 'string' ? undefined : 0,
            ...(isDragging
              ? {
                  backgroundColor: 'transparent',
                  borderStyle: 'solid',
                  borderColor: 'rgba(249, 250, 251, 0.5)',
                  borderWidth: borderStyle as string
                }
              : {})
          }}
        />
      )}
    </div>
  );
}
