import React from 'react';
const imgStyle = {height: '32px'};
const linkStyle = {marginRight: '32px'};

const NetlifyLogo = () => (
  <a style={linkStyle} href="https://www.netlify.com">
    <img style={imgStyle} src="https://www.netlify.com/img/global/badges/netlify-light.svg" />
  </a>
);

export default NetlifyLogo;
