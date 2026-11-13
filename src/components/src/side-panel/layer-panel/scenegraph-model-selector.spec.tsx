// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState} from 'react';
import {fireEvent, screen, within} from '@testing-library/react';
import {IntlWrapper, renderWithTheme} from 'test/helpers/component-jest-utils';
import {CUSTOM_SCENEGRAPH_MODEL_ID, DEFAULT_SCENEGRAPH_MODEL_ID} from '@kepler.gl/constants';
import ScenegraphModelSelectorFactory, {
  SCENEGRAPH_3D_MODEL_OPTIONS,
  ScenegraphModelSelectorProps
} from './scenegraph-model-selector';
import LayerTypeListItemFactory from './layer-type-list-item';
import LayerTypeDropdownListFactory from './layer-type-dropdown-list';

const Selector = ScenegraphModelSelectorFactory(
  LayerTypeListItemFactory(),
  LayerTypeDropdownListFactory()
);
type Props = Omit<ScenegraphModelSelectorProps, 'theme'>;
const custom = (url: string) => ({
  scenegraph: CUSTOM_SCENEGRAPH_MODEL_ID,
  scenegraphCustomModelUrl: url
});
const source = (name: string) => screen.getByLabelText(name);
const input = () => screen.getByRole('textbox');
const fileInput = () => document.querySelector('input[type="file"]') as HTMLInputElement;

function renderSelector(props: Partial<Props> = {}) {
  const onChange = jest.fn();
  function Editor() {
    const [config, setConfig] = useState({
      scenegraph: props.selected ?? 'airplane',
      scenegraphCustomModelUrl: props.customModelUrl ?? ''
    });
    return (
      <Selector
        {...props}
        selected={config.scenegraph}
        customModelUrl={config.scenegraphCustomModelUrl}
        onChange={next => {
          onChange(next);
          setConfig(previous => ({...previous, ...next}));
        }}
      />
    );
  }
  return {
    ...renderWithTheme(
      <IntlWrapper>
        <Editor />
      </IntlWrapper>
    ),
    onChange
  };
}

beforeAll(() => {
  window.IntersectionObserver = class {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
    takeRecords() {
      return [];
    }
    root = null;
    rootMargin = '';
    thresholds = [];
  };
});

afterEach(() => jest.restoreAllMocks());

test('keeps the URL draft and gallery choice separate when switching sources', () => {
  const {onChange} = renderSelector();
  expect(source('Model')).toBeChecked();
  fireEvent.click(source('Model'));
  expect(onChange).not.toHaveBeenCalled();

  fireEvent.mouseDown(input());
  expect(onChange).toHaveBeenLastCalledWith(custom(''));
  fireEvent.change(input(), {target: {value: 'https://example.com/model.glb'}});
  expect(onChange).toHaveBeenCalledTimes(1);
  fireEvent.blur(input());
  expect(onChange).toHaveBeenLastCalledWith(custom('https://example.com/model.glb'));

  fireEvent.click(source('Model'));
  expect(onChange).toHaveBeenLastCalledWith({scenegraph: 'airplane'});
  fireEvent.blur(input());
  expect(onChange).toHaveBeenCalledTimes(3);
  fireEvent.click(source('URL'));
  expect(input()).toHaveValue('https://example.com/model.glb');
  expect(onChange).toHaveBeenLastCalledWith(custom('https://example.com/model.glb'));
});

test('selects gallery models through the real dropdown without offering the custom source', () => {
  const {container, onChange} = renderSelector({selected: CUSTOM_SCENEGRAPH_MODEL_ID});
  const dropdown = container.querySelector('.layer-config__type') as HTMLElement;
  fireEvent.mouseDown(dropdown);
  expect(source('Model')).toBeChecked();
  const trigger = within(dropdown).getByRole('button');
  fireEvent.keyDown(trigger, {key: 'Enter', keyCode: 13});
  const menu = document.querySelector('.list-selector') as HTMLElement;
  expect(menu).not.toBeNull();
  expect(within(menu).queryByText('Custom')).not.toBeInTheDocument();
  fireEvent.click(within(menu).getByText('Car'));
  expect(onChange).toHaveBeenLastCalledWith({scenegraph: 'car'});
  fireEvent.click(source('URL'));
  fireEvent.click(source('Model'));
  expect(onChange).toHaveBeenLastCalledWith({scenegraph: 'car'});
});

