import styled from 'styled-components';
import {Toolbar} from '@material-ui/core';

export const Container = styled(Toolbar)`
  padding: 0;
  display: flex;
  flex-direction: row;
  background-color: var(--primary-bg);
  color: var(--primary-text);
`;

export const Title = styled.div`
  flex: 1;
`;
