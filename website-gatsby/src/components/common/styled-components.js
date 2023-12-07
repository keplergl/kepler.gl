// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import styled, {css} from 'styled-components';
import {media} from '../../styles';

const buttonStyles = css`
  align-items: center;
  background-color: ${props =>
    props.negative
      ? props.theme.negativeBtnBgd
      : props.secondary
        ? props.theme.secondaryBtnBgd
        : props.outline
          ? props.theme.outlineBtnBgd
          : props.outlineDark
            ? props.outlineDarkBtnBgd
            : props.link
              ? props.theme.linkBtnBgd
              : props.theme.primaryBtnBgd};
  border-radius: ${props => props.theme.primaryBtnRadius};
  color: ${props =>
    props.negative
      ? props.theme.negativeBtnColor
      : props.secondary
        ? props.theme.secondaryBtnColor
        : props.outline
          ? props.outlineBtnColor
          : props.outlineDark
            ? props.theme.outlineDarkBtnColor
            : props.link
              ? props.theme.linkBtnColor
              : props.theme.primaryBtnColor};
  cursor: pointer;
  display: inline-flex;
  font-size: ${props => (props.large ? '14px' : '11px')};
  font-weight: 500;
  justify-content: center;
  letter-spacing: 0.3px;
  line-height: 14px;
  outline: 0;
  border: ${props =>
    props.outline
      ? `1px solid ${props.theme.outlineBtnColor}`
      : props.outlineDark
        ? `1px solid ${props.theme.outlineDarkBtnColor}`
        : 'none'};
  padding: ${props => (props.large ? '14px 32px' : '9px 12px')};
  text-align: center;
  transition: ${props => props.theme.btnTransition};
  vertical-align: middle;
  width: ${props => props.width || 'auto'};
  text-transform: uppercase;

  :hover,
  :focus,
  :active,
  :visited,
  &.active {
    background-color: ${props =>
      props.negative
        ? props.theme.negativeBtnBgdHover
        : props.secondary
          ? props.theme.secondaryBtnBgdHover
          : props.outline
            ? props.theme.outlineBtnBgdHover
            : props.outlineDark
              ? props.theme.outlineDarkBtnBgdHover
              : props.link
                ? props.theme.linkBtnActBgdHover
                : props.theme.primaryBtnBgdHover};
    color: ${props =>
      props.negative
        ? props.theme.negativeBtnActColor
        : props.secondary
          ? props.theme.secondaryBtnActColor
          : props.outline
            ? props.theme.outlineBtnActColor
            : props.outlineDark
              ? props.theme.outlineDarkBtnActColor
              : props.link
                ? props.theme.linkBtnActColor
                : props.theme.primaryBtnActColor};
  }

  svg,
  img {
    width: 14px;
    margin-right: 8px;
  }

  ${media.palm`
    font-size: 11px;
    padding: 9px 12px;
  `};
`;

export const Button = styled.div.attrs({
  className: 'kg-button'
})`
  ${buttonStyles};
`;

export const LinkButton = styled.a`
  color: black;
  ${buttonStyles};
`;

export const CenteredContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
