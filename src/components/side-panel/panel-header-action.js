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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styled from 'styled-components';
import {FormattedMessage} from 'localization';
import {Tooltip} from 'components/common/styled-components';

const HeaderActionWrapper = styled.div`
  margin-left: ${props => (props.flush ? 0 : 8)}px;
  display: flex;
  align-items: center;
  color: ${props =>
    props.active ? props.theme.panelHeaderIconActive : props.theme.panelHeaderIcon};

  :hover {
    cursor: pointer;
    color: ${props =>
      props.hoverColor ? props.theme[props.hoverColor] : props.theme.panelHeaderIconHover};
  }

  &.disabled {
    pointer-events: none;
    opacity: 0.3;
  }
`;

PanelHeaderActionFactory.deps = [];
// Need to use react class to access props.component
export default function PanelHeaderActionFactory() {
  class PanelHeaderAction extends Component {
    static propTypes = {
      id: PropTypes.string,
      flush: PropTypes.bool,
      tooltip: PropTypes.string,
      onClick: PropTypes.func,
      active: PropTypes.bool,
      disabled: PropTypes.bool,
      hoverColor: PropTypes.string,
      className: PropTypes.string,
      tooltipType: PropTypes.string
    };

    static defaultProps = {
      onClick: () => {},
      hoverColor: null,
      active: false
    };

    render() {
      const {
        onClick,
        tooltip,
        id,
        active,
        flush,
        hoverColor,
        tooltipType,
        disabled,
        className
      } = this.props;
      return (
        <HeaderActionWrapper
          className={classnames('panel--header__action', {disabled, [className]: className})}
          active={active}
          hoverColor={hoverColor}
          flush={flush}
        >
          <this.props.IconComponent
            data-tip
            data-for={`${tooltip}_${id}`}
            height="16px"
            onClick={onClick}
          />
          {tooltip ? (
            <Tooltip id={`${tooltip}_${id}`} effect="solid" delayShow={500} type={tooltipType}>
              <span>
                <FormattedMessage id={tooltip} />
              </span>
            </Tooltip>
          ) : null}
        </HeaderActionWrapper>
      );
    }
  }
  return PanelHeaderAction;
}
