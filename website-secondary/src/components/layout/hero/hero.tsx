import {FC, useEffect, useState} from 'react';
import {FaGithub} from 'react-icons/fa';
import {CLOUDFRONT, DEMO_DUCKDB_LINK, DEMO_LINK, GITHUB_REPO} from '@site/src/constants/constants';

import styles from './hero.module.css';
import {cdnUrl} from '@site/src/utils/utils';

export const HERO_IMAGES = [
  cdnUrl('hero/kepler.gl-hexagon.png'),
  cdnUrl('hero/kepler.gl-points.png'),
  cdnUrl('hero/kepler.gl-contours.png')
];

export const HERO_IMAGES_SCALED = [
  cdnUrl('hero/kepler.gl-hexagon_s.png'),
  cdnUrl('hero/kepler.gl-points_s.png'),
  cdnUrl('hero/kepler.gl-contours_s.png')
];

const HeroSection: FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((currentImageIndex + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [currentImageIndex]);

  return (
    <div className={styles.hero__container}>
      <img
        src={`${CLOUDFRONT}/kepler.gl/website/hero/kepler.gl-background.png`}
        alt="Background Image of Kepler.gl"
        className={styles.background__image}
      />
      <div className={styles.content__container}>
        <h1 className={styles.title}>Make an impact with your location data</h1>
        <p className={styles.description}>
          Kepler.gl is a powerful <span className={styles.bold__text}>open source</span> geospatial
          analysis <br /> tool for <span className={styles.bold__text}>large-scale</span> data sets.
        </p>
        <div className={styles.btn__container}>
          <a href={DEMO_LINK} className={[styles.btn, styles.btn__get_started].join(' ')}>
            Get started
          </a>
          <a href={DEMO_DUCKDB_LINK} className={[styles.btn, styles.btn__try_duckdb].join(' ')}>
            Try with DuckDB
          </a>
          <a
            href={GITHUB_REPO}
            target="_blank"
            className={[styles.btn, styles.btn__github].join(' ')}
          >
            <FaGithub />
            GitHub
          </a>
        </div>

        <div className={styles.image__container}>
          {HERO_IMAGES.map((image, index) => (
            <img
              key={index}
              src={image}
              alt="Image"
              style={{
                opacity: index === currentImageIndex ? 1 : 0
              }}
              className={styles.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
