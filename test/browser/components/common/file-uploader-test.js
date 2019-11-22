// Copyright (c) 2019 Uber Technologies, Inc.
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
import test from 'tape';
import sinon from 'sinon';
import {mountWithTheme} from 'test/helpers/component-utils';

import FileUplad, {
  WarningMsg
} from 'components/common/file-uploader/file-upload';
import FileDrop from 'components/common/file-uploader/file-drop';
import UploadButton from 'components/common/file-uploader/upload-button';

test('Components -> FileUploader.render', t => {
  let wrapper;

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(<FileUplad />);
  }, 'Show not fail without data');

  t.equal(wrapper.find(FileDrop).length, 1, 'should render FileUploader');
  t.equal(wrapper.find(UploadButton).length, 1, 'should render UploadButton');

  t.end();
});

test('Components -> FileUpload.onDrop', t => {
  const mockFiles = [{type: 'text/csv', name: 'tst-file.csv'}];
  const onFileUpload = sinon.spy(arg => {
    t.deepEqual(arg, mockFiles, 'should call onFileUpload with files');
  });
  const stopPropagation = sinon.spy();
  const wrapper = mountWithTheme(<FileUplad onFileUpload={onFileUpload} />);

  t.equal(wrapper.find(FileDrop).length, 1, 'should render FileUploader');

  const FileDropDiv = wrapper.find('.file-uploader__file-drop').at(0);
  // mock file drop event
  const mockEvent = {
    stopPropagation,
    dataTransfer: {
      types: ['Files'],
      files: mockFiles
    }
  };

  FileDropDiv.simulate('drop', mockEvent);

  t.ok(onFileUpload.called, 'onFileUpload should get called');
  t.ok(stopPropagation.called, 'stopPropagation should get called');
  const files = wrapper.state().files;

  t.deepEqual(files, mockFiles, 'should set files to state');
  const uploadMsg = wrapper.find('.file-uploader__message');

  t.end();
});

test('Components -> FileUpload.onDrop -> render loading msg', t => {
  const mockFiles = [{type: 'text/csv', name: 'tst-file.csv'}];
  const onFileUpload = sinon.spy(arg => {
    t.deepEqual(arg, mockFiles, 'should call onFileUpload with files');
  });

  const wrapper = mountWithTheme(
    <FileUplad onFileUpload={onFileUpload} fileLoading />
  );

  const FileDropDiv = wrapper.find('.file-uploader__file-drop').at(0);
  // mock file drop event
  const mockEvent = {
    stopPropagation: () => {},
    dataTransfer: {
      types: ['Files'],
      files: mockFiles
    }
  };

  FileDropDiv.simulate('drop', mockEvent);

  t.ok(onFileUpload.called, 'onFileUpload should get called');
  const uploadMsg = wrapper
    .find('.file-uploader__message')
    .at(0)
    .html();

  t.ok(uploadMsg.includes('tst-file.csv', 'should render upload file msg'));

  t.end();
});

test('Components -> FileUpload.onDrop -> render error msg', t => {
  const mockFiles = [{type: 'png', name: 'tst-file.png'}];
  const onFileUpload = sinon.spy(arg => {
    t.deepEqual(arg, mockFiles, 'should call onFileUpload with files');
  });

  const wrapper = mountWithTheme(<FileUplad onFileUpload={onFileUpload} />);

  const FileDropDiv = wrapper.find('.file-uploader__file-drop').at(0);
  // mock file drop event
  const mockEvent = {
    stopPropagation: () => {},
    dataTransfer: {
      types: ['Files'],
      files: mockFiles
    }
  };

  FileDropDiv.simulate('drop', mockEvent);

  t.ok(onFileUpload.notCalled, 'onFileUpload should not get called');
  t.ok(wrapper.find(WarningMsg), 'should render WarningMsg');

  const errorFiles = wrapper.state().errorFiles;
  t.deepEqual(errorFiles, ['tst-file.png'], 'should save files to errorFiles');

  t.end();
});

test('Components -> FileUpload.dragOver', t => {
  const mockFiles = [{type: 'text/csv', name: 'tst-file.csv'}];
  const onFileUpload = sinon.spy(arg => {
    t.deepEqual(arg, mockFiles, 'should call onFileUpload with files');
  });
  const wrapper = mountWithTheme(<FileUplad onFileUpload={onFileUpload} />);

  t.equal(wrapper.find(FileDrop).length, 1, 'should render FileUploader');

  const FileDropDiv = wrapper.find('.file-uploader__file-drop').at(0);
  // mock file drop event
  const mockEvent = {
    dataTransfer: {
      types: ['Files'],
      files: mockFiles
    }
  };

  FileDropDiv.simulate('dragover', mockEvent);
  const dragOver = wrapper.state().dragOver;
  t.ok(dragOver, 'dragOver should be set to true');
  t.end();
});

test('Components -> FileUpload.dragLeave', t => {
  const mockFiles = [{type: 'text/csv', name: 'tst-file.csv'}];
  const onFileUpload = sinon.spy(arg => {
    t.deepEqual(arg, mockFiles, 'should call onFileUpload with files');
  });
  const wrapper = mountWithTheme(<FileUplad onFileUpload={onFileUpload} />);

  t.equal(wrapper.find(FileDrop).length, 1, 'should render FileUploader');

  const FileDropDiv = wrapper.find('.file-uploader__file-drop').at(0);
  // mock file drop event
  const mockEvent = {
    dataTransfer: {
      types: ['Files'],
      files: mockFiles
    }
  };

  FileDropDiv.simulate('dragleave', mockEvent);
  const dragOver = wrapper.state().dragOver;
  t.notOk(dragOver, 'dragOver should be set to false');
  t.end();
});

test('Components -> UploadButton fileInput', t => {
  const mockFiles = [{type: 'text/csv', name: 'tst-file.csv'}];
  const onFileUpload = sinon.spy(arg => {
    t.deepEqual(arg, mockFiles, 'should call onFileUpload with files');
  });
  const wrapper = mountWithTheme(<FileUplad onFileUpload={onFileUpload} />);
  const uploadButton = wrapper.find(UploadButton);
  t.equal(uploadButton.length, 1, 'should render UploadButton');
  const input = uploadButton.find('input');

  // simulate click
  uploadButton.find('.file-upload__upload-button-span').simulate('click');
  
  // mock file drop event
  const mockEvent = {
    target: {
      files: mockFiles
    }
  };

  // change iwthout file?
  input.simulate('change', {target: {files: null}});
  t.ok(onFileUpload.notCalled, 'onFileUpload should not get called');

  input.simulate('change', mockEvent);
  t.ok(onFileUpload.called, 'onFileUpload should get called');
  const files = wrapper.state().files;

  t.deepEqual(files, mockFiles, 'should set files to state');

  t.end();
});