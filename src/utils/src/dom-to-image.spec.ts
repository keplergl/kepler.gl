// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import domtoimage from './dom-to-image';
import * as domUtils from './dom-utils';

jest.mock('./dom-utils', () => ({
  ...jest.requireActual('./dom-utils'),
  // Image decoding and network transfer are browser boundaries, not jsdom capabilities.
  makeImage: jest.fn(),
  getAndEncode: jest.fn()
}));

const decodeSvg = (uri: string) => Buffer.from(uri.split(',')[1], 'base64').toString('utf8');
const parseSvg = (uri: string) => new DOMParser().parseFromString(decodeSvg(uri), 'image/svg+xml');

function sourceNode() {
  const node = document.createElement('div');
  node.style.cssText = 'border: 0px solid black;';
  Object.defineProperties(node, {scrollWidth: {value: 30}, scrollHeight: {value: 20}});
  return node;
}

beforeEach(() => {
  // jsdom's XMLSerializer duplicates a manually set xmlns on HTML nodes.
  // Keep native browser serialization outside this DOM pipeline unit test.
  const serialize = XMLSerializer.prototype.serializeToString;
  jest.spyOn(XMLSerializer.prototype, 'serializeToString').mockImplementation(node => {
    const copy = node.cloneNode(true) as Element;
    copy.removeAttribute('xmlns');
    return serialize.call(new XMLSerializer(), copy);
  });
  const getComputedStyle = window.getComputedStyle.bind(window);
  jest
    .spyOn(window, 'getComputedStyle')
    .mockImplementation((element, pseudo) =>
      pseudo ? document.createElement('div').style : getComputedStyle(element)
    );
  jest.mocked(domUtils.makeImage).mockImplementation(async uri => {
    const image = document.createElement('img');
    image.src = uri;
    return image;
  });
  jest.mocked(domUtils.getAndEncode).mockResolvedValue('ZW1iZWRkZWQ=');
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
  document.head.innerHTML = '';
});

describe('DOM image export pipeline', () => {
  it('exports Unicode, preserves child order, and excludes filtered subtrees but not the root', async () => {
    const node = sourceNode();
    node.innerHTML = '<p>Київ 🌍</p><section data-exclude><b>private</b></section><p>last</p>';
    const original = node.outerHTML;
    const filter = jest.fn(
      child => !(child instanceof Element && child.hasAttribute('data-exclude'))
    );
    const svg = parseSvg(await domtoimage.toSvg(node, {filter, escapeXhtmlForWebpack: false}));
    expect(svg.querySelector('parsererror')).toBeNull();
    expect(svg.documentElement.getAttribute('width')).toBe('30');
    expect(svg.documentElement.getAttribute('height')).toBe('20');
    expect(Array.from(svg.querySelectorAll('p')).map(p => p.textContent)).toEqual([
      'Київ 🌍',
      'last'
    ]);
    expect(svg.querySelector('section')).toBeNull();
    expect(filter).not.toHaveBeenCalledWith(node);
    expect(node.outerHTML).toBe(original);
  });

  it('applies export-only dimensions, background and style, then resets fetch options for the next export', async () => {
    const node = sourceNode();
    const svg = parseSvg(
      await domtoimage.toSvg(node, {
        width: 80,
        height: 40,
        bgcolor: 'red',
        style: {opacity: '0.5'},
        imagePlaceholder: 'data:image/png;base64,AA==',
        cacheBust: true
      })
    );
    const clone = svg.querySelector('foreignObject > div') as HTMLElement;
    expect(svg.documentElement.getAttribute('width')).toBe('80');
    expect(svg.documentElement.getAttribute('height')).toBe('40');
    expect(clone.style.width).toBe('80px');
    expect(clone.style.backgroundColor).toBe('red');
    expect(clone.style.opacity).toBe('0.5');
    expect(node.style.width).toBe('');
    expect(domtoimage.impl.options.cacheBust).toBe(true);
    await domtoimage.toSvg(node, {});
    expect(domtoimage.impl.options).toEqual({imagePlaceholder: undefined, cacheBust: false});
  });

  it('replaces canvas descendants with their encoded image while retaining sibling order', async () => {
    const node = sourceNode();
    node.innerHTML = '<span>before</span><canvas></canvas><span>after</span>';
    jest
      .spyOn(HTMLCanvasElement.prototype, 'toDataURL')
      .mockReturnValue('data:image/png;base64,AA==');
    const svg = parseSvg(await domtoimage.toSvg(node, {}));
    const clone = svg.querySelector('foreignObject > div') as HTMLElement;
    expect(
      Array.from(clone.children)
        .slice(0, 3)
        .map(child => child.tagName)
    ).toEqual(['span', 'img', 'span']);
    expect(clone.querySelector('img')?.getAttribute('src')).toBe('data:image/png;base64,AA==');
    expect(node.querySelector('canvas')).not.toBeNull();
  });

  it('propagates canvas capture errors instead of exporting an incomplete image', async () => {
    const canvas = document.createElement('canvas');
    const error = new Error('tainted canvas');
    jest.spyOn(canvas, 'toDataURL').mockImplementation(() => {
      throw error;
    });
    await expect(domtoimage.toSvg(canvas, {})).rejects.toBe(error);
  });

  it('embeds font-face resources but ignores ordinary stylesheet images', async () => {
    const style = document.createElement('style');
    style.textContent =
      '@font-face {font-family: Export; src: url("font.woff")} p {background: url("other.png")}';
    document.head.appendChild(style);
    const css = await domtoimage.impl.fontFaces.resolveAll();
    expect(css).toContain('data:application/font-woff;base64,ZW1iZWRkZWQ=');
    expect(css).not.toContain('other.png');
    expect(domUtils.getAndEncode).toHaveBeenCalledTimes(1);
  });

  it('continues exporting when an external stylesheet cannot be fetched', async () => {
    jest
      .spyOn(document, 'styleSheets', 'get')
      .mockReturnValue([{href: 'https://example.test/style.css'}] as unknown as StyleSheetList);
    const originalFetch = window.fetch;
    window.fetch = jest.fn().mockRejectedValue(new Error('offline'));
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
    try {
      const svg = parseSvg(await domtoimage.toSvg(sourceNode(), {}));
      expect(svg.querySelector('foreignObject')).not.toBeNull();
      expect(console.warn).toHaveBeenCalled();
    } finally {
      window.fetch = originalFetch;
    }
  });
});

