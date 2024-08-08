// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import test from 'tape';
import sinon from 'sinon';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';

import {FileUpload, WarningMsg, FileDrop, UploadButton} from '@kepler.gl/components';

test('Components -> FileUploader.render', t => {
  let wrapper;

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <FileUpload />
      </IntlWrapper>
    );
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
  const wrapper = mountWithTheme(
    <IntlWrapper>
      <FileUpload onFileUpload={onFileUpload} fileExtensions={['csv']} />
    </IntlWrapper>
  );

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
  const files = wrapper.find(FileUpload).children().first().state().files;

  t.deepEqual(files, mockFiles, 'should set files to state');

  t.end();
});

test('Components -> FileUpload.onDrop -> render loading msg', t => {
  const mockFiles = [{type: 'text/csv', name: 'tst-file.csv'}];
  const onFileUpload = sinon.spy(arg => {
    t.deepEqual(arg, mockFiles, 'should call onFileUpload with files');
  });

  const mockFileProgress = {
    'tst-file.csv': {
      fileName: 'tst-file.csv',
      percent: 1,
      message: 'Done'
    }
  };
  const wrapper = mountWithTheme(
    <IntlWrapper>
      <FileUpload
        fileExtensions={['csv', 'json', 'geojson']}
        onFileUpload={onFileUpload}
        fileLoading={{fileCache: [], filesToLoad: [], onFinish: () => {}}}
        fileLoadingProgress={mockFileProgress}
      />
    </IntlWrapper>
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

  const uploadMsg = wrapper.find('.file-upload-progress__message').at(0).html();
  t.comment(uploadMsg);
  t.ok(uploadMsg.includes('tst-file.csv', 'should render upload file msg'));

  t.end();
});

test('Components -> FileUpload.onDrop -> render error msg', t => {
  const mockFiles = [{type: 'png', name: 'tst-file.png'}];
  const onFileUpload = sinon.spy(arg => {
    t.deepEqual(arg, mockFiles, 'should call onFileUpload with files');
  });

  const wrapper = mountWithTheme(
    <IntlWrapper>
      <FileUpload onFileUpload={onFileUpload} />
    </IntlWrapper>
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

  t.ok(onFileUpload.notCalled, 'onFileUpload should not get called');
  t.ok(wrapper.find(WarningMsg), 'should render WarningMsg');

  const errorFiles = wrapper.find(FileUpload).children().first().state().errorFiles;
  t.deepEqual(errorFiles, ['tst-file.png'], 'should save files to errorFiles');

  t.end();
});

test('Components -> FileUpload.dragOver', t => {
  const mockFiles = [{type: 'text/csv', name: 'tst-file.csv'}];
  const onFileUpload = sinon.spy(arg => {
    t.deepEqual(arg, mockFiles, 'should call onFileUpload with files');
  });
  const wrapper = mountWithTheme(
    <IntlWrapper>
      <FileUpload onFileUpload={onFileUpload} />
    </IntlWrapper>
  );

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
  const dragOver = wrapper.find(FileUpload).children().first().state().dragOver;
  t.ok(dragOver, 'dragOver should be set to true');
  t.end();
});

test('Components -> FileUpload.dragLeave', t => {
  const mockFiles = [{type: 'text/csv', name: 'tst-file.csv'}];
  const onFileUpload = sinon.spy(arg => {
    t.deepEqual(arg, mockFiles, 'should call onFileUpload with files');
  });
  const wrapper = mountWithTheme(
    <IntlWrapper>
      <FileUpload onFileUpload={onFileUpload} />
    </IntlWrapper>
  );

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
  const dragOver = wrapper.find(FileUpload).children().first().state().dragOver;
  t.notOk(dragOver, 'dragOver should be set to false');
  t.end();
});

test('Components -> UploadButton fileInput', t => {
  const mockFiles = [{type: 'text/csv', name: 'tst-file.csv'}];
  const onFileUpload = sinon.spy(arg => {
    t.deepEqual(arg, mockFiles, 'should call onFileUpload with files');
  });
  const wrapper = mountWithTheme(
    <IntlWrapper>
      <FileUpload onFileUpload={onFileUpload} fileExtensions={['csv']} />
    </IntlWrapper>
  );
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
  const files = wrapper.find(FileUpload).children().first().state().files;

  t.deepEqual(files, mockFiles, 'should set files to state');

  t.end();
});
