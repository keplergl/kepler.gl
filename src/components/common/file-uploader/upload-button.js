import React, {Component} from 'react';
import styled from 'styled-components';

const propTypes = {
  onUpload: React.PropTypes.func.isRequired
};

const Wrapper = styled.div`
  display: inline-block;
  color: ${props => props.theme.textColorLT};
  font-size: 12px;
  text-decoration: underline;
  
  :hover {
    cursor: pointer;
    font-weight: 500;
  }
`;
/*
Inspired by https://github.com/okonet/react-dropzone/blob/master/src/index.js
*/
export default class UploadButton extends Component {

  _onClick = () => {
    this.refs.fileInput.value = null;
    this.refs.fileInput.click();
  };

  _onChange = ({target: {files}}) => {
    if (!files) {
      return;
    }

    this.props.onUpload(files);
  };

  render() {
    return (
      <Wrapper>
        <input type="file" ref="fileInput"
          className="hidden"
          onChange={this._onChange}/>
        <span onClick={this._onClick}>
        {this.props.children}
        </span>
      </Wrapper>
    );
  }
}

UploadButton.propTypes = propTypes;
