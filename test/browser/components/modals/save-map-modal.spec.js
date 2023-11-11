import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import {SaveMapModalFactory} from '@kepler.gl/components';
import {renderWithTheme} from '../../../helpers/component-jest-utils';

const SaveMapModal = SaveMapModalFactory();

describe('SaveMapModal', () => {
  const defaultProps = {
    mapInfo: {
      title: 'Test Map',
      description: 'test'
    },
    exportImage: jest.fn(),
    isProviderLoading: false,
    providerError: null,
    onUpdateImageSetting: jest.fn(),
    cleanupExportImage: jest.fn(),
    onSetMapInfo: jest.fn(),
    onCancel: jest.fn(),
    onConfirm: jest.fn(),
  };

  test('renders SaveMapModal component', () => {
    const { getByText } = renderWithTheme(<SaveMapModal {...defaultProps} />);
    expect(getByText('modal.button.save')).toBeInTheDocument();

  });

});
