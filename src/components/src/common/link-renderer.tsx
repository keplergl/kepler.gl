// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {FC} from 'react';

interface LinkRendererProps {
  href: string;
  children: React.ReactNode;
}

const LinkRenderer: FC<LinkRendererProps> = props => {
  return (
    <a href={props.href} target="_blank" rel="noopener noreferrer">
      {props.children}
    </a>
  );
};

export default LinkRenderer;
