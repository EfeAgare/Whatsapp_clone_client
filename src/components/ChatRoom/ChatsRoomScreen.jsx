import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import MessagesList from './MesagesList';
import ChatRoomNavBar from './ChatRoomNavbar';
import MessageInput from './MessageInput';
import { Redirect } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { getChatQuery } from '../../graphQl/queries/chat.query';
import { addMessageMutation } from '../../graphQl/mutations/addMessage.mutation';
import { messageAddedSubscription } from '../../graphQl/subscriptions';

const Container = styled.div`
  background: url(/assets/chat-background.jpg);
  display: flex;
  flex-flow: column;
  height: 100vh;
`;

const ChatsRoomScreen = ({
  match: {
    params: { chatId },
  },
  history,
}) => {
  const { data, loading, subscribeToMore } = useQuery(getChatQuery, {
    variables: { chatId },
    fetchPolicy: 'cache-and-network',
  });

  const subscribe = useCallback(() => {
    subscribeToMore({
      document: messageAddedSubscription,

      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data.messageAdded) return prev.chat;
        const addedMessage = {
          ...subscriptionData.data.messageAdded,
          chat: {
            id: chatId,
            __typename: 'Chat',
          },
        };
        return {
          chat: {
            ...prev.chat,
            messages: [...prev.chat.messages, addedMessage],
          },
        };
      },
    });
  }, [subscribeToMore, chatId]);

  useEffect(() => {
    subscribe();
    return () => {
      // subscribe();
    };
  }, [subscribe]);

  const [addMessage] = useMutation(addMessageMutation);

  const onSendMessage = useCallback(
    (content) => {
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
            content,
            chat: {
              id: chatId,
              __typename: 'Chat',
            },
          },
        },
        // refetchQueries: [
        //   {
        //     query: getChatQuery,
        //     variables: { chatId: chatId },
        //   },
        // ],
        // update: (client, { data: addMessage }) => {
        //   // The readQuery method enables you to run GraphQL queries directly on your cache.
        //   let data = client.readQuery({
        //     query: getChatQuery,
        //     variables: { chatId: chatId },
        //   });

        //   console.log('efefe-caches', {
        //     ...data.chat,
        //     messages: [...data.chat.messages, addMessage.addMessage],
        //   });
        //   client.writeQuery({
        //     query: getChatQuery,
        //     variables: { chatId: chatId },
        //     data: {
        //       chat: {
        //         ...data.chat,
        //         messages: [...data.chat.messages, addMessage.addMessage],
        //       },
        //     },
        //   });
        // },
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

  // Chat was probably removed from cache by the subscription handler
  if (!chat) {
    return <Redirect to="/chats" />;
  }

  return (
    <Container>
      {chat?.id && <ChatRoomNavBar chat={chat} history={history} />}
      {chat?.messages && (
        <MessagesList
          messages={chat.messages}
          chatId={chatId}
          subscribeToMore={subscribeToMore}
        />
      )}
      <MessageInput onSendMessage={onSendMessage} />
    </Container>
  );
};

export default ChatsRoomScreen;
