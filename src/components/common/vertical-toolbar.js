import styled from 'styled-components';
import Toolbar from './toolbar';

const VerticalToolbar = styled(Toolbar)`
  flex-direction: column;
  padding: 0 24px;
  
  .toolbar-item {
    padding: 16px;
    border-right: 0;
    border-bottom: 1px solid ${props => props.theme.panelHeaderIcon};
    
    &:last-of-type {
      border-bottom: 0;
    }
  }
`;

VerticalToolbar.displayName = 'VerticalToolbar';

export default VerticalToolbar;
