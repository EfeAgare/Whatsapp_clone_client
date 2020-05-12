import React, { useCallback } from 'react';
import { History } from 'history';
import { defaultDataIdFromObject } from 'apollo-cache-inmemory';
import styled from 'styled-components';
// import { useQuery, useMutation } from '@apollo/react-hooks';
import MessagesList from './MesagesList';
import ChatRoomNavBar from './ChatRoomNavbar';
import MessageInput from './MessageInput';
import { getChatsQuery } from '../../graphQl/queries/chats.query';
// import { getChatQuery } from '../../graphQl/queries/chat.query';
// import { addMessageMutation } from '../../graphQl/mutations/addMessage.mutation';
import * as fragments from '../../graphQl/fragments';

import {
  useAddMessageMutation,
  useGetChatQuery,
  GetChatsQuery,
} from '../../graphQl/types';

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

interface ChatsResult {
  chats: any[];
}

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
            content,
          },
        },
        update: (client, { data }) => {
          if (data && data.addMessage) {
            type FullChat = { [key: string]: any };
            let fullChat;
            const chatIdFromStore = defaultDataIdFromObject(chat);

            if (chatIdFromStore === null) {
              return;
            }

            try {
              fullChat = client.readFragment<FullChat>({
                id: chatIdFromStore,
                fragment: fragments.fullChat,
                fragmentName: 'FullChat',
              });
            } catch (e) {
              return;
            }

            if (fullChat === null || fullChat.messages === null) {
              return;
            }
            if (
              fullChat.messages.some(
                (currentMessage: any) =>
                  data.addMessage && currentMessage.id === data.addMessage.id
              )
            ) {
              return;
            }

            fullChat.messages.push(data.addMessage);
            fullChat.lastMessage = data.addMessage;

            client.writeFragment({
              id: chatIdFromStore,
              fragment: fragments.fullChat,
              fragmentName: 'FullChat',
              data: fullChat,
            });
          }

          let clientChatsData: GetChatsQuery | null;
          try {
            clientChatsData = client.readQuery({
              query: getChatsQuery,
            });
            console.log(clientChatsData);
          } catch (error) {
            console.log(error);
            return null;
          }

          if (!clientChatsData || clientChatsData.chats === null) {
            return null;
          }

          const chats = clientChatsData.chats;

          const chatIndex = chats.findIndex(
            (currentChat: any) => currentChat.id === chatId
          );

          if (chatIndex === -1) return null;

          const chatWhereAdded = chats[chatIndex];

          // The chat will appear at the top of the ChatsList component
          chats.splice(chatIndex, 1);
          chats.unshift(chatWhereAdded);

          client.writeQuery({
            query: getChatsQuery,
            data: { chats: chats },
          });
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
