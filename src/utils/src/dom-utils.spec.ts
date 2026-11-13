// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {processClone} from './dom-utils';

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
