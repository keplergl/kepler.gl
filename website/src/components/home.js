import React, {Component} from 'react';
import window from 'global/window';
import styled, {keyframes} from 'styled-components';
import {media, breakPoints} from '../styles';

export const CLOUDFRONT = 'https://d1a3f4spazzrp4.cloudfront.net/';
export const KEPLER_GL_BUCKET = 'kepler.gl/';

import {Button} from './common/styled-components';

// ee755ad8-3d68-4559-ab6b-cdcedb3a4d04
const imgRatio = 696 / 1080;

const imageSize = {w: 1080, h: 696, top: 137, right: 132, palm: 272};
const screenSize = {w: 1680, h: 954};
const imgToScrRatio = imageSize.w / screenSize.w;

const imgMinW = 880;
const screenMinW = imgMinW / imgToScrRatio;
const minRight = imageSize.right / imageSize.w * imgMinW;
const minTop = imageSize.top / imageSize.w * imgMinW;

const IMAGES = [
  'kepler.gl-hexagon.png',
  'kepler.gl-scatterplot.png',
  'kepler.gl-contour.png'
];

const IMAGES_S = IMAGES.map(img => img.replace('.png', '_s.png'));
const LOGO = 'viz_logo_bw.png';

const StyledHome = styled.div`
  background-color: ${props => props.theme.mapBackground};
  height: 100vh;
`;

const StyledMapContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
  
  .kg-home__map__blocker {
    width: 100%;
    height: 100%;
    position: fixed;  
    top: 0;
    left: 0;
    background-color: ${props => props.theme.mapBlocker};
    opacity: 0.6;
    z-index: 1;
    pointer-events: none;
  }
`;

const StyledHomeContent = styled.div`
  padding-top: 136px;
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  
  ${media.palm`
    padding-left: 24px;
    padding-right: 24px;
    padding-top: 76px;
    align-items: center;
    flex-direction: column;
    display: flex;
  `}
`;

// based on keyframe aniamtion to fade img
// http://css3.bradshawenterprises.com/cfimg/

// styled-components keyframe
// https://github.com/styled-components/styled-components/blob/master/docs/tips-and-tricks.md

const a = 3;
const b = 2;
const d = a + b;
const n = 3;
const t = d * 3;

const animationName = keyframes`
  0% {
    opacity:1;
  }
  ${a / t * 100}% {
    opacity:1;
  }
  ${1 / n * 100}% {
    opacity:0;
  }
  ${(1 - b / t) * 100}% {
    opacity:0;
  }
  100% {
    opacity:1;
  }
`;

const StyledImgContainer = styled.div`
  box-shadow: 0 12px 24px 0 rgba(0,0,0,0.50);
  flex-shrink: 0;
  opacity: 1;
  position: relative;
  
  ${media.palm`
    width: 100%;
  `}

  img {
    animation-name: ${animationName};
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    animation-duration: ${d * n}s;
  }
  
  img:nth-of-type(1) {
    animation-delay: ${d * 2}s;
  }
  img:nth-of-type(2) {
    animation-delay: ${d}s;
  }
  img:nth-of-type(3) {
    animation-delay: 0s;
  }

`;

const StyledCaption = styled.div`
  min-width: 250px;
  max-width: 280px;
  margin-right: 60px;
  padding-top: 70px;
  
  ${media.palm`
    width: auto;
    padding-top: 0;
    margin-right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  `}

  .kg-home__caption__title {
    font-size: 44px;
    letter-spacing: 1.83px;
    margin-bottom: 20px;
    font-weight: 600;
  }
  
  .kg-home__caption__description {
    font-size: 14px;
    color: ${props => props.theme.labelColor};
    line-height: 24px;
    margin-bottom: 64px;

    span.t-bold {
      color: ${props => props.theme.textColor};
      font-weight: 500;
    }
    
      
    ${media.palm`
      margin-bottom: 32px;
      text-align: center;
    `}
  }
  
  .kg-home__caption__bottom {
    ${media.palm`
      margin-top: 30px;
      text-align: center;
    `}

    .kg-home__caption__bottom__title {
      font-size: 16px;
      letter-spacing: 0.67px;
      margin-bottom: 16px;
      font-weight: 600;
    }
    
    .kg-button {
      background: #005CD2;
      box-shadow: 0 4px 16px 0 rgba(0,0,0,0.24);
      letter-spacing: 0.25px;
      font-weight: 600;
      
      :hover {
        background: #196CD6;
      }
    }
  }
