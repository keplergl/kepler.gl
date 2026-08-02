// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import styled, {useTheme} from 'styled-components';

import {AttributionWithStyle, DatasetAttribution} from '@kepler.gl/types';
import {BaseMapLibraryConfig, hasMobileWidth} from '@kepler.gl/utils';
import {breakPointValues} from '@kepler.gl/styles';
import type {GlobeAttribution} from '@kepler.gl/deckgl-layers';

import {StyledAttribution, EndHorizontalFlexbox} from '../common/styled-components';

type MapLibLogoProps = {
  baseMapLibraryConfig: BaseMapLibraryConfig;
};

export const MapLibLogo = ({baseMapLibraryConfig}: MapLibLogoProps) => (
  <div className="attrition-logo">
    Basemap by:
    <a
      style={{marginLeft: '5px'}}
      className={`${baseMapLibraryConfig.mapLibCssClass}-ctrl-logo`}
      target="_blank"
      rel="noopener noreferrer"
      href={baseMapLibraryConfig.mapLibUrl}
      aria-label={`${baseMapLibraryConfig.mapLibName} logo`}
    />
  </div>
);

interface StyledDatasetAttributionsContainerProps {
  isPalm: boolean;
}

const StyledDatasetAttributionsContainer = styled.div<StyledDatasetAttributionsContainerProps>`
  max-width: ${props => (props.isPalm ? '200px' : '300px')};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: ${props => props.theme.labelColor};
  margin-right: 2px;
  margin-bottom: 1px;
  line-height: ${props => (props.isPalm ? '1em' : '1.4em')};

  &:hover {
    white-space: inherit;
  }
`;

export const DatasetAttributions = ({
  datasetAttributions,
  isPalm
}: {
  datasetAttributions: DatasetAttribution[];
  isPalm: boolean;
}) => (
  <>
    {datasetAttributions?.length ? (
      <StyledDatasetAttributionsContainer isPalm={isPalm}>
        {datasetAttributions.map((ds, idx) => (
          <a
            {...(ds.url ? {href: ds.url} : null)}
            target="_blank"
            rel="noopener noreferrer"
            key={`${ds.title}_${idx}`}
          >
            {ds.title}
            {idx !== datasetAttributions.length - 1 ? ', ' : null}
          </a>
        ))}
      </StyledDatasetAttributionsContainer>
    ) : null}
  </>
);

type AttributionProps = {
  showBaseMapLibLogo: boolean;
  basemapAttributions?: string[];
  datasetAttributions: DatasetAttribution[];
  baseMapLibraryConfig: BaseMapLibraryConfig;
  globeAttributions?: GlobeAttribution[];
};

const ATTRIBUTION_SAFE_HREF_REGEX = /^(https?:|mailto:)/i;

/**
 * Decode the handful of HTML entities that commonly appear in basemap
 * attribution strings, so they render as text rather than raw entities. Only
 * needed on the SSR / no-DOM fallback path; in the browser DOMParser decodes
 * entities for us.
 */
function decodeAttributionEntities(text: string): string {
  return text
    .replace(/&copy;/gi, '©')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;/gi, "'")
    .replace(/&amp;/gi, '&');
}

/**
 * Strip all markup from a string as a fallback for environments without a DOM
 * (e.g. SSR), then decode common HTML entities. Uses a non-greedy tag matcher;
 * only used when DOMParser is unavailable, so it never has to be perfectly
 * correct.
 */
function stripTags(html: string): string {
  return decodeAttributionEntities(html.replace(/<[^>]*>/g, '')).trim();
}

/**
 * Recursively convert parsed DOM nodes into safe React nodes. Only anchor
 * elements with http(s)/mailto hrefs become links; every other element is
 * flattened to its text content. Text nodes are emitted with internal
 * whitespace collapsed to single spaces (matching HTML rendering), so the
 * meaningful single space between adjacent links is preserved while we avoid
 * emitting large whitespace blobs.
 *
 * Anchors are collapsed to their `textContent`, so any markup nested inside an
 * anchor (including an invalid nested `<a>`) becomes plain text — a link can
 * never contain another link.
 */
