import React, {PureComponent} from 'react';
import styled, {keyframes} from 'styled-components';

import {SHOWCASE_ITEMS} from '../content/showcase';
import Carousel from './common/carousel';

const Image = styled.img`
  width: 640px;
  height: 480px;
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.25);
  object-fit: cover;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const NavItem = styled.div`
  margin: 10px;
  width: 48px;
  font-size: 10px;
  text-align: center;
  filter: ${props => props.isActive && 'brightness(300%)'};
  transform: ${props => props.isActive && 'scale(1.2)'};
  transition: transform 500ms, filter 500ms;
  cursor: pointer;
  :hover {
    transform: scale(1.2);
  }
`;

const Nav = ({items, selectedIndex, onClick}) => (
  <NavContainer>
    {items.map(({text, icon}, i) => (
      <NavItem isActive={selectedIndex === i} onClick={() => onClick(i)}>
        <img src={icon} style={{width: 48}} />
        {text}
      </NavItem>
    ))}
  </NavContainer>
);

class Showcase extends PureComponent {
  state = {
    selectedIndex: 3
  };

  render() {
    return (
      <div>
        <div style={{height: '480px'}}>
          <Carousel
            selectedIndex={this.state.selectedIndex}
            onChange={i => this.setState({selectedIndex: i})}
          >
            {SHOWCASE_ITEMS.map(({image}) => <Image src={image} />)}
          </Carousel>
        </div>
        <Nav
          items={SHOWCASE_ITEMS}
          selectedIndex={this.state.selectedIndex}
          onClick={i => this.setState({selectedIndex: i})}
        />
      </div>
    );
  }
}

export default Showcase;
