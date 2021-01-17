// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

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
  async uploadMap(args) {
    const promise = new Promise((resolve, reject) => {
      () => resolve('done!')();
    });
    await promise;
  }
}