test.each([
  ['blob:saved-model', 'Local file'],
  ['data:model/gltf-binary;base64,AAAA', 'Local file'],
  ['https://example.com/saved.glb', 'URL']
])('restores a saved custom source %s without emitting a change', (url, name) => {
  const {onChange} = renderSelector({selected: CUSTOM_SCENEGRAPH_MODEL_ID, customModelUrl: url});
  expect(source(name)).toBeChecked();
  expect(input()).toHaveValue(name === 'URL' ? url : '');
  expect(onChange).not.toHaveBeenCalled();
  fireEvent.click(source('Model'));
  fireEvent.click(source(name));
  expect(onChange).toHaveBeenLastCalledWith(custom(url));
});

test('chooses files, cancels safely, and revokes only the replaced blob', () => {
  const create = jest
    .spyOn(URL, 'createObjectURL')
    .mockReturnValueOnce('blob:first')
    .mockReturnValueOnce('blob:second');
  const originalRevoke = URL.revokeObjectURL;
  const revoke = jest.fn();
  URL.revokeObjectURL = revoke;
  try {
    const {onChange} = renderSelector();
    const button = screen.getByRole('button', {name: 'Choose file'});
    const picker = jest.spyOn(fileInput(), 'click');
    fireEvent.click(button);
    expect(source('Local file')).toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith(custom(''));
    expect(picker).not.toHaveBeenCalled();
    fireEvent.click(button);
    expect(picker).toHaveBeenCalledTimes(1);
    fireEvent.change(fileInput(), {target: {files: []}});
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(create).not.toHaveBeenCalled();

    const first = new File(['model'], 'first.glb');
    fireEvent.change(fileInput(), {target: {files: [first]}});
    expect(create).toHaveBeenLastCalledWith(first);
    expect(fileInput().value).toBe('');
    expect(onChange).toHaveBeenLastCalledWith(custom('blob:first'));
    expect(screen.getByRole('button', {name: 'first.glb'})).toHaveAttribute('title', 'first.glb');
    fireEvent.click(source('URL'));
    expect(revoke).not.toHaveBeenCalled();
    fireEvent.click(source('Local file'));
    expect(onChange).toHaveBeenLastCalledWith(custom('blob:first'));
    const second = new File(['replacement'], 'second.gltf');
    fireEvent.change(fileInput(), {target: {files: [second]}});
    expect(revoke).toHaveBeenCalledTimes(1);
    expect(revoke).toHaveBeenCalledWith('blob:first');
    expect(onChange).toHaveBeenLastCalledWith(custom('blob:second'));
    expect(screen.getByRole('button', {name: 'second.gltf'})).toBeInTheDocument();
  } finally {
    URL.revokeObjectURL = originalRevoke;
  }
});

test.each([
  [SCENEGRAPH_3D_MODEL_OPTIONS, DEFAULT_SCENEGRAPH_MODEL_ID],
  [SCENEGRAPH_3D_MODEL_OPTIONS.filter(option => option.id === 'car'), 'car'],
  [[], '']
])('uses an available gallery fallback for a saved custom model', (options, expected) => {
  const {onChange} = renderSelector({selected: CUSTOM_SCENEGRAPH_MODEL_ID, options});
  fireEvent.click(source('Model'));
  expect(onChange).toHaveBeenLastCalledWith({scenegraph: expected});
});

test('does not switch sources while disabled', () => {
  const {onChange} = renderSelector({disabled: true});
  fireEvent.click(source('URL'));
  fireEvent.click(source('Local file'));
  fireEvent.mouseDown(input());
  expect(source('Model')).toBeChecked();
  expect(onChange).not.toHaveBeenCalled();
});

test.each([
  ['blob:saved-model', [['blob:saved-model']]],
  ['data:model/gltf-binary;base64,AAAA', []]
] as const)('replaces a restored local model %s without revoking data URLs', (saved, revoked) => {
  jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:replacement');
  const originalRevoke = URL.revokeObjectURL;
  const revoke = jest.fn();
  URL.revokeObjectURL = revoke;
  try {
    const {onChange} = renderSelector({
      selected: CUSTOM_SCENEGRAPH_MODEL_ID,
      customModelUrl: saved
    });
    fireEvent.change(fileInput(), {target: {files: [new File(['model'], 'replacement.glb')]}});
    expect(onChange).toHaveBeenLastCalledWith(custom('blob:replacement'));
    expect(revoke.mock.calls).toEqual(revoked);
  } finally {
    URL.revokeObjectURL = originalRevoke;
  }
});
