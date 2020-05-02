import React, { useCallback } from 'react';
import gql from 'graphql-tag';
import { History } from 'history';
import styled from 'styled-components';
import { useQuery, useMutation } from '@apollo/react-hooks';
import MessagesList from './MesagesList';
import ChatRoomNavBar from './ChatRoomNavbar';
import MessageInput from './MessageInput';
import { getChatsQuery } from '../Chats/ChatsList';

const getChatQuery = gql`
  query GetChat($chatId: ID!) {
    chat(chatId: $chatId) {
      id
      name
      picture
      messages {
        id
        content
        createdAt
      }
    }
  }
`;

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

const addMessageMutation = gql`
  mutation AddMessage($chatId: ID!, $content: String!) {
    addMessage(chatId: $chatId, content: $content) {
      id
      content
      createdAt
    }
  }
`;

const ChatsRoomScreen: React.FC<ChatRoomScreenParams> = ({
  match: {
    params: { chatId },
  },
  history,
}) => {
  const { data } = useQuery<any>(getChatQuery, {
    variables: { chatId },
  });

  const [addMessage] = useMutation(addMessageMutation);

  const chat = data?.chat;
  const onSendMessage = useCallback(
    (content: string) => {
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
            console.log('data,', data);
            client.writeQuery({
              query: getChatQuery,
              variables: { chatId },
              data: {
                chat: {
                  ...chat,
                  messages: chat.messages.concat(data.addMessage),
                },
              },
            });
          }

          let clientChatsData;
          try {
            clientChatsData = client.readQuery<ChatsResult>({
              query: getChatsQuery,
            });
            console.log(clientChatsData);
          } catch (error) {
            console.log(error);
            return null;
          }

          if (!clientChatsData || clientChatsData === null) {
            return null;
          }
          if (!clientChatsData.chats || clientChatsData.chats === undefined) {
            return null;
          }

          const chats = clientChatsData.chats;

          const chatIndex = chats.findIndex(
            (currentChat: any) => currentChat.id === chatId
          );

          if (chatIndex === -1) return null;

          const chatWhereAdded = chats[chatIndex];

          chatWhereAdded.lastMessage = data.addMessage;
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
    [chat, chatId, addMessage]
  );

  if (!chat) return null;

  return (
    <Container>
      <ChatRoomNavBar chat={chat} history={history} />
      {chat.messages && <MessagesList messages={chat.messages} />}
      <MessageInput onSendMessage={onSendMessage} />
    </Container>
  );
};

export default ChatsRoomScreen;
