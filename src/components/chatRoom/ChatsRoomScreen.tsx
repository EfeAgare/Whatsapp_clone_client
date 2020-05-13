import React, { useCallback } from 'react';
import { History } from 'history';
// import { defaultDataIdFromObject } from 'apollo-cache-inmemory';
import styled from 'styled-components';
// import { useQuery, useMutation } from '@apollo/react-hooks';
import MessagesList from './MesagesList';
import ChatRoomNavBar from './ChatRoomNavbar';
import MessageInput from './MessageInput';
// import { getChatsQuery } from '../../graphQl/queries/chats.query';
// import { getChatQuery } from '../../graphQl/queries/chat.query';
// import { addMessageMutation } from '../../graphQl/mutations/addMessage.mutation';
// import * as fragments from '../../graphQl/fragments';

import { useAddMessageMutation, useGetChatQuery } from '../../graphQl/types';
import { writeMessage } from '../../services/cache.service';

const Container = styled.div`
  background: url(/assets/chat-background.jpg);
  display: flex;
  flex-flow: column;
  height: 100vh;
`;

interface ChatRoomScreenParams {
  match: { params: { chatId: string } };
  history: History;
}

// interface ChatsResult {
//   chats: any[];
// }

export interface ChatQueryMessage {
  id: string;
  content: string;
  createdAt: Date;
}

export interface ChatQueryResult {
  id: string;
  name: string;
  picture: string;
  messages: Array<ChatQueryMessage>;
}

const ChatsRoomScreen: React.FC<ChatRoomScreenParams> = ({
  match: {
    params: { chatId },
  },
  history,
}) => {
  const { data, loading } = useGetChatQuery({
    variables: { chatId },
  });

  // const [addMessage] = useMutation(addMessageMutation);
  const [addMessage] = useAddMessageMutation();

  const onSendMessage = useCallback(
    (content: string) => {
      if (data === undefined) {
        return null;
      }
      const chat = data.chat;
      if (chat === null) return null;
      addMessage({
        variables: { chatId, content },
        optimisticResponse: {
          __typename: 'Mutation',
          addMessage: {
            __typename: 'Message',
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date(),
            isMine: true,
            chat: {
              __typename: 'Chat',
              id: chatId,
            },
            content,
          },
        },
        update: (client, { data }) => {
          if (data && data.addMessage) {
            writeMessage(client, data.addMessage);
          }
        },
      });
    },
    [data, chatId, addMessage]
  );

  if (data === undefined) {
    return null;
  }
  const chat = data.chat;
  const loadingChat = loading;

  if (loadingChat) return null;
  if (chat === null) return null;

  return (
    <Container>
      <ChatRoomNavBar chat={chat} history={history} />
      {chat?.messages && <MessagesList messages={chat.messages} />}
      <MessageInput onSendMessage={onSendMessage} />
    </Container>
  );
};

export default ChatsRoomScreen;
