/**
 * kepler-transport-status — one status box for every way the map surface is
 * exposed to an agent.
 *
 * Collapsed it is a single chip summarizing both transports (webMCP + the
 * WebSocket harness bridge); hovering expands a panel with per-transport
 * status and controls. The panel is part of the hover target, so moving from
 * the chip into the panel keeps it open. The chip is also a focusable,
 * clickable trigger (tabindex + focus/blur + click toggle) so the controls
 * stay reachable without a mouse.
 */
import React, {useCallback, useRef, useState} from 'react';
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

/** Worst state across both transports drives the chip color. */
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
    return {color: '#2e7cf6', dot: '#8ff29a'};
  return {color: '#555', dot: '#fff'};
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

  const o = overall(webmcp, bridge);

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
        flexDirection: 'column',
        gap: 4,
        alignItems: 'flex-start'
      }}
      onMouseEnter={open}
      onMouseLeave={scheduleClose}
      onFocus={open}
      onBlur={scheduleClose}
    >
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
      <div
        tabIndex={0}
        role="button"
        aria-expanded={expanded}
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
          gap: 8,
          background: o.color,
          color: '#fff',
          borderRadius: 999,
          padding: '4px 10px',
          boxShadow: '0 2px 8px rgba(0,0,0,.35)',
          cursor: 'pointer'
        }}
      >
        <span style={{width: 8, height: 8, borderRadius: 8, background: o.dot, flex: 'none'}} />
        <span>
          map surface · webMCP {webmcpLabel(webmcp)} · harness {bridgeLabel(bridge)}
        </span>
      </div>
    </div>
  );
}
