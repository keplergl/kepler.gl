import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyledPanelDropdown} from 'components/common/styled-components';
import listensToClickOutside from 'react-onclickoutside/decorator';

const propTypes = {
  onClose: PropTypes.func
};

class PanelDropdown extends Component {
  handleClickOutside = (e) => {
    this.props.onClose(e);
  };

  render() {
    return (
      <StyledPanelDropdown className={this.props.className}>
        {this.props.children}
      </StyledPanelDropdown>
    );
  }
}

PanelDropdown.propTypes = propTypes;

export default listensToClickOutside(PanelDropdown);
