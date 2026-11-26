// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useReducer, useState} from 'react';
import {fireEvent, waitFor} from '@testing-library/react';
import {IntlProvider} from 'react-intl';

import {
  ActionTypes,
  cleanupExportImage,
  setExportImageDataUri,
  setExportImageSetting
} from '@kepler.gl/actions';
import {EXPORT_IMG_RATIOS, RESOLUTIONS} from '@kepler.gl/constants';
import {messages} from '@kepler.gl/localization';
import {INITIAL_UI_STATE, uiStateUpdaters} from '@kepler.gl/reducers';
import {renderWithTheme} from 'test/helpers/component-jest-utils';

import ExportImageModalFactory, {ExportImageModalProps} from './export-image-modal';

const ExportImageModal = ExportImageModalFactory();
const {cleanupExportImageUpdater, setExportImageSettingUpdater, setExportImageDataUriUpdater} =
  uiStateUpdaters;
type TestAction = ReturnType<typeof setExportImageSetting> | ReturnType<typeof cleanupExportImage>;
function reducer(state: typeof INITIAL_UI_STATE, action: TestAction) {
  return action.type === ActionTypes.SET_EXPORT_IMAGE_SETTING
    ? setExportImageSettingUpdater(state, action)
    : cleanupExportImageUpdater(state);
}

function ControlledModal({open = true}: {open?: boolean}) {
  const [state, dispatch] = useReducer(reducer, INITIAL_UI_STATE);
  const update = useCallback<ExportImageModalProps['onUpdateImageSetting']>(
    settings => dispatch(setExportImageSetting(settings)),
    []
  );
  const cleanup = useCallback(() => dispatch(cleanupExportImage()), []);
  return open ? (
    <IntlProvider locale="en" messages={messages.en}>
      <ExportImageModal
        exportImage={state.exportImage}
        mapW={1200}
        mapH={800}
        onUpdateImageSetting={update}
        cleanupExportImage={cleanup}
      />
    </IntlProvider>
  ) : null;
}

test('custom dimension help is available on focus and describes both inputs', async () => {
  const {getByRole, getByLabelText, findByText} = renderWithTheme(<ControlledModal />);
  fireEvent.click(getByRole('button', {name: 'Custom'}));
  const help = getByLabelText(/Enter whole pixels/);
  const description = help.getAttribute('aria-label')!;
  expect(getByLabelText('Width (px)')).toHaveAccessibleDescription(description);
  expect(getByLabelText('Height (px)')).toHaveAccessibleDescription(description);

  fireEvent.focus(help);
  const tooltip = await findByText(description, {selector: 'div'});
  await waitFor(() => expect(tooltip).toBeVisible());
  fireEvent.blur(help);
});

test('preset resolution retains its accessible label without a separate heading', () => {
  const {getByRole} = renderWithTheme(<ControlledModal />);
  fireEvent.click(getByRole('button', {name: '4:3'}));
  const resolution = getByRole('combobox', {name: 'Resolution'});
  fireEvent.change(resolution, {target: {value: '1600x1200'}});
  expect(resolution).toHaveValue('1600x1200');
});

test('applies exact custom dimensions only when requested, without changing presets', () => {
  const {getByRole, getByLabelText, getByText, queryByLabelText} = renderWithTheme(
    <ControlledModal />
  );
  fireEvent.click(getByRole('button', {name: 'Custom'}));
  const width = getByLabelText('Width (px)');
  const height = getByLabelText('Height (px)');
  const apply = getByRole('button', {name: 'Update preview'});
  fireEvent.change(width, {target: {value: '1234'}});
  fireEvent.change(height, {target: {value: '789'}});
  expect(getByText(/pixel x/)).not.toHaveTextContent('1234 pixel x 789 pixel');
  fireEvent.click(apply);
  expect(getByText(/pixel x/)).toHaveTextContent('1234 pixel x 789 pixel');

  fireEvent.change(width, {target: {value: '8192'}});
  fireEvent.change(height, {target: {value: '8192'}});
  expect(apply).toBeDisabled();
  expect(getByText(/pixel x/)).toHaveTextContent('1234 pixel x 789 pixel');

  fireEvent.change(width, {target: {value: '5000'}});
  fireEvent.change(height, {target: {value: '5000'}});
  fireEvent.click(apply);
  expect(getByText(/pixel x/)).toHaveTextContent('5000 pixel x 5000 pixel');

  fireEvent.click(getByRole('button', {name: 'Original Screen'}));
  expect(queryByLabelText('Width (px)')).not.toBeInTheDocument();
  fireEvent.click(getByRole('button', {name: 'Custom'}));
  expect(getByLabelText('Width (px)')).toHaveValue(5000);
});

