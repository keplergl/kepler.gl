import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const propTypes = {
  onLoadMapFromRemote: PropTypes.func.isRequired
};

const StyledDescription = styled.div`
  font-size: 14px;
  color: ${props => props.theme.labelColorLT};
  line-height: 18px;
  margin-bottom: 12px;
`;

const InputForm = styled.div`
  flex-grow: 1;
  padding: 32px;
  background-color: ${props => props.theme.panelBackgroundLT};
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.inputPadding};
  color: ${props => props.theme.titleColorLT};
  height: ${props => props.theme.inputBoxHeight};
  border: 0;
  outline: 0;
  font-size: ${props => props.theme.inputFontSize};
  
  :active,
  :focus,
  &.focus,
  &.active {
    outline: 0;
  }
`;

const StyledFromGroup = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: row;
`;

export const StyledInputLabel = styled.div`
  font-size: 11px;
  color: ${props => props.theme.textColorLT};
  letter-spacing: 0.2px;
  ul {
    padding-left: 12px;
  }
`;

export const StyledBtn = styled.button`
  background-color: ${props => props.theme.primaryBtnActBgd};
  color: ${props => props.theme.primaryBtnActColor};
`;

class LoadRemoteMap extends Component {

  onMapUrlChange = (e) => {
    // TODO: validate url
    this.setState({
      dataUrl: e.target.value
    });
  };

  onLoadRemoteMap  = () => {
    const {dataUrl} = this.state;
    if (!dataUrl) {
      return;
    }

    this.props.onLoadRemoteMap({dataUrl});
  };

  render() {
    return (
      <div>
        <InputForm>
          <StyledDescription>Load your map using your custom URL</StyledDescription>
          <StyledInputLabel>
            You can use the following formats: CSV | JSON | KEPLERGL.JSON. Make sure the url contains the file extension.
          </StyledInputLabel>
          <StyledInputLabel>
            Examples:
            <ul>
              <li>https://your.map.url/map.json</li>
              <li>http://your.map.url/data.csv</li>
            </ul>
          </StyledInputLabel>
          <StyledFromGroup>
            <StyledInput
              onChange={this.onMapUrlChange}
              type="text"
              placeholder="File Url"
            />
            <StyledBtn type="submit" onClick={this.onLoadRemoteMap}>
              Fetch
            </StyledBtn>
          </StyledFromGroup>
        </InputForm>
      </div>
    );
  }
}

LoadRemoteMap.propTypes = propTypes;

export default LoadRemoteMap;
