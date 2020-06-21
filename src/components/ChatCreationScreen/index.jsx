import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import UsersList from '../Users/UsersList';
import ChatCreationNavbar from './ChatCreationNavbar';

import gql from 'graphql-tag';

import * as fragments from '../../graphQl/fragments';

import { useMutation, useSubscription } from '@apollo/react-hooks';
import { chatAddedSubscription } from '../../graphQl/subscriptions/index';

// eslint-disable-next-line
const Container = styled.div`
  height: calc(100% - 56px);
  overflow-y: overlay;
`;

// eslint-disable-next-line
const StyledUsersList = styled(UsersList)`
  height: calc(100% - 56px);
`;

const addChatMutation = gql`
  mutation AddChat($recipientId: ID!) {
    addChat(recipientId: $recipientId) {
      ...Chat
    }
  }
  ${fragments.chat}
`;

const ChatCreationScreen = ({ history }) => {
  const [addChat] = useMutation(addChatMutation);

  useSubscription(chatAddedSubscription, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {});

  const onUserPick = useCallback(
    (user) =>
      addChat({
        optimisticResponse: {
          __typename: 'Mutation',
          addChat: {
            __typename: 'Chat',
            id: Math.random().toString(36).substr(2, 9),
            name: user.name,
            picture: user.picture,
            lastMessage: null,
          },
        },
        variables: {
          recipientId: user.id,
        },
      }).then((result) => {
        if (result && result.data !== null) {
          history.push(`/chats/${result.data.addChat.id}`);
        }
      }),
    [addChat, history]
  );

  return (
    <div>
      <ChatCreationNavbar history={history} />
      <UsersList onUserPick={onUserPick} />
    </div>
  );
};

export default ChatCreationScreen;
