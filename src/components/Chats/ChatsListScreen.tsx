import React from 'react';
import { ChatsNavbar } from './ChatsNavbar';
import ChatsList from './ChatsList';
import styled from 'styled-components';
import { History } from 'history';

const Container = styled.div`
  height: 100vh;
`;

interface ChatsListScreenProps {
  history: History;
}

export const ChatsListScreen: React.FC<ChatsListScreenProps> = ({
  history,
}) => {
  return (
    <Container>
      <ChatsNavbar />
      <ChatsList history={history} />
    </Container>
  );
};
