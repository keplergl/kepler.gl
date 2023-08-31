// Copyright (c) 2023 Uber Technologies, Inc.
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

import React, {useCallback, useState} from 'react';
import styled from 'styled-components';
import Swipeable from './common/swipeable';
import {fsqStudioUrl} from '../utils';
import {LinkButton} from './common/styled-components';

export const LOCATION_FOURSQUARE_LINK =
  'https://location.foursquare.com/products/studio/keplergl-vs-studio';

const getFsqUTMLink = utmCampaign =>
  `${LEARN_MORE_LINK}?utm_source=Kepler&&utm_medium=partner_site&utm_campaign=${utmCampaign}`;

const LEARN_MORE_LINK = getFsqUTMLink('studio_signup');

const SECTIONS = [
  [
    {
      imageUrl: fsqStudioUrl('screenshots/Flow_layer.png'),
      icon: fsqStudioUrl('logos/Flow_layer.png'),
      title: 'Flow layer',
      description: 'Visualize origin-destination movement patterns',
      link: getFsqUTMLink('Keplermap1_Flow_layer')
    },
    {
      imageUrl: fsqStudioUrl('screenshots/3D_tiles.png'),
      icon: fsqStudioUrl('logos/3D_tiles.png'),
      title: '3D tiles',
      description: 'Stream and render massive 3D geospatial datasets',
      link: getFsqUTMLink('Keplermap2_3D_tiles')
    },
    {
      imageUrl: fsqStudioUrl('screenshots/Analytics_modules.png'),
      icon: fsqStudioUrl('logos/Analytics_modules.png'),
      title: 'Analytics modules',
      description: 'Expedite spatial data analysis to extract valuable information',
      link: getFsqUTMLink('Keplermap3_Analytics_modules')
    }
  ],
  [
    {
      imageUrl: fsqStudioUrl('screenshots/Charts.png'),
      icon: fsqStudioUrl('logos/Charts.png'),
      title: 'Charts',
      description: 'Add statistics and charts to maps including tooltip, bar and line charts',
      link: getFsqUTMLink('Keplermap4_Charts')
    },
    {
      imageUrl: fsqStudioUrl('screenshots/Administrative_boundaries.png'),
      icon: fsqStudioUrl('logos/Administrative_boundaries.png'),
      title: 'Administrative boundaries',
      description: 'Generate the boundary from columns containing administrative identifiers',
      link: getFsqUTMLink('Keplermap5_Adnministrative_boundaries')
    },
    {
      imageUrl: fsqStudioUrl('screenshots/Host_published_maps.png'),
      icon: fsqStudioUrl('logos/Host_published_maps.png'),
      title: 'Host published maps',
      description: 'Host published maps that can be shared with a link',
      link: getFsqUTMLink('Keplermap6_Host_published_maps')
    }
  ],
  [
    {
      imageUrl: fsqStudioUrl('screenshots/Fleet_Visualization.png'),
      icon: fsqStudioUrl('logos/Fleet_Visualization.png'),
      title: 'Fleet Visualization',
      description: 'Playback and study of the movement of entire fleets',
      link: getFsqUTMLink('Keplermap7_Fleet_Visualization')
    },
    {
      imageUrl: fsqStudioUrl('screenshots/Hextile_Analysis.png'),
      icon: fsqStudioUrl('logos/Hextile_Analysis.png'),
      title: 'Hextile Analysis',
      description: 'H3 based tiling system designed for spatial analytics',
      link: getFsqUTMLink('Keplermap8_Hextile_Analysis')
    },
    {
      imageUrl: fsqStudioUrl('screenshots/Tile_Layers.png'),
      icon: fsqStudioUrl('logos/Tile_Layers.png'),
      title: 'Tile Layers',
      description: 'Add layers from Vector tile, Raster tile, and WMS format',
      link: getFsqUTMLink('Keplermap9_Tile_Layers')
    }
  ],
  [
    {
      imageUrl: fsqStudioUrl('screenshots/Dataset_Operation.png'),
      icon: fsqStudioUrl('logos/Dataset_Operation.png'),
      title: 'Dataset Operation',
      description: 'Apply expression, group-by, spatial join operations.',
      link: getFsqUTMLink('Keplermap10_Dataset_Operation')
    },
    {
      imageUrl: fsqStudioUrl('screenshots/Globe.png'),
      icon: fsqStudioUrl('logos/Globe.png'),
      title: 'Globe',
      description: 'A 3D globe view of the Earth for planetary data.',
      link: getFsqUTMLink('Keplermap11_Globe')
    },
    {
      imageUrl: fsqStudioUrl('screenshots/Remote_Sensing.png'),
      icon: fsqStudioUrl('logos/Remote_Sensing.png'),
      title: 'Remote Sensing',
      description: 'Analysis-Ready high bit-depth raster data in your browser',
      link: getFsqUTMLink('Keplermap12_Remote_Sensing')
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
`;

const MapCard = styled.a`
  display: flex;
  flex-direction: column;
  gap: 56px;
  max-width: 386px;
  align-items: center;
  cursor: pointer;
  color: white;

  :visited {
    color: white;
  }
`;

const MapCardImage = styled.img`
  height: 230px;
  width: 386px;
  box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.5);
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
      <MapCard key={card.imageUrl} href={card.link}>
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
      <Swipeable onChange={onChange} selectedIndex={selectedIndex}>
        {SECTIONS.map((cards, index) => (
          <CardSection key={index} cards={cards} />
        ))}
      </Swipeable>
      <WhiteLinkButton outline large href={LEARN_MORE_LINK}>
        Learn More
      </WhiteLinkButton>
    </StudioContainer>
  );
};

export default React.memo(Studio);
