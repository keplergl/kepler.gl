// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import test from 'tape';
import sinon from 'sinon';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';

import {FileUpload, FileDrop, UploadButton} from '@kepler.gl/components';
import {initApplicationConfig} from '@kepler.gl/utils';

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
  t.ok(uploadMsg.includes('tst-file.csv'), 'should render upload file msg');
  t.ok(
    uploadMsg.includes('upload-file-list__spinner'),
    'should show a spinner in place of the checkbox while the file is still loading'
  );
  t.equal(
    wrapper.find('.upload-file-list').find('Checkbox').length,
    0,
    'should hide the include checkbox until parsing finishes'
  );
  t.equal(
    wrapper.find('.upload-file-list').hostNodes().length,
    1,
    'should list the file beside the drop zone'
  );

  t.end();
});

test('Components -> FileUpload.onDrop keeps earlier files', t => {
  const first = [{type: 'text/csv', name: 'first.csv', size: 10}];
  const second = [{type: 'text/csv', name: 'second.csv', size: 20}];
  const onFileUpload = sinon.spy();
  const wrapper = mountWithTheme(
    <IntlWrapper>
      <FileUpload
        onFileUpload={onFileUpload}
        fileExtensions={['csv']}
        stagedToAdd={[{info: {label: 'kept.csv', format: 'csv'}}]}
      />
    </IntlWrapper>
  );
  const drop = files => {
    wrapper
      .find('.file-uploader__file-drop')
      .at(0)
      .simulate('drop', {
        stopPropagation: () => {},
        dataTransfer: {types: ['Files'], files}
      });
  };

  drop(first);
  drop(second);

  const files = wrapper.find(FileUpload).children().first().state().files;
  t.deepEqual(
    files.map(file => file.name),
    ['first.csv', 'second.csv'],
    'should append dropped files'
  );
  t.deepEqual(onFileUpload.lastCall.args[0], second, 'should upload only the new files');
  const listText = wrapper.find('.upload-file-list').text();
  t.ok(listText.includes('kept.csv'), 'should keep a file staged before this uploader mounted');
  t.ok(listText.includes('first.csv'), 'should keep the first dropped file');
  t.ok(listText.includes('second.csv'), 'should show the latest dropped file');
  const fileChecks = wrapper.find('.upload-file-list').find('Checkbox');
  t.equal(fileChecks.length, 3, 'each dataset card has a checkbox');
  t.equal(fileChecks.at(0).props().checked, true, 'datasets start selected');
  t.equal(
    fileChecks.at(0).find('.upload-file-list__check-label').text(),
    'Include kept.csv',
    'checkbox names the dataset it includes'
  );
  fileChecks.at(0).simulate('change');
  t.equal(
    wrapper.find('.upload-file-list').find('Checkbox').at(0).props().checked,
    false,
    'should let the user deselect a dataset'
  );

  t.end();
});

test('Components -> FileUpload remote URL is staged without downloading', t => {
  const onFileUpload = sinon.spy();
  const onAddRemoteDataset = sinon.spy();
  const wrapper = mountWithTheme(
    <IntlWrapper>
      <FileUpload
        onFileUpload={onFileUpload}
        onAddRemoteDataset={onAddRemoteDataset}
        fileExtensions={['csv']}
        stagedToAdd={[
          {
            info: {label: 'quakes.csv', format: 'row'},
            metadata: {source: 'https://example.com/quakes.csv'}
          }
        ]}
      />
    </IntlWrapper>
  );

  const listText = wrapper.find('.upload-file-list').text();
  t.ok(listText.includes('quakes.csv'), 'should list the remote dataset');
  t.ok(listText.includes('https://example.com/quakes.csv'), 'should show the remote url');

  const urlInput = wrapper.find('.file-uploader__remote-url input').hostNodes().first();
  urlInput.simulate('change', {target: {value: 'https://example.com/cities.csv'}});
  wrapper.find('.file-uploader__remote-add').hostNodes().first().simulate('click');

  t.ok(onFileUpload.notCalled, 'should not download the url through the file loader');
  t.deepEqual(
    onAddRemoteDataset.lastCall.args[0],
    {url: 'https://example.com/cities.csv'},
    'should stage the url for Add Data'
  );
  t.equal(
    wrapper.find(FileUpload).children().first().state().remoteUrl,
    '',
    'should clear the url field after adding it'
  );

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
  t.ok(
    wrapper.find('.upload-file-list').text().includes('tst-file.png'),
    'should list the unsupported file'
  );
  t.equal(
    wrapper.find('.upload-file-list').find('Checkbox').length,
    0,
    'unsupported files cannot be selected'
  );

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

test('Components -> FileUpload remote URL form', t => {
  const wrapper = mountWithTheme(
    <IntlWrapper>
      <FileUpload onFileUpload={() => {}} fileExtensions={['csv', 'geojson']} />
    </IntlWrapper>
  );

  t.ok(wrapper.find('.file-uploader__remote-url').exists(), 'should render remote URL form');
  const urlInput = wrapper.find('.file-uploader__remote-url input').hostNodes();
  t.equal(urlInput.length, 1, 'should render URL input');
  t.ok(urlInput.first().prop('aria-label'), 'should set aria-label on URL input');
  t.equal(
    wrapper.find('.file-uploader__remote-format').hostNodes().length,
    0,
    'format selector is hidden by default'
  );

  t.end();
});

test('Components -> FileUpload remote URL format selector flag', t => {
  initApplicationConfig({enableRemoteFileFormatSelector: true});
  const wrapper = mountWithTheme(
    <IntlWrapper>
      <FileUpload onFileUpload={() => {}} fileExtensions={['csv', 'geojson']} />
    </IntlWrapper>
  );

  t.ok(
    wrapper.find('.file-uploader__remote-format').hostNodes().length >= 1,
    'should render format select when the flag is enabled'
  );

  initApplicationConfig({enableRemoteFileFormatSelector: false});
  t.end();
});
