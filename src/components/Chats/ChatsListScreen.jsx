import React from 'react';
import { ChatsNavbar } from './ChatsNavbar';
import ChatsList from './ChatsList';
import styled from 'styled-components';

import AddChatButton from '../ChatCreationScreen/AddChatButton';

const Container = styled.div`
  height: 100vh;
`;

export const ChatsListScreen= ({
  history,
}) => {
  return (
    <Container>
      <ChatsNavbar history={history} />
      <ChatsList history={history} />
      <AddChatButton history={history} />
    </Container>
  );
};
