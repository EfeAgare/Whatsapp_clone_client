import React from 'react';
import { Container, Title } from '../common/ContainerStyle';
import { NavBar } from '../common/NavBar';

export const ChatsNavbar = ({ history }) => {
  return (
    <Container>
      <Title>Whatsapp Clone</Title>
      <NavBar history={history} />
    </Container>
  );
};
