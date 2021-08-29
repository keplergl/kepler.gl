import styled from 'styled-components';
import VerticalToolbar from '../common/vertical-toolbar';

function MapControlToolbar() {
  const StyledToolbar = styled(VerticalToolbar)`
    position: absolute;
    right: 32px;
  `;

  return StyledToolbar;
}

export default MapControlToolbar;
