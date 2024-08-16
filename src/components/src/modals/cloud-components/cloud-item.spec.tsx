// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck
import React from 'react';
import {fireEvent} from '@testing-library/react';
import {renderWithTheme} from '../../../../../test/helpers/component-jest-utils';

import {CloudItem} from './cloud-item';
import moment from 'moment';
const nop = () => {
  return;
};
describe('CloudItem', () => {
  const mockVis = {
    title: 'Test Title',
    description: 'Test Description',
    lastModification: new Date().toISOString(),
    thumbnail: 'test-thumbnail.jpg',
    privateMap: true
  };

  it('renders without crashing', () => {
    const {getByText} = renderWithTheme(<CloudItem vis={mockVis} onClick={nop} />);
    expect(getByText('Test Title')).toBeInTheDocument();
  });

  it('renders PrivacyBadge for private maps', () => {
    const {getByText} = renderWithTheme(
      <CloudItem vis={{...mockVis, privateMap: true}} onClick={nop} />
    );
    expect(getByText('Private')).toBeInTheDocument();
  });

  it('does not render PrivacyBadge for public maps', () => {
    const {queryByText} = renderWithTheme(
      <CloudItem vis={{...mockVis, privateMap: false}} onClick={nop} />
    );
    expect(queryByText('Private')).toBeNull();
  });

  it('displays correct thumbnail image', () => {
    const {getByRole} = renderWithTheme(<CloudItem vis={mockVis} onClick={nop} />);
    expect(getByRole('thumbnail-wrapper').style.backgroundImage).toContain('test-thumbnail.jpg');
  });

  it('displays MapIcon when no thumbnail is provided', () => {
    const {getByRole} = renderWithTheme(
      <CloudItem vis={{...mockVis, thumbnail: null}} onClick={nop} />
    );
    expect(getByRole('map-icon')).toBeInTheDocument();
  });

  it('displays title, description, and last modification date', () => {
    const {getByText} = renderWithTheme(<CloudItem vis={mockVis} onClick={nop} />);
    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('Test Description')).toBeInTheDocument();
    expect(
      getByText(`Last modified ${moment.utc(mockVis.lastModification).fromNow()}`)
    ).toBeInTheDocument();
  });

  it('calls onClick when component is clicked', () => {
    const onClickMock = jest.fn();
    const {getByText} = renderWithTheme(<CloudItem vis={mockVis} onClick={onClickMock} />);
    fireEvent.click(getByText('Test Title'));
    expect(onClickMock).toHaveBeenCalled();
  });
});