function domNodesToReact(
  nodes: NodeListOf<ChildNode> | ChildNode[],
  keyPrefix: string,
  counter: {i: number}
): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  nodes.forEach(node => {
    if (node.nodeType === 3 /* TEXT_NODE */) {
      // collapse whitespace runs to a single space (HTML-like), keeping a
      // meaningful separating space between adjacent inline links
      const text = (node.textContent || '').replace(/\s+/g, ' ');
      if (text) {
        result.push(<React.Fragment key={`${keyPrefix}-t${counter.i++}`}>{text}</React.Fragment>);
      }
      return;
    }
    if (node.nodeType !== 1 /* ELEMENT_NODE */) {
      return;
    }
    const el = node as Element;
    const tag = el.tagName.toLowerCase();
    // never surface the source of script/style/template elements as text
    if (tag === 'script' || tag === 'style' || tag === 'template' || tag === 'noscript') {
      return;
    }
    if (tag === 'a') {
      const href = el.getAttribute('href') || '';
      // textContent flattens any nested markup (incl. a nested <a>) to text, so
      // the rendered link can never contain another link
      const text = el.textContent || '';
      if (!text.trim()) return;
      if (ATTRIBUTION_SAFE_HREF_REGEX.test(href)) {
        result.push(
          <a
            key={`${keyPrefix}-a${counter.i++}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {text}
          </a>
        );
      } else {
        // drop unsafe hrefs (e.g. javascript:) but keep the link text
        result.push(<React.Fragment key={`${keyPrefix}-a${counter.i++}`}>{text}</React.Fragment>);
      }
      return;
    }
    // any other element: keep its (recursively resolved) children
    result.push(...domNodesToReact(el.childNodes, keyPrefix, counter));
  });
  return result;
}

function resolveDOMParser(): {new (): DOMParser} | null {
  return (
    (typeof window !== 'undefined' && (window as any).DOMParser) ||
    (typeof globalThis !== 'undefined' && (globalThis as any).DOMParser) ||
    null
  );
}

/**
 * Parse a basemap attribution HTML string into safe React nodes. Only anchor
 * tags with http(s)/mailto hrefs become links; everything else is rendered as
 * plain text. This avoids dangerouslySetInnerHTML while preserving the links
 * custom basemap styles (e.g. OpenFreeMap) declare in their attribution.
 *
 * Uses the browser's DOMParser (inert: scripts don't run and no resources are
 * fetched) so nested tags, `>` inside attributes, unusual quoting, and HTML
 * entities are all handled correctly. Falls back to plain text where no DOM is
 * available (e.g. SSR).
 */
export function renderBasemapAttribution(html: string, keyPrefix: string): React.ReactNode[] {
  const DOMParserCtor = resolveDOMParser();
  if (!DOMParserCtor) {
    const text = stripTags(html);
    return text ? [<React.Fragment key={`${keyPrefix}-t0`}>{text}</React.Fragment>] : [];
  }
  try {
    const doc = new DOMParserCtor().parseFromString(html, 'text/html');
    return domNodesToReact(doc.body.childNodes, keyPrefix, {i: 0}).filter(Boolean);
  } catch {
    const text = stripTags(html);
    return text ? [<React.Fragment key={`${keyPrefix}-t0`}>{text}</React.Fragment>] : [];
  }
}

/**
 * Build a set of "signature" tokens for an attribution string: the hostname of
 * each safe link plus the normalized plain text (lowercased, punctuation and
 * the boilerplate word "contributors" removed). Two attributions that point at
 * the same providers therefore produce overlapping signatures even when their
 * wording differs (e.g. "© OpenStreetMap" vs "© OpenStreetMap contributors").
 */
function attributionSignature(html: string): Set<string> {
  const tokens = new Set<string>();
  const DOMParserCtor = resolveDOMParser();
  let text = html;
  if (DOMParserCtor) {
    try {
      const doc = new DOMParserCtor().parseFromString(html, 'text/html');
      doc.body.querySelectorAll('a').forEach(a => {
        const href = a.getAttribute('href') || '';
        if (ATTRIBUTION_SAFE_HREF_REGEX.test(href)) {
          try {
            tokens.add(`href:${new URL(href).hostname.replace(/^www\./, '').toLowerCase()}`);
          } catch {
            tokens.add(`href:${href.toLowerCase()}`);
          }
        }
      });
      text = doc.body.textContent || '';
    } catch {
      text = stripTags(html);
    }
  } else {
    text = stripTags(html);
  }
  const normalized = text
    .toLowerCase()
    .replace(/©|&copy;/g, '')
    .replace(/\bcontributors?\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
  if (normalized) {
    // emit per-word tokens so a shorter attribution's words can be subsumed by
    // a longer one that mentions the same providers (e.g. "openstreetmap" is
    // covered by a CARTO string mentioning both "carto" and "openstreetmap")
    normalized.split(' ').forEach(word => {
      if (word) tokens.add(`text:${word}`);
    });
  }
  return tokens;
}

/**
 * Drop attributions whose providers are already fully represented by a single
 * earlier (kept) attribution. Order is preserved, and the longer/more complete
 * strings tend to come first from the sources so they survive. This collapses
 * near-duplicates such as a standalone "© OpenStreetMap" when a CARTO string
 * that already links OpenStreetMap is present.
 *
 * Subsumption is checked against each kept attribution *individually* (never a
 * merged union), so an entry is only dropped when some single earlier entry
 * fully covers it. This avoids false positives where two unrelated providers'
 * tokens together happen to cover a distinct third provider.
 */
export function dedupeBasemapAttributions(attributions: string[]): string[] {
  const kept: string[] = [];
  const keptTokens: Set<string>[] = [];
  attributions.forEach(attribution => {
    const sig = attributionSignature(attribution);
    if (sig.size === 0) {
      // nothing to compare on; keep as-is (exact dedup already done upstream)
      if (!kept.includes(attribution)) {
        kept.push(attribution);
        keptTokens.push(sig);
      }
      return;
    }
    // subsumed only if some single kept attribution's tokens are a superset
    const isSubsumed = keptTokens.some(
      tokens => tokens.size > 0 && [...sig].every(t => tokens.has(t))
    );
    if (!isSubsumed) {
      kept.push(attribution);
      keptTokens.push(sig);
    }
  });
  return kept;
}

/**
 * Render a list of items as `| item | item ...` fragments, each preceded by a
 * pipe separator. Keys are index-based (safe even when item content collides,
 * e.g. two globe attributions sharing a label). Returns null when empty so
 * callers can `{group}` inline.
 */
function renderSeparatedLinks<T>(
  items: T[],
  keyPrefix: string,
  renderItem: (item: T, index: number) => React.ReactNode
): React.ReactNode {
  if (!items.length) return null;
  return (
    <>
      {items.map((item, idx) => (
        <React.Fragment key={`${keyPrefix}-${idx}`}>
          <span className="pipe-separator">|</span>
          {renderItem(item, idx)}
        </React.Fragment>
      ))}
    </>
  );
}

export const Attribution: React.FC<AttributionProps> = ({
  showBaseMapLibLogo = true,
  basemapAttributions = [],
  datasetAttributions,
  baseMapLibraryConfig,
  globeAttributions = []
}: AttributionProps) => {
  const isPalm = hasMobileWidth(breakPointValues);

  const memoizedComponents = useMemo(() => {
    // collapse near-duplicate attributions (e.g. a standalone OSM link when a
    // CARTO string already links OSM) before rendering
    const dedupedBasemapAttributions = dedupeBasemapAttributions(basemapAttributions);
    // attributions declared by custom basemap styles, rendered as safe links
    const basemapAttributionNodes = renderSeparatedLinks(
      dedupedBasemapAttributions,
      'basemap-attr',
      (attribution, idx) => (
        <span className="basemap-attribution">
          {renderBasemapAttribution(attribution, `basemap-attr-${idx}`)}
        </span>
      )
    );

    const globeAttributionNodes = renderSeparatedLinks(globeAttributions, 'globe-attr', attr => (
      <a href={attr.href} target="_blank" rel="noopener noreferrer">
        {attr.label}
      </a>
    ));

    if (!showBaseMapLibLogo) {
      return (
        <StyledAttribution
          mapLibCssClass={baseMapLibraryConfig.mapLibCssClass}
          mapLibAttributionCssClass={baseMapLibraryConfig.mapLibAttributionCssClass}
          showLogo={globeAttributions.length > 0}
        >
          <EndHorizontalFlexbox>
            <DatasetAttributions datasetAttributions={datasetAttributions} isPalm={isPalm} />
            <div className="attrition-link">
              {datasetAttributions?.length ? <span className="pipe-separator">|</span> : null}
              {globeAttributions.length && isPalm ? (
                <MapLibLogo baseMapLibraryConfig={baseMapLibraryConfig} />
              ) : null}
              <a href="https://kepler.gl/policy/" target="_blank" rel="noopener noreferrer">
                © kepler.gl
              </a>
              {basemapAttributionNodes}
              {globeAttributionNodes}
              {globeAttributions.length ? <span className="pipe-separator">|</span> : null}
              {globeAttributions.length && !isPalm ? (
                <MapLibLogo baseMapLibraryConfig={baseMapLibraryConfig} />
              ) : null}
            </div>
          </EndHorizontalFlexbox>
        </StyledAttribution>
      );
    }

    return (
      <StyledAttribution
        mapLibCssClass={baseMapLibraryConfig.mapLibCssClass}
        mapLibAttributionCssClass={baseMapLibraryConfig.mapLibAttributionCssClass}
        showLogo={true}
      >
        <EndHorizontalFlexbox>
          <DatasetAttributions datasetAttributions={datasetAttributions} isPalm={isPalm} />
          <div className="attrition-link">
            {datasetAttributions?.length ? <span className="pipe-separator">|</span> : null}
            {isPalm ? <MapLibLogo baseMapLibraryConfig={baseMapLibraryConfig} /> : null}
            <a href="https://kepler.gl/policy/" target="_blank" rel="noopener noreferrer">
              © kepler.gl
            </a>
            {basemapAttributionNodes}
            {globeAttributionNodes}
            <span className="pipe-separator">|</span>
            {!isPalm ? <MapLibLogo baseMapLibraryConfig={baseMapLibraryConfig} /> : null}
          </div>
        </EndHorizontalFlexbox>
      </StyledAttribution>
    );
  }, [
    showBaseMapLibLogo,
    basemapAttributions,
    datasetAttributions,
    isPalm,
    baseMapLibraryConfig,
    globeAttributions
  ]);

  return memoizedComponents;
};

const StyledAttributionLogoContainer = styled.div<{$left: number}>`
  position: absolute;
  bottom: ${props => props.theme.sidePanel.margin.left}px;
  left: ${props => props.$left}px;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  gap: 4px;
  pointer-events: auto;
  transition: left 250ms ease-in-out;
`;

const StyledLogoLink = styled.a<{$enabled: boolean}>`
  cursor: ${props => (props.$enabled ? 'pointer' : 'default')};
  display: flex;
  align-items: flex-end;
`;

type AttributionLogosProps = {
  logos: AttributionWithStyle[];
  activeSidePanel?: boolean;
  sidePanelWidth?: number;
};

const LOGO_LEFT_ADJUSTMENT = 3;

export const AttributionLogos: React.FC<AttributionLogosProps> = ({
  logos,
  activeSidePanel,
  sidePanelWidth
}) => {
  const theme = useTheme() as any;
  const left =
    (activeSidePanel ? (sidePanelWidth || 0) + LOGO_LEFT_ADJUSTMENT : 0) +
    theme.sidePanel.margin.left;

  if (!logos?.length) return null;
  return (
    <StyledAttributionLogoContainer $left={left}>
      {logos.map((logo, idx) => (
        <StyledLogoLink
          key={logo.logoUrl || idx}
          href={logo.url || undefined}
          {...(logo.url ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
          $enabled={Boolean(logo.url)}
          style={logo.bottom ? {marginBottom: logo.bottom} : undefined}
        >
          <img src={logo.logoUrl} style={{height: logo.height || 12}} alt={logo.title} />
        </StyledLogoLink>
      ))}
    </StyledAttributionLogoContainer>
  );
};
