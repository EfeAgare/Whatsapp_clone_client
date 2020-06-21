import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Button } from '@material-ui/core';
import React from 'react';
import { useCallback } from 'react';
import styled from 'styled-components';
import { Container, Title } from '../common/ContainerStyle';
import { NavBar } from '../common/NavBar';

export const BackButton = styled(Button)`
  svg {
    color: var(--primary-text);
  }
`;

const ChatCreationNavbar = ({ history }) => {
  const navBack = useCallback(() => {
    history.replace('/chats');
  }, [history]);

  return (
    <Container>
      <BackButton data-testid="back-button" onClick={navBack}>
        <ArrowBackIcon />
      </BackButton>
      <Title>Create Chat</Title>
      <NavBar />
    </Container>
  );
};

export default ChatCreationNavbar;
