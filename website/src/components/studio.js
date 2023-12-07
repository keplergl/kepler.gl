// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useState} from 'react';
import styled from 'styled-components';
import Swipeable from './common/swipeable';
import {fsqStudioUrl} from '../utils';
import {LinkButton} from './common/styled-components';

export const LOCATION_FOURSQUARE_LINK =
  'https://location.foursquare.com/products/studio/keplergl-vs-studio';

const getFSQLink = utmCampaign =>
  `${LOCATION_FOURSQUARE_LINK}?utm_source=Kepler&&utm_medium=partner_site&utm_campaign=${utmCampaign}`;

const LEARN_MORE_LINK = getFSQLink('studio_signup');

const SECTIONS = [
  [
    {
      imageUrl: fsqStudioUrl('screenshots/Flow_layer.png'),
      icon: fsqStudioUrl('logos/Flow_layer.png'),
      title: 'Flow layer',
      description: 'Visualize origin-destination movement patterns',
      link: getFSQLink('Keplermap1_Flow_layer')
    },
    {
      imageUrl: fsqStudioUrl('screenshots/3D_tiles.png'),
      icon: fsqStudioUrl('logos/3D_tiles.png'),
      title: '3D tiles',
      description: 'Stream and render massive 3D geospatial datasets',
      link: getFSQLink('Keplermap2_3D_tiles')
    },
    {
      imageUrl: fsqStudioUrl('screenshots/Analytics_modules.png'),
      icon: fsqStudioUrl('logos/Analytics_modules.png'),
      title: 'Analytics modules',
      description: 'Expedite spatial data analysis to extract valuable information',
      link: getFSQLink('Keplermap3_Analytics_modules')
    }
  ],
  [
    {
      imageUrl: fsqStudioUrl('screenshots/Charts.png'),
      icon: fsqStudioUrl('logos/Charts.png'),
      title: 'Charts',
      description: 'Add statistics and charts to maps including tooltip, bar and line charts',
      link: getFSQLink('Keplermap4_Charts')
    },
    {
      imageUrl: fsqStudioUrl('screenshots/Administrative_boundaries.png'),
      icon: fsqStudioUrl('logos/Administrative_boundaries.png'),
      title: 'Administrative boundaries',
      description: 'Generate the boundary from columns containing administrative identifiers',
      link: getFSQLink('Keplermap5_Adnministrative_boundaries')
    },
    {
      imageUrl: fsqStudioUrl('screenshots/Host_published_maps.png'),
      icon: fsqStudioUrl('logos/Host_published_maps.png'),
      title: 'Host published maps',
      description: 'Host published maps that can be shared with a link',
      link: getFSQLink('Keplermap6_Host_published_maps')
    }
  ],
  [
    {
      imageUrl: fsqStudioUrl('screenshots/Fleet_Visualization.png'),
      icon: fsqStudioUrl('logos/Fleet_Visualization.png'),
      title: 'Fleet Visualization',
      description: 'Playback and study of the movement of entire fleets',
      link: getFSQLink('Keplermap7_Fleet_Visualization')
    },
    {
      imageUrl: fsqStudioUrl('screenshots/Hextile_Analysis.png'),
      icon: fsqStudioUrl('logos/Hextile_Analysis.png'),
      title: 'Hextile Analysis',
      description: 'H3 based tiling system designed for spatial analytics',
      link: getFSQLink('Keplermap8_Hextile_Analysis')
    },
    {
      imageUrl: fsqStudioUrl('screenshots/Tile_Layers.png'),
      icon: fsqStudioUrl('logos/Tile_Layers.png'),
      title: 'Tile Layers',
      description: 'Add layers from Vector tile, Raster tile, and WMS format',
      link: getFSQLink('Keplermap9_Tile_Layers')
    }
  ],
  [
    {
      imageUrl: fsqStudioUrl('screenshots/Dataset_Operation.png'),
      icon: fsqStudioUrl('logos/Dataset_Operation.png'),
      title: 'Dataset Operation',
      description: 'Apply expression, group-by, spatial join operations.',
      link: getFSQLink('Keplermap10_Dataset_Operation')
    },
    {
      imageUrl: fsqStudioUrl('screenshots/Globe.png'),
      icon: fsqStudioUrl('logos/Globe.png'),
      title: 'Globe',
      description: 'A 3D globe view of the Earth for planetary data.',
      link: getFSQLink('Keplermap11_Globe')
    },
    {
      imageUrl: fsqStudioUrl('screenshots/Remote_Sensing.png'),
      icon: fsqStudioUrl('logos/Remote_Sensing.png'),
      title: 'Remote Sensing',
      description: 'Analysis-Ready high bit-depth raster data in your browser',
      link: getFSQLink('Keplermap12_Remote_Sensing')
    }
  ]
];

const Flex = styled.div`
  display: flex;
`;

const StudioContainer = styled(Flex)`
  width: 100%;
  align-items: center;
  flex-direction: column;
  gap: 72px;
`;

const Section = styled(Flex)`
  gap: 56px;
  width: 100%;
  justify-content: center;
  justify-items: center;
  padding-top: 8px;
`;

const MapCardImage = styled.img`
  height: 230px;
  width: 386px;
  box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.5);
  transition: transform 350ms;
`;

const MapCard = styled.a`
  display: flex;
  flex-direction: column;
  gap: 56px;
  align-items: center;
  cursor: pointer;
  color: white;

  :visited {
    color: white;
  }

  :hover {
    ${MapCardImage} {
      transform: scale3d(1.05, 1.05, 1.05);
    }
  }
`;

const MapCardBody = styled(Flex)`
  flex-direction: column;
  gap: 16px;
  max-width: 300px;
  align-items: center;
`;

const MapCardIcon = styled.img`
  height: 24px;
  width: 24px;
`;

const MapCardTitle = styled.div`
  font-size: 20px;
  line-height: 28px;
  text-align: center;
`;

const MapCardDescription = styled.div`
  font-size: 16px;
  line-height: 26px;
  text-align: center;
  opacity: 0.7;
`;

const CardSection = ({cards}) => (
  <Section>
    {cards.map(card => (
      <MapCard key={card.imageUrl} href={card.link} target="_blank">
        <MapCardImage src={card.imageUrl} alt={card.title} />
        <MapCardBody>
          <MapCardIcon src={card.icon} alt={card.title} />
          <MapCardTitle>{card.title}</MapCardTitle>
          <MapCardDescription>{card.description}</MapCardDescription>
        </MapCardBody>
      </MapCard>
    ))}
  </Section>
);

const WhiteLinkButton = styled(LinkButton)`
  border-color: white;
  color: white;
  :hover,
  :visited {
    color: white;
  }
`;

const Studio = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const onChange = useCallback(index => {
    setSelectedIndex(index);
  }, []);

  return (
    <StudioContainer>
      <Swipeable
        onChange={onChange}
        selectedIndex={selectedIndex}
        containerStyle={{overflow: 'visible'}}
      >
        {SECTIONS.map((cards, index) => (
          <CardSection key={index} cards={cards} />
        ))}
      </Swipeable>
      <WhiteLinkButton outline large href={LEARN_MORE_LINK} target="_blank">
        Learn More
      </WhiteLinkButton>
    </StudioContainer>
  );
};

export default React.memo(Studio);
