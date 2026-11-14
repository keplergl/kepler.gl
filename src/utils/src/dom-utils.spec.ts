// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {IMAGE_EXPORT_ERRORS} from '@kepler.gl/constants';
import {
  canvasToBlob,
  getAndEncode,
  makeImage,
  processClone,
  setStyleSheetBaseHref
} from './dom-utils';

function style(cssText: string): CSSStyleDeclaration {
  const element = document.createElement('div');
  element.style.cssText = cssText;
  return element.style;
}

describe('processClone export fidelity', () => {
  let computedStyle: jest.SpyInstance;

  beforeEach(() => {
    // JSDOM does not compute pseudo-element styles. Supply browser-style results
    // explicitly while retaining real DOM nodes and CSSStyleDeclarations.
    computedStyle = jest
      .spyOn(window, 'getComputedStyle')
      .mockImplementation((_node, pseudo) =>
        style(pseudo ? 'content: none;' : 'color: rgb(10, 20, 30);')
      );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('leaves text nodes intact without querying element styles', async () => {
    const original = document.createTextNode('Map legend');
    const clone = original.cloneNode(false);

    expect(await processClone(original, clone)).toBe(clone);
    expect(clone.textContent).toBe('Map legend');
    expect(computedStyle).not.toHaveBeenCalled();
  });

  test('copies computed styles without changing the source element', async () => {
    const original = document.createElement('div');
    original.style.color = 'red';
    computedStyle.mockImplementation((_node, pseudo) =>
      style(pseudo ? 'content: none;' : 'color: rgb(10, 20, 30); opacity: 0.5;')
    );
    const clone = original.cloneNode(false) as HTMLElement;

    expect(await processClone(original, clone)).toBe(clone);
    expect(clone.style.color).toBe('rgb(10, 20, 30)');
    expect(clone.style.opacity).toBe('0.5');
    expect(original.style.color).toBe('red');
    expect(original.style.opacity).toBe('');
  });

  test('copies enumerated computed properties and their priority when cssText is empty', async () => {
    const original = document.createElement('div');
    const properties = style('color: red !important; padding-left: 4px;');
    Object.defineProperty(properties, 'cssText', {value: ''});
    computedStyle.mockImplementation((_node, pseudo) =>
      pseudo ? style('content: none;') : properties
    );
    const clone = original.cloneNode(false) as HTMLElement;

    await processClone(original, clone);

    expect(clone.style.color).toBe('red');
    expect(clone.style.getPropertyPriority('color')).toBe('important');
    expect(clone.style.paddingLeft).toBe('4px');
  });

  test('materializes generated pseudo content under a clone-only selector', async () => {
    const original = document.createElement('div');
    original.className = 'legend';
    computedStyle.mockImplementation((_node, pseudo) =>
      style(
        pseudo === ':before'
          ? 'content: "Legend key"; color: red;'
          : pseudo
          ? 'content: none;'
          : 'color: black;'
      )
    );
    const clone = original.cloneNode(false) as HTMLElement;

    await processClone(original, clone);

    const rules = clone.querySelectorAll('style');
    const addedClass = Array.from(clone.classList).find(name => name !== 'legend');
    expect(addedClass).toBeDefined();
    expect(rules).toHaveLength(1);
    expect(rules[0].textContent).toContain(`.${addedClass}::before`);
    expect(rules[0].textContent).toContain('content: "Legend key"');
    expect(rules[0].textContent).toContain('color: red');
    expect(original.className).toBe('legend');
    expect(original.childNodes).toHaveLength(0);
  });

  test('omits absent pseudo content rather than adding empty export rules', async () => {
    computedStyle.mockImplementation((_node, pseudo) =>
      style(pseudo === ':before' ? 'content: none;' : '')
    );
    const original = document.createElement('div');
    original.className = 'legend';
    const clone = original.cloneNode(false) as HTMLElement;

    await processClone(original, clone);

    expect(clone.className).toBe('legend');
    expect(clone.querySelector('style')).toBeNull();
  });

  test('serializes the current input value instead of its initial attribute', async () => {
    const original = document.createElement('input');
    original.setAttribute('value', 'Initial title');
    original.value = 'Edited map title';
    const clone = original.cloneNode(false) as HTMLInputElement;

    await processClone(original, clone);

    expect(clone.getAttribute('value')).toBe('Edited map title');
    expect(original.getAttribute('value')).toBe('Initial title');
    expect(original.value).toBe('Edited map title');
  });

  test('serializes edited multiline textarea text without changing its source', async () => {
    const original = document.createElement('textarea');
    original.textContent = 'Original note';
    original.value = 'Current map note\nSecond line';
    const clone = original.cloneNode(false) as HTMLTextAreaElement;

    await processClone(original, clone);

    expect(clone.textContent).toBe('Current map note\nSecond line');
    expect(original.textContent).toBe('Original note');
    expect(original.value).toBe('Current map note\nSecond line');
  });
});

describe('export resource loading', () => {
  function requestResource(
    options: {imagePlaceholder?: string; cacheBust?: boolean} = {},
    url = 'https://example.test/tile.png'
  ) {
    const request = {
      readyState: 0,
      status: 200,
      response: new Blob(['tile'], {type: 'image/png'}),
      responseType: '',
      timeout: 0,
      onreadystatechange: null as null | (() => void),
      ontimeout: null as null | (() => void),
      open: jest.fn(),
      send: jest.fn()
    };
    jest
      .spyOn(window, 'XMLHttpRequest')
      .mockImplementation(() => request as unknown as XMLHttpRequest);
    return {request, result: getAndEncode(url, options)};
  }

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('waits for completion and encodes the fetched binary rather than interim response data', async () => {
    const {request, result} = requestResource();
    const resolved = jest.fn();
    result.then(resolved);
    request.readyState = 3;
    request.onreadystatechange?.();
    await Promise.resolve();
    expect(resolved).not.toHaveBeenCalled();
    request.readyState = 4;
    request.onreadystatechange?.();
    expect(await result).toBe('dGlsZQ==');
    expect(request.open).toHaveBeenCalledWith('GET', 'https://example.test/tile.png', true);
    expect(request.responseType).toBe('blob');
  });

  test('uses the configured image bytes when the server rejects a resource', async () => {
    const {request, result} = requestResource({imagePlaceholder: 'data:image/png;base64,UE5H'});
    request.status = 404;
    request.readyState = 4;
    request.onreadystatechange?.();
    expect(await result).toBe('UE5H');
  });

  test('reports HTTP failures and returns empty content when the placeholder is malformed', async () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const {request, result} = requestResource({imagePlaceholder: 'not-a-data-url'});
    request.status = 403;
    request.readyState = 4;
    request.onreadystatechange?.();
    expect(await result).toBe('');
    expect(error).toHaveBeenCalledWith(
      'cannot fetch resource: https://example.test/tile.png, status: 403'
    );
  });

  test('uses the placeholder when a resource times out', async () => {
    const {request, result} = requestResource({imagePlaceholder: 'data:image/png;base64,UE5H'});
    expect(request.timeout).toBe(30000);
    request.ontimeout?.();
    expect(await result).toBe('UE5H');
  });

  test('settles timed-out downloads without a placeholder and reports the failing URL', async () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const {request, result} = requestResource();
    request.ontimeout?.();
    expect(await result).toBe('');
    expect(error).toHaveBeenCalledWith(
      'timeout of 30000ms occurred while fetching resource: https://example.test/tile.png'
    );
  });

  test('cache busting preserves an existing query and also works for a queryless URL', async () => {
    jest.spyOn(Date.prototype, 'getTime').mockReturnValue(123456);
    for (const [source, expected] of [
      ['https://example.test/tile.png', 'https://example.test/tile.png?123456'],
      ['https://example.test/tile.png?token=abc', 'https://example.test/tile.png?token=abc&123456']
    ]) {
      const {request, result} = requestResource({cacheBust: true}, source);
      expect(request.open).toHaveBeenCalledWith('GET', expected, true);
      request.readyState = 4;
      request.onreadystatechange?.();
      expect(await result).toBe('dGlsZQ==');
    }
  });

  test('image creation waits for decoding and returns the loaded image', async () => {
    const image = document.createElement('img');
    jest.spyOn(window, 'Image').mockImplementation(() => image);
    const result = makeImage('data:image/png;base64,UE5H');
    const resolved = jest.fn();
    result.then(resolved);
    await Promise.resolve();
    expect(resolved).not.toHaveBeenCalled();
    expect(image.src).toBe('data:image/png;base64,UE5H');
    image.dispatchEvent(new Event('load'));
    expect(await result).toBe(image);
  });

  test('image decode failure keeps the error event and export-specific message', async () => {
    const image = document.createElement('img');
    jest.spyOn(window, 'Image').mockImplementation(() => image);
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
    const result = makeImage('data:image/png;base64,broken');
    const failure = new Event('error');
    image.dispatchEvent(failure);
    await expect(result).rejects.toEqual({
      event: failure,
      message: IMAGE_EXPORT_ERRORS.dataUri
    });
  });

  test('PNG blob fallback preserves binary bytes when native toBlob is unavailable', async () => {
    const blob = (await canvasToBlob({toDataURL: () => 'data:image/png;base64,AP+A'})) as Blob;
    expect(blob.type).toBe('image/png');
    expect(blob.size).toBe(3);
    const bytes = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(blob);
    });
    expect(Array.from(new Uint8Array(bytes))).toEqual([0, 255, 128]);
  });

  test('external stylesheets resolve relative and root resources but preserve absolute resources', () => {
    const css =
      '@font-face{src:url(../fonts/font.woff2)} .map{background:url("/tiles/a.png")} .icon{background:url(https://cdn.test/icon.svg)}';
    expect(setStyleSheetBaseHref(css, 'https://example.test/css/map.css')).toBe(
      "@font-face{src:url('https://example.test/fonts/font.woff2')} .map{background:url('https://example.test/tiles/a.png')} .icon{background:url('https://cdn.test/icon.svg')}"
    );
  });
});
