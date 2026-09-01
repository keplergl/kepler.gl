/**
 * kepler-transport-status — one status box for every way the map surface is
 * exposed to an agent.
 *
 * Collapsed it is a small LED (green when a transport is live, grey when
 * idle, amber while connecting, red on error). Hovering / focusing / clicking
 * expands a panel with per-transport status and controls. The panel is part
 * of the hover target, so moving from the LED into the panel keeps it open.
 * The LED is also a focusable, clickable trigger (tabindex + focus/blur +
 * click toggle) so the controls stay reachable without a mouse.
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {KeplerWebMcp, type WebMcpStatusInfo} from './kepler-webmcp';
import {KeplerMcpBridge, type BridgeStatusInfo} from './kepler-mcp-bridge';

type Props = {
  reduxStore: any;
};

function webmcpLabel(info: WebMcpStatusInfo | null): string {
  if (!info) return '…';
  if (!info.available) return 'unavailable';
  if (!info.enabled) return 'off';
  if (info.status === 'registered') return String(info.toolCount);
  return info.status;
}

function bridgeLabel(info: BridgeStatusInfo | null): string {
  return info ? info.status : 'idle';
}

/** Worst state across both transports drives the LED color. */
function overall(
  webmcp: WebMcpStatusInfo | null,
  bridge: BridgeStatusInfo | null
): {color: string; dot: string} {
  const states: string[] = [];
  if (webmcp?.available && webmcp.enabled) states.push(webmcp.status);
  if (bridge) states.push(bridge.status);
  if (states.includes('error')) return {color: '#d64545', dot: '#fff'};
  if (states.includes('registering') || states.includes('connecting'))
    return {color: '#b58900', dot: '#ffe27a'};
  if (states.includes('registered') || states.includes('connected'))
    return {color: '#1f9d55', dot: '#8ff29a'};
  return {color: '#6b6b6b', dot: '#c8c8c8'};
}

export function KeplerTransportStatus({reduxStore}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [webmcp, setWebmcp] = useState<WebMcpStatusInfo | null>(null);
  const [bridge, setBridge] = useState<BridgeStatusInfo | null>(null);
  const closeTimer = useRef<number | null>(null);

  const open = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setExpanded(true);
  }, []);

  const scheduleClose = useCallback(() => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setExpanded(false), 150);
  }, []);

  // Clear the pending close timer on unmount — otherwise the scheduled
  // setExpanded(false) fires after the component is gone (React "state update
  // on an unmounted component" warning / potential memory leak).
  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) {
        window.clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
    };
  }, []);

  const o = overall(webmcp, bridge);
  const summary = `map surface · webMCP ${webmcpLabel(webmcp)} · harness ${bridgeLabel(bridge)}`;

  return (
    <div
      style={{
        position: 'fixed',
        left: 12,
        bottom: 12,
        zIndex: 9999,
        fontFamily: 'monospace',
        fontSize: 11,
        display: 'flex',
        // column-reverse keeps the LED (first in DOM) visually at the bottom
        // while the panel renders above it. The LED must come FIRST in the
        // DOM so that after expanding it with the keyboard, forward-tab moves
        // into the panel's controls instead of jumping out of the widget.
        flexDirection: 'column-reverse',
        gap: 4,
        alignItems: 'flex-start'
      }}
      onMouseEnter={open}
      onMouseLeave={scheduleClose}
      onFocus={open}
      onBlur={e => {
        // React's onBlur bubbles, so it fires when focus moves between the
        // LED and the panel's controls too. Only schedule the close when
        // focus actually leaves the whole widget — otherwise tabbing through
        // the controls would collapse the panel mid-interaction.
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          scheduleClose();
        }
      }}
    >
      <div
        tabIndex={0}
        role="button"
        aria-expanded={expanded}
        aria-label={summary}
        title={summary}
        onClick={() => setExpanded(prev => !prev)}
        onKeyDown={e => {
          // role="button" on a div has no native keyboard activation;
          // mirror the click toggle for Enter/Space.
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setExpanded(prev => !prev);
          }
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: o.color,
          border: 'none',
          borderRadius: 999,
          width: 18,
          height: 18,
          padding: 0,
          boxShadow: '0 0 0 2px rgba(255,255,255,.75), 0 2px 8px rgba(0,0,0,.35)',
          cursor: 'pointer',
          flex: 'none'
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 8,
            background: o.dot,
            flex: 'none'
          }}
        />
      </div>
      <div
        style={{
          background: 'rgba(0,0,0,.92)',
          borderRadius: 8,
          padding: '8px 10px',
          maxWidth: 440,
          boxShadow: '0 4px 16px rgba(0,0,0,.4)',
          display: expanded ? 'flex' : 'none',
          flexDirection: 'column',
          gap: 8
        }}
      >
        <KeplerWebMcp reduxStore={reduxStore} onStatus={setWebmcp} />
        <div style={{height: 1, background: 'rgba(255,255,255,.15)'}} />
        <KeplerMcpBridge reduxStore={reduxStore} onStatus={setBridge} />
      </div>
    </div>
  );
}
