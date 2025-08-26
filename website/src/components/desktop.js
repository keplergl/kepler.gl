// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useState} from 'react';
import styled from 'styled-components';
import Swipeable from './common/swipeable';
import {fsqStudioUrl, fsqCdnDesktopUrl} from '../utils';
import {LinkButton} from './common/styled-components';

const DESKTOP_PRODUCT_URL = 'https://foursquare.com/products/spatial-desktop/';

// Temporarily reuse Studio images/icons as placeholders. We'll swap in
// Desktop-specific images when URLs are provided.
const CAROUSEL_GROUPS = [
  [
    {
      imageUrl: fsqCdnDesktopUrl('screenshots/img-1.png'),
      icon: fsqStudioUrl('logos/Dataset_Operation.png'),
      title: 'Browser-free with native DuckDB',
      description:
        'Run instantaneous, complex spatial queries on multi-GB datasets with native DuckDB in Spatial Desktop.',
      link: DESKTOP_PRODUCT_URL
    },
    {
      imageUrl: fsqCdnDesktopUrl('screenshots/img-2.png'),
      icon: fsqStudioUrl('logos/Administrative_boundaries.png'),
      title: 'Built on SQLRooms',
      description:
        'A SQLRooms foundation offers community-driven extensibility through custom plug-ins - delivering full computational power for high-performance, visualization-intensive tasks.',
      link: DESKTOP_PRODUCT_URL
    },
    {
      imageUrl: fsqCdnDesktopUrl('screenshots/img-3.png'),
      icon: fsqStudioUrl('logos/Flow_layer.png'),
      title: 'Cloud-native spatial formats',
      description:
        'Spatial Desktop has native support for the formats GIS pros need, including GeoParquet and PMTiles.',
      link: DESKTOP_PRODUCT_URL
    }
  ],
  [
    {
      imageUrl: fsqCdnDesktopUrl('screenshots/img-4.png'),
      icon: fsqStudioUrl('logos/Tile_Layers.png'),
      title: 'Real-time rendering',
      description:
        'Harnessing Kepler.gl’s visualization excellence, you can easily render millions of points with interactive filtering and smooth animations – without browser memory limitations.',
      link: DESKTOP_PRODUCT_URL
    },
    {
      imageUrl: fsqCdnDesktopUrl('screenshots/img-5.png'),
      icon: fsqStudioUrl('logos/Analytics_modules.png'),
      title: 'Flexible access & save',
      description:
        'Easily manage multiple projects and save them locally on your desktop or to your personal cloud storage.',
      link: DESKTOP_PRODUCT_URL
    },
    {
      imageUrl: fsqCdnDesktopUrl('screenshots/img-6.png'),
      icon: fsqStudioUrl('logos/Charts.png'),
      title: 'Spatial joins and aggregations',
      description:
        'Create buffers, perform spatial joins (intersects, within, distance), and aggregate with SQL group-bys—no external engine needed.',
      link: DESKTOP_PRODUCT_URL
    }
  ]
];

const Flex = styled.div`
  display: flex;
`;

const DesktopContainer = styled(Flex)`
  width: 100%;
  align-items: center;
  flex-direction: column;
  gap: 72px;
  overflow-x: hidden;
`;

const Section = styled(Flex)`
  gap: 56px;
  width: 100%;
  justify-content: center;
  justify-items: center;
  padding-top: 8px;
`;

const CardImage = styled.img`
  height: 230px;
  width: 386px;
  max-width: none;
  object-fit: cover;
  box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.5);
  transition: transform 350ms;
`;

const Card = styled.a`
  display: flex;
  flex-direction: column;
  gap: 56px;
  align-items: center;
  cursor: pointer;
  color: white;
  flex: 0 0 auto;

  :visited {
    color: white;
  }

  :hover {
    ${CardImage} {
      transform: scale3d(1.05, 1.05, 1.05);
    }
  }
`;

const CardBody = styled(Flex)`
  flex-direction: column;
  gap: 16px;
  max-width: 300px;
  align-items: center;
`;

const CardIcon = styled.img`
  height: 24px;
  width: 24px;
`;

const CardTitle = styled.div`
  font-size: 20px;
  line-height: 28px;
  text-align: center;
`;

const CardDescription = styled.div`
  font-size: 16px;
  line-height: 26px;
  text-align: center;
  opacity: 0.7;
`;

const CardSection = ({cards}) => (
  <Section>
    {cards.map(card => (
      <Card key={card.imageUrl} href={card.link} target="_blank">
        <CardImage src={card.imageUrl} alt={card.title} />
        <CardBody>
          <CardIcon src={card.icon} alt={card.title} />
          <CardTitle>{card.title}</CardTitle>
          <CardDescription>{card.description}</CardDescription>
        </CardBody>
      </Card>
    ))}
  </Section>
);

const WhiteLinkButton = styled(LinkButton)`
  && {
    border-color: white;
    color: white;
  }

  &&:hover,
  &&:focus,
  &&:active,
  &&:visited,
  &&.active {
    color: white;
  }
`;

const Desktop = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const onChange = useCallback(index => {
    setSelectedIndex(index);
  }, []);

  return (
    <DesktopContainer>
      <Swipeable
        onChange={onChange}
        selectedIndex={selectedIndex}
        containerStyle={{overflow: 'visible'}}
      >
        {CAROUSEL_GROUPS.map((cards, index) => (
          <CardSection key={index} cards={cards} />
        ))}
      </Swipeable>
      <WhiteLinkButton outline large href={DESKTOP_PRODUCT_URL} target="_blank">
        Learn More
      </WhiteLinkButton>
    </DesktopContainer>
  );
};

export default React.memo(Desktop);