test('applying custom dimensions discards the old download and leaves thumbnail sizing intact', () => {
  const oldState = {
    ...INITIAL_UI_STATE,
    exportImage: {...INITIAL_UI_STATE.exportImage, imageDataUri: 'data:image/png;base64,AA=='}
  };
  const custom = reducer(
    oldState,
    setExportImageSetting({
      ratio: EXPORT_IMG_RATIOS.CUSTOM,
      resolution: RESOLUTIONS.ONE_X,
      mapW: 1200,
      mapH: 800,
      customDimensions: {width: 1234, height: 789}
    })
  );
  expect(custom.exportImage).toMatchObject({
    imageDataUri: '',
    processing: true,
    imageSize: {imageW: 1234, imageH: 789, scale: 789 / 800}
  });
  expect(
    reducer(custom, setExportImageSetting({customDimensions: {width: 10.5, height: 20}}))
  ).toBe(custom);

  const thumbnail = reducer(
    reducer(custom, cleanupExportImage()),
    setExportImageSetting({ratio: EXPORT_IMG_RATIOS.CUSTOM, mapW: 400, mapH: 300})
  );
  expect(thumbnail.exportImage.imageSize).toEqual({
    imageW: 400,
    imageH: 300,
    scale: 1,
    zoomOffset: 0
  });
});

test('reopening the PNG modal restores the applied custom dimensions', () => {
  function ReopenModal() {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button onClick={() => setOpen(value => !value)}>Toggle modal</button>
        <ControlledModal open={open} />
      </>
    );
  }
  const {getByRole, getByLabelText, getByText} = renderWithTheme(<ReopenModal />);
  fireEvent.click(getByRole('button', {name: 'Custom'}));
  fireEvent.change(getByLabelText('Width (px)'), {target: {value: '1234'}});
  fireEvent.change(getByLabelText('Height (px)'), {target: {value: '789'}});
  fireEvent.click(getByRole('button', {name: 'Update preview'}));
  fireEvent.click(getByRole('button', {name: 'Toggle modal'}));
  fireEvent.click(getByRole('button', {name: 'Toggle modal'}));

  expect(getByLabelText('Width (px)')).toHaveValue(1234);
  expect(getByLabelText('Height (px)')).toHaveValue(789);
  expect(getByText(/pixel x/)).toHaveTextContent('1234 pixel x 789 pixel');
});

test('switching to and from Custom at the same size accepts an identical PNG and finishes processing', () => {
  const imageDataUri = 'data:image/png;base64,AA==';
  let state = reducer(
    INITIAL_UI_STATE,
    setExportImageSetting({mapW: 1200, mapH: 800, resolution: RESOLUTIONS.ONE_X})
  );
  state = setExportImageDataUriUpdater(state, setExportImageDataUri(imageDataUri));
  const imageSize = state.exportImage.imageSize;

  for (const ratio of [EXPORT_IMG_RATIOS.CUSTOM, EXPORT_IMG_RATIOS.SCREEN]) {
    state = reducer(
      state,
      setExportImageSetting({ratio, customDimensions: {width: 1200, height: 800}})
    );
    expect(state.exportImage.imageSize).toEqual(imageSize);
    expect(state.exportImage).toMatchObject({processing: true, imageDataUri: ''});
    state = setExportImageDataUriUpdater(state, setExportImageDataUri(imageDataUri));
    expect(state.exportImage).toMatchObject({processing: false, imageDataUri});
  }
});
