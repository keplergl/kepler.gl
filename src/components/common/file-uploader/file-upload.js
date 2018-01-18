/*global window */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import UploadButton from './upload-button';
import {File, DragNDrop} from 'components/common/icons';
import {isChrome} from 'utils/utils';

const FileDrop = typeof document !== 'undefined' ? require('react-file-drop') : null;
const propTypes = {
  onFileUpload: PropTypes.func.isRequired,
  validFileExt: PropTypes.array
};

// File.type is not reliable if the OS does not have a
// registered mapping for the extension.
// NOTE: Shapefiles must be in a compressed format since
// it requires multiple files to be present.
const defaultValidFileExt = [
  'csv',
  // 'tar.gz',
  // 'tgz',
  // 'zip',
  // 'gpx',
  'kml',
  'json',
  'geojson'
];

const defaultProps = {
  validFileExt: defaultValidFileExt
};

const MESSAGE = ' Drag & Drop Your File(s) Here';
const CHROME_MSG =
  '*Chrome user: Limit file size to 250mb, if need to upload larger file, try Safari';
const fileIconColor = '#D3D8E0';

const WarningMsg = styled.span`
  margin-top: 10px;
  color: ${props => props.theme.errorColor};
`;

const PositiveMsg = styled.span`
  color: ${props => props.theme.primaryBtnActBgd};
`;

const FileDropWrapper = styled.div`
  background-color: white;
  border-radius: 4px;
  border-style: dashed;
  border-width: 1px;
  border-color: ${props => props.theme.subtextColorLT};
  height: 414px;
  padding-top: 60px;
  text-align: center;
  width: 100%;

  .file-upload-or {
    color: ${props => props.theme.linkBtnColor};
    padding-right: 4px;
  }
`;

const MsgWrapper = styled.div`
  color: ${props => props.theme.modalTitleColor};
  font-size: 20px;
  height: 36px;
`;

const DragNDropIconWrapper = styled.div`
  color: ${fileIconColor};
  margin-bottom: 60px;

  .file-type-row {
    margin-bottom: 26px;
  }
`;

class FileUpload extends Component {
  state = {
    dragOver: false,
    files: null,
    errorFiles: []
  };

  _isValidFileType = filename => {
    const {validFileExt} = this.props;
    const fileExt = validFileExt.find(ext => filename.endsWith(ext));

    return Boolean(fileExt);
  };

  _handleFileDrop = (files, e) => {
    e.stopPropagation();

    const nextState = {files: [], errorFiles: [], dragOver: false};
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file && this._isValidFileType(file.name)) {
        nextState.files.push(file);
      } else {
        nextState.errorFiles.push(file.name);
      }
    }

    this.setState(
      nextState,
      () =>
        nextState.files.length ? this.props.onFileUpload(nextState.files) : null
    );
  };

  _toggleDragState = newState => {
    this.setState({dragOver: newState});
  };

  _renderMessage() {
    const {errorFiles} = this.state;

    if (errorFiles.length) {
      return (
        <WarningMsg>
          {`File ${errorFiles.join(', ')} is not supported.`}
        </WarningMsg>
      );
    }

    if (!this.state.files) {
      return null;
    }

    return (
      <span>
        Uploading...<PositiveMsg>
          {`${this.state.files.map(f => f.name).join(' and ')}...`}
        </PositiveMsg>
      </span>
    );
  }

  render() {
    const {dragOver} = this.state;
    const {validFileExt} = this.props;
    return (
      <div className="file-uploader" ref="frame">
        <input
          type="file"
          ref="fileInput"
          className="hidden"
          onChange={this._onChange}
        />
        {FileDrop ? (
          <FileDrop
            frame={this.refs.frame}
            targetAlwaysVisible={true}
            onDragOver={() => this._toggleDragState(true)}
            onDragLeave={() => this._toggleDragState(false)}
            onDrop={this._handleFileDrop}
          >
            <FileDropWrapper dragOver={dragOver}>
              <div style={{opacity: dragOver ? 0.5 : 1}}>
                <DragNDropIconWrapper>
                  <div className="file-type-row">
                    {validFileExt.map(ext => (
                      <FileTypeIcon key={ext} ext={ext} />
                    ))}
                  </div>
                  <DragNDrop height="44px"/>
                </DragNDropIconWrapper>
                <div>{this._renderMessage()}</div>
              </div>
              <div>
                <MsgWrapper>{MESSAGE}</MsgWrapper>
                <span className="file-upload-or">or</span>
                <UploadButton onUpload={this._handleFileDrop}>
                  browse your files
                </UploadButton>
              </div>
            </FileDropWrapper>
          </FileDrop>
        ) : null}
        <WarningMsg>{isChrome() ? CHROME_MSG : ''}</WarningMsg>
      </div>
    );
  }
}

const FileNameTag = styled.div`
  background-color: ${props => props.theme.subtextColorLT};
  border-radius: 1px;
  color: white;
  display: inline-block;
  font-size: 10px;
  padding: 1px 4px;
  position: absolute;
  top: 18px;
`;

const FileTypeIconWrapper = styled.div`
  display: inline-block;
  position: relative;
  padding: 0 4px;
`;

const FileTypeIcon = ({ext}) => (
  <FileTypeIconWrapper>
    <FileNameTag>{ext}</FileNameTag>
    <File height="50px" />
  </FileTypeIconWrapper>
);

FileUpload.propTypes = propTypes;
FileUpload.defaultProps = defaultProps;

export default FileUpload;
