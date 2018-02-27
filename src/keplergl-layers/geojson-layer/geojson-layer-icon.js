import React from 'react';
import PropTypes from 'prop-types';
import Base from 'components/common/icons/base';

const GeojsonLayerIcon = React.createClass({
  displayName: 'GeojsonLayerIcon',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string)
  },
  defaultProps: {
    height: null,
    size: 'tiny',
    predefinedClassName: 'geojson-layer-icon'
  },
  render() {
    return (
      <Base {...this.props}>
        <polygon
          className="cr1"
          points="9.5 38.22 22.75 38.22 36 25.07 36 8.71 9.5 8.71 9.5 38.22"
          style={{opacity: 0.4}}
        />
        <polygon
          className="cr2"
          points="38.27 29.13 26.98 40.41 26.98 54.88 54.46 54.88 54.46 29.13 38.27 29.13"
        />
        <rect
          className="cr3"
          x="9.5"
          y="41.88"
          width="13.86"
          height="13"
          style={{opacity: 0.8}}
        />
        <rect
          className="cr4"
          x="39.58"
          y="8.71"
          width="14.87"
          height="16.83"
          style={{opacity: 0.8}}
        />
      </Base>
    );
  }
});

export default GeojsonLayerIcon;
