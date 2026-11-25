// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useReducer} from 'react';
import {fireEvent} from '@testing-library/react';
import {IntlProvider} from 'react-intl';

import {ActionTypes, cleanupExportImage, setExportImageSetting} from '@kepler.gl/actions';
import {EXPORT_IMG_RATIOS, RESOLUTIONS} from '@kepler.gl/constants';
import {messages} from '@kepler.gl/localization';
import {INITIAL_UI_STATE, uiStateUpdaters} from '@kepler.gl/reducers';
import {renderWithTheme} from 'test/helpers/component-jest-utils';

import ExportImageModalFactory, {ExportImageModalProps} from './export-image-modal';

const ExportImageModal = ExportImageModalFactory();
const {cleanupExportImageUpdater, setExportImageSettingUpdater} = uiStateUpdaters;
type TestAction = ReturnType<typeof setExportImageSetting> | ReturnType<typeof cleanupExportImage>;
function reducer(state: typeof INITIAL_UI_STATE, action: TestAction) {
  return action.type === ActionTypes.SET_EXPORT_IMAGE_SETTING
    ? setExportImageSettingUpdater(state, action)
    : cleanupExportImageUpdater(state);
}

function ControlledModal() {
  const [state, dispatch] = useReducer(reducer, INITIAL_UI_STATE);
  const update = useCallback<ExportImageModalProps['onUpdateImageSetting']>(
    settings => dispatch(setExportImageSetting(settings)),
    []
  );
  const cleanup = useCallback(() => dispatch(cleanupExportImage()), []);
  return (
    <IntlProvider locale="en" messages={messages.en}>
      <ExportImageModal
        exportImage={state.exportImage}
        mapW={1200}
        mapH={800}
        onUpdateImageSetting={update}
        cleanupExportImage={cleanup}
      />
    </IntlProvider>
  );
}

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
