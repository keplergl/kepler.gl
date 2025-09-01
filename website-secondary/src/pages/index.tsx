import type {FC, ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import HeroSection from '../components/layout/hero/hero';

const Home: FC = (): ReactNode => {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Kepler.gl is a data agnostic, WebGL empowered, high-performance web application for geospatial analytic visualizations."
    >
      <HeroSection />
    </Layout>
  );
};

export default Home;
