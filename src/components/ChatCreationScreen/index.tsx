import React, { useCallback } from 'react';
import styled from 'styled-components';
import UsersList from '../Users/UsersList';
import ChatCreationNavbar from './ChatCreationNavbar';
import { History } from 'history';

import gql from 'graphql-tag';

import * as fragments from '../../graphQl/fragments';
import { useAddChatMutation } from '../../graphQl/types';
import { writeChat } from '../../services/cache.service';

// eslint-disable-next-line
const Container = styled.div`
  height: calc(100% - 56px);
  overflow-y: overlay;
`;

// eslint-disable-next-line
const StyledUsersList = styled(UsersList)`
  height: calc(100% - 56px);
`;

gql`
  mutation AddChat($recipientId: ID!) {
    addChat(recipientId: $recipientId) {
      ...Chat
    }
  }
  ${fragments.chat}
`;

interface ChildComponentProps {
  history: History;
}

const ChatCreationScreen: React.FC<ChildComponentProps> = ({ history }) => {
  const [addChat] = useAddChatMutation();

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
        update: (client, { data }) => {
          if (data && data.addChat) {
            writeChat(client, data.addChat);
          }
        },
      }).then((result) => {
        if (result && result.data !== null) {
          history.push(`/chats/${result.data!.addChat!.id}`);
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
