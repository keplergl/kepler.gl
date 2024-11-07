// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// SPDX-License-Identifier: MIT
// Copyriht contributors to the kepler.gl project

import React from 'react';

const MockIcon = () => <div id="provider-icon" />;

export default class MockProvider {
  constructor() {
    // All cloud-providers providers must implement the following properties
    this.name = 'taro';
    this.displayName = 'Taro';
    this.icon = MockIcon;
    this.thumbnail = {width: 100, height: 60};
  }
  login(onSuccess) {
    onSuccess();
    return;
  }
  logout(onSuccess) {
    onSuccess();
    return;
  }
  hasPrivateStorage() {
    return true;
  }
  hasSharingUrl() {
    return true;
  }
  getAccessToken() {
    return true;
  }
  async uploadMap() {
    const promise = new Promise(resolve => {
      () => resolve('done!')();
    });
    await promise;
  }
}
