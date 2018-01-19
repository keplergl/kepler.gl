import React from 'react';

const VertDots = ({size = 24}) => (
  <svg
    fill="currentColor"
    height={size}
    width={size}
    viewBox="0 0 32 32"
    style={{display: 'inline-block', verticalAlign: 'middle'}}
  >
    <path d="M12 10c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2
  zm0 5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2
  zm0 9c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

export default VertDots;
