import React, {PureComponent} from 'react';
import styled, {keyframes} from 'styled-components';


const items = [
  {text: 'A', color: '#af2b2b'},
  {text: 'B', color: '#af5f2a'},
  {text: 'C', color: '#b7ae2a'},
  {text: 'D', color: '#52b527'},
  {text: 'E', color: '#24af8d'},
  {text: 'F', color: '#2442af'},
  {text: 'G', color: '#9822aa'}
];

const Container = styled.div`
  position: relative;
  width: 250px;
  height: 200px;
  perspective: 1000px;
  perspective-origin: center;
`;

const Content = styled.div`
  position: absolute;
  transform-style: preserve-3d;
  margin: 0 auto;
  div {
    transform-style: preserve-3d;
  }
`;

const Item = styled.div`
  position: absolute;
  transition: transform 1s;
`;

const TestItem = styled.div`
  width: 300px;
  height: 250px;
  color: white;
  background: ${props => props.color};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 200ms;
`;


export default class Carousel extends PureComponent {
  state = {
    selectedIndex: 3
  }

  componentDidMount() {
    // window.setInterval(
    //     () => {
    //     this.setState({
    //       selectedIndex: Math.floor(Math.random() * items.length)
    //     });
    //   },
    //   2000
    // );
  }

  render() {
    const selectedIndex = this.state.selectedIndex;
    const selectedAngle = selectedIndex * -1 *  (360 / items.length);

    return (
      <Container>
        <Content>
          {items.map((item, i) => (
            <Item style={{
              // transform: `rotateY(${i * 360 / items.length}deg) translateZ(200px) rotateY(${-i * 360 / items.length}deg)`,
              transform: `translateX(${(i - selectedIndex) * 40}px) scale(${1.0 - Math.abs((i - selectedIndex) / 10)}`,
              // opacity: 0.9,
              zIndex: i <= selectedIndex ? i : selectedIndex - (i - selectedIndex)
            }} onClick={() => this.setState({selectedIndex: i})}>
              <TestItem color={item.color} style={{
                // transform: `rotateY(${-1 * selectedAngle}deg)`
              }}>{item.text}</TestItem>
            </Item>
          ))}
        </Content>
      </Container>
    );
  }
}