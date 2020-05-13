import { DataProxy } from 'apollo-cache';
import { defaultDataIdFromObject } from 'apollo-cache-inmemory';
import * as fragments from '../graphQl/fragments';
import { getChatsQuery } from '../graphQl/queries/chats.query';
import {
  MessageFragment,
  useMessageAddedSubscription,
  GetChatsQuery,
  ChatFragment,
  useChatAddedSubscription,
  useChatRemovedSubscription,
} from '../graphQl/types';

type Client = Pick<
  DataProxy,
  'readFragment' | 'writeFragment' | 'readQuery' | 'writeQuery'
>;

export const useCacheService = () => {
  useMessageAddedSubscription({
    onSubscriptionData: ({ client, subscriptionData: { data } }) => {
      if (data) {
        writeMessage(client, data.messageAdded);
      }
    },
  });

  useChatAddedSubscription({
    onSubscriptionData: ({ client, subscriptionData: { data } }) => {
      if (data) {
        writeChat(client, data.chatAdded);
      }
    },
  });

  useChatRemovedSubscription({
    onSubscriptionData: ({ client, subscriptionData: { data } }) => {
      if (data) {
        eraseChat(client, data.chatRemoved);
      }
    },
  });
};

export const writeMessage = (client: Client, message: MessageFragment) => {
  type FullChat = { [key: string]: any };
  let fullChat;

  // defaultDataIdFromObject used in readFragment
  const chatIdFromStore = defaultDataIdFromObject(message.chat);

  if (chatIdFromStore === null) {
    return;
  }
  try {
    // The readFragment method enables you to read data from any normalized cache
    // object that was stored as part of any query result
    // `id` is any id that could be returned by `dataIdFromObject`.
    fullChat = client.readFragment<FullChat>({
      id: chatIdFromStore,
      fragment: fragments.fullChat,
      fragmentName: 'FullChat',
    });
  } catch (e) {
    console.log(e);
    return;
  }

  if (fullChat === null || fullChat.messages === null) {
    return;
  }

  if (fullChat.messages.some((m: any) => m.id === message.id)) return;

  fullChat.messages.push(message);
  fullChat.lastMessage = message;

  client.writeFragment({
    id: chatIdFromStore,
    fragment: fragments.fullChat,
    fragmentName: 'FullChat',
    data: fullChat,
  });

  let data;
  try {
    // The readQuery method enables you to run GraphQL queries directly on your cache.
    data = client.readQuery<GetChatsQuery>({
      query: getChatsQuery,
      variables: { id: message.chat?.id },
    });
  } catch (e) {
    console.log(e);
    return;
  }

  if (!data || data === null) {
    return null;
  }
  if (!data.chats || data.chats === undefined) {
    return null;
  }
  const chats = data.chats;

  console.log('chats', chats);
  const chatIndex = chats.findIndex((c: any) => {
    if (message === null || message.chat === null) return -1;
    return c.id === message?.chat?.id;
  });
  if (chatIndex === -1) return;
  const chatWhereAdded = chats[chatIndex];

  // The chat will appear at the top of the ChatsList component
  chats.splice(chatIndex, 1);
  chats.unshift(chatWhereAdded);

  client.writeQuery({
    query: getChatsQuery,
    data: { chats: chats },
  });
};

export const writeChat = (client: Client, chat: ChatFragment) => {
  const chatId = defaultDataIdFromObject(chat);
  if (chatId === null) {
    return;
  }

  client.writeFragment({
    id: chatId,
    fragment: fragments.chat,
    fragmentName: 'Chat',
    data: chat,
  });

  let data;
  try {
    data = client.readQuery<GetChatsQuery>({
      query: getChatsQuery,
    });
  } catch (e) {
    return;
  }

  if (!data) return;

  const chats = data.chats;

  if (!chats) return;
  if (chats.some((c: any) => c.id === chat.id)) return;

  chats.unshift(chat);

  client.writeQuery({
    query: getChatsQuery,
    data: { chats },
  });
};

export const eraseChat = (client: Client, chatId: string) => {
  const chatType = {
    __typename: 'Chat',
    id: chatId,
  };

  const chatIdFromObject = defaultDataIdFromObject(chatType);
  if (chatIdFromObject === null) {
    return;
  }

  client.writeFragment({
    id: chatIdFromObject,
    fragment: fragments.fullChat,
    fragmentName: 'FullChat',
    data: null,
  });

  let data: GetChatsQuery | null;
  try {
    data = client.readQuery<GetChatsQuery>({
      query: getChatsQuery,
    });
  } catch (e) {
    return;
  }

  if (!data || !data.chats) return;

  const chats = data.chats;

  if (!chats) return;

  const chatIndex = chats.findIndex((c: any) => c.id === chatId);

  if (chatIndex === -1) return;

  // The chat will appear at the top of the ChatsList component
  chats.splice(chatIndex, 1);

  client.writeQuery({
    query: getChatsQuery,
    data: { chats: chats },
  });
};
