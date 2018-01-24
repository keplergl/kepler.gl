import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import listensToClickOutside from 'react-onclickoutside/decorator';

const DropdownWrapper = styled.div`
  background-color: ${props => props.theme.panelBackground};
  overflow-y: overlay;
  box-shadow: ${props => props.theme.panelBoxShadow};
  border-radius:  ${props => props.theme.panelBorderRadius};
  margin-top: 2px;
  max-height: 500px;
`;

const propTypes = {
  onClose: PropTypes.func.isRequired
};

class PanelDropdown extends Component {
  handleClickOutside = (e) => {
    this.props.onClose(e);
  };

  render() {
    return (
      <DropdownWrapper>
        {this.props.children}
      </DropdownWrapper>
    );
  }
}

PanelDropdown.propTypes = propTypes;

export default listensToClickOutside(PanelDropdown);
