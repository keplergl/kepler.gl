// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {PanelHeaderDropdownFactory, Icons} from '..';

const CloudStorageItems = [
  {
    label: 'Save',
    icon: Icons.Save2,
    key: 'data',
    onClick: props => props.onSaveMap
  },
  {
    label: 'Settings',
    icon: Icons.Gear,
    key: 'settings',
    onClick: props => props.onExportData
  }
];

const PanelHeaderDropdown = PanelHeaderDropdownFactory();

const CloudStorageDropdown = ({show, onClose}) => {
  return (
    <PanelHeaderDropdown
      items={CloudStorageItems}
      show={show}
      onClose={onClose}
      id="cloud-storage"
    />
  );
};

export default CloudStorageDropdown;
