import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import React, { useEffect } from 'react';
import { useCallback } from 'react';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { chatRemovedSubscription } from '../../graphQl/subscriptions/index';
import { Container } from '../common/ContainerStyle';
import { NavBar } from '../common/NavBar';

const BackButton = styled(Button)`
  svg {
    color: var(--primary-text);
  }
`;

const Picture = styled.img`
  height: 40px;
  width: 40px;
  margin-top: 3px;
  margin-left: -22px;
  object-fit: cover;
  padding: 5px;
  border-radius: 50%;
`;

const Name = styled.div`
  line-height: 56px;
`;

const Rest = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const DeleteButton = styled(Button)`
  color: var(--primary-text) !important;
`;

export const removeChatMutation = gql`
  mutation RemoveChat($chatId: ID!) {
    removeChat(chatId: $chatId)
  }
`;

const ChatRoomNavBar = ({ chat, history, subscribeToMore }) => {
  const [removeChat] = useMutation(removeChatMutation);

  const handleRemoveChat = useCallback(() => {
    removeChat({
      variables: {
        chatId: chat.id,
      },
    }).then(() => {
      history.replace('/chats');
    });
  }, [removeChat, history, chat.id]);

  const subscribe = useCallback(() => {
    subscribeToMore({
      document: chatRemovedSubscription,

      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data.chatRemoved) return prev.chat;
        return {
          chat: {
            ...prev.chat,
          },
        };
      },
    });
  }, [subscribeToMore]);

  useEffect(() => {
    let unsubscribe;

    if (!unsubscribe) {
      unsubscribe = subscribe();
    }
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [subscribe]);

  const navBack = useCallback(() => {
    history.replace('/chats');
  }, [history]);

  return (
    <Container>
      <BackButton onClick={navBack} data-testid="back-button">
        <ArrowBackIcon />
      </BackButton>
      {chat && chat.picture && chat.name && (
        <React.Fragment>
          <Picture data-testid="chat-picture" src={chat.picture} />
          <Name data-testid="chat-name">{chat.name}</Name>
        </React.Fragment>
      )}

      <Rest>
        <DeleteButton data-testid="delete-button" onClick={handleRemoveChat}>
          <DeleteIcon />
        </DeleteButton>
        <NavBar/>
      </Rest>
    </Container>
  );
};

export default ChatRoomNavBar;