`;

const StyledFooter = styled.div`
  position: absolute;
  bottom: 32px;
  display: flex;
  justify-content: center;
  width: 100%;
  font-size: 11px;
  color: ${props => props.theme.footerColor};
  letter-spacing: 0.5px;
  align-items: center;
  line-height: 14px;
  
  ${media.palm`
    margin-top: 16px;
    position: relative;
    bottom: auto;
  `}
`;

const StyledLogo = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 4px;
  position: relative;
  margin-left: 2.2rem;
  margin-top: 0;
  margin-bottom: 0;

  a {
    padding: 0 1rem 0 0;
    color: #E5E5E4;
    letter-spacing: 2px;
  }
  
  :before {
    content: "";
    background: url(${`${CLOUDFRONT}${KEPLER_GL_BUCKET}${LOGO}`}) no-repeat;
    background-size: cover;
    height: 20px;
    width: 24px;
    position: absolute;
    top: -2px;
    left: -30px;
  }
`;

class Home extends Component {
  state = {
    window: window.innerWidth,
    height: window.innerHeight
  };
  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }
  resize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };
  render() {
    const isPalm = this.state.width <= breakPoints.palm;
    const imgW = isPalm ? this.state.width - 48 : this.state.width * imgToScrRatio;
    const shrink = this.state.width / screenSize.w;

    return (
      <StyledHome className="kg-home">
        <StyledMapContainer className="kg-home__map">
          <div className="kg-home__map__blocker"/>
          <img style={{
            width: `${this.state.width}px`,
            height: 'auto',
            minWidth: `${screenMinW}px`
          }} src={`${CLOUDFRONT}${KEPLER_GL_BUCKET}kepler.gl-background.png`}/>
        </StyledMapContainer>

        <StyledHomeContent style={isPalm ? {} : {
          paddingLeft: '72px',
          paddingRight: `${Math.max(imageSize.right * shrink, minRight)}px`,
          paddingTop: `${Math.max(imageSize.top * shrink, minTop)}px`
        }}>
          <StyledCaption>
            <div className="kg-home__caption__title">Kepler.Gl</div>
            <div className="kg-home__caption__description">
              <span>Kepler is a powerful </span>
              <span className="t-bold">web-based </span>
              <span>geospatial data analysis tool. Built on a </span>
              <span className="t-bold">high performance </span>
              <span>rendering engine and designed for </span>
              <span className="t-bold">large-scale </span>
              <span>data sets.</span>
            </div>
            {isPalm ? <StyledImgContainer
              style={{
                width: `${imgW}px`,
                height: `${imgW * imgRatio}px`}}
            >
              {IMAGES_S.map(src => (
                <img key={src} style={{width: '100%', height: '100%', display: 'block', position: 'absolute', top: 0}}
                src={`${CLOUDFRONT}${KEPLER_GL_BUCKET}${src}`}/>))}
            </StyledImgContainer> : null}
            <div className="kg-home__caption__bottom">
              <div className="kg-home__caption__bottom__title">Coming soon in April 2018</div>
              <Button large>
                <a target="_blank" rel="noopener noreferrer"
                   href="http://t.uber.com/join-kepler.gl"
                >Keep Me Updated</a>
              </Button>
            </div>
          </StyledCaption>
          {!isPalm ? <StyledImgContainer style={{
            width: `${imgW}px`,
            height: `${imgW * imgRatio}px`,
            minWidth: `${imgMinW}px`,
            minHeight: `${imgMinW * imgRatio}px`
          }}>
            {IMAGES.map(src => (
              <img key={src} style={{width: '100%', height: '100%', position: 'absolute', top: 0}}
              src={`${CLOUDFRONT}${KEPLER_GL_BUCKET}${src}`}/>
            ))}
          </StyledImgContainer> : null}
        </StyledHomeContent>
        <StyledFooter>
          <div>Created By</div>
          <StyledLogo className="fg">
            <a target="_blank" rel="noopener noreferrer" href="http://vis.gl">VIS.GL</a>
          </StyledLogo>
        </StyledFooter>
      </StyledHome>
    );
  }
}

export default Home;