describe('export resource inlining', () => {
  it('resolves relative resources and replaces repeated URLs without changing other CSS', async () => {
    const get = jest.fn().mockResolvedValue('cGl4ZWw=');
    const css = 'background:url("../tile.png"), url(../tile.png); color: red';
    const result = await domtoimage.impl.inliner.inlineAll(
      css,
      'https://example.test/css/main.css',
      get
    );
    expect(result).toBe(
      'background:url("data:image/png;base64,cGl4ZWw="), url(data:image/png;base64,cGl4ZWw=); color: red'
    );
    expect(get.mock.calls.every(([url]) => url === 'https://example.test/tile.png')).toBe(true);
  });

  it('does not fetch CSS without URLs or resources already embedded as data URLs', async () => {
    const get = jest.fn();
    for (const css of ['color: red', 'src: url(data:application/font-woff;base64,AA==)']) {
      expect(await domtoimage.impl.inliner.inlineAll(css, null, get)).toBe(css);
    }
    expect(get).not.toHaveBeenCalled();
  });

  it('rejects failed resource loading instead of silently dropping the resource', async () => {
    const error = new Error('missing font');
    await expect(
      domtoimage.impl.inliner.inlineAll('src: url(font.woff)', null, () => Promise.reject(error))
    ).rejects.toBe(error);
  });

  it('waits for an inlined image to load and reports decode errors', async () => {
    const image = document.createElement('img');
    image.src = 'https://example.test/picture.png';
    const get = jest.fn().mockResolvedValue('AA==');
    const loaded = domtoimage.impl.images.impl.newImage(image).inline(get);
    // Flush the explicit fetch/encoding chain without real time or network.
    for (let i = 0; i < 5; i++) await Promise.resolve();
    expect(image.src).toBe('data:image/png;base64,AA==');
    image.dispatchEvent(new Event('load'));
    await loaded;
    image.src = 'https://example.test/broken.png';
    const failed = domtoimage.impl.images.impl.newImage(image).inline(get);
    const assertion = failed.catch(error => error);
    for (let i = 0; i < 5; i++) await Promise.resolve();
    image.dispatchEvent(new Event('error'));
    expect(await assertion).toBeInstanceOf(Event);
  });
});

describe('raster export outputs', () => {
  it('draws the SVG over the requested background and encodes PNG and JPEG with quality', async () => {
    const node = sourceNode();
    const context = {fillStyle: '', fillRect: jest.fn(), drawImage: jest.fn()};
    jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(context as unknown as CanvasRenderingContext2D);
    const encode = jest
      .spyOn(HTMLCanvasElement.prototype, 'toDataURL')
      .mockReturnValue('data:image/png;base64,AA==');
    const png = await domtoimage.toPng(node, {width: 80, height: 40, bgcolor: 'red'});
    expect(png).toBe('data:image/png;base64,AA==');
    const canvas = encode.mock.instances[0] as unknown as HTMLCanvasElement;
    expect([canvas.width, canvas.height]).toEqual([80, 40]);
    expect(context.fillStyle).toBe('red');
    expect(context.fillRect).toHaveBeenCalledWith(0, 0, 80, 40);
    expect(context.drawImage).toHaveBeenCalledWith(expect.any(HTMLImageElement), 0, 0);
    expect(context.fillRect.mock.invocationCallOrder[0]).toBeLessThan(
      context.drawImage.mock.invocationCallOrder[0]
    );
    await domtoimage.toJpeg(node, {quality: 0.75});
    expect(encode).toHaveBeenLastCalledWith('image/jpeg', 0.75);
  });

  it('returns pixel data and a PNG blob through the canvas APIs', async () => {
    const pixels = new Uint8ClampedArray([1, 2, 3, 255]);
    const context = {drawImage: jest.fn(), getImageData: jest.fn().mockReturnValue({data: pixels})};
    jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(context as unknown as CanvasRenderingContext2D);
    const blob = new Blob(['png'], {type: 'image/png'});
    jest
      .spyOn(HTMLCanvasElement.prototype, 'toBlob')
      .mockImplementation(callback => callback(blob));
    expect(await domtoimage.toPixelData(sourceNode(), {})).toBe(pixels);
    expect(context.getImageData).toHaveBeenCalledWith(0, 0, 30, 20);
    expect(await domtoimage.toBlob(sourceNode(), {})).toBe(blob);
  });
});
