
import { defaultDataIdFromObject } from 'apollo-cache-inmemory';
import * as fragments from '../graphQl/fragments';
import { getChatsQuery } from '../graphQl/queries/chats.query';

import { getChatQuery } from '../graphQl/queries/chat.query';


export const writeMessage = (client, message) => {

  // let fullChat;

  // // defaultDataIdFromObject used in readFragment
  // const chatIdFromStore = defaultDataIdFromObject(message.chat);

  // if (chatIdFromStore === null) {
  //   return;
  // }
  // try {
  //   // The readFragment method enables you to read data from any normalized cache
  //   // object that was stored as part of any query result
  //   // `id` is any id that could be returned by `dataIdFromObject`.
  //   fullChat = client.readFragment({
  //     id: chatIdFromStore,
  //     fragment: fragments.fullChat,
  //     fragmentName: 'FullChat',
  //   });
  // } catch (e) {
  //   console.log(e);
  //   return;
  // }

  // if (fullChat === null || fullChat.messages === null) {
  //   return;
  // }

  // if (fullChat.messages.some((m) => m.id === message.id)) return;

  // fullChat.messages.push(message);
  // fullChat.lastMessage = message;

  // client.writeFragment({
  //   id: chatIdFromStore,
  //   fragment: fragments.fullChat,
  //   fragmentName: 'FullChat',
  //   data: fullChat,
  // });

  let data;
  try {
    // The readQuery method enables you to run GraphQL queries directly on your cache.
    data = client.readQuery({
      query: getChatQuery,
      variables: { chatId: message.chat.id },
    });
  } catch (e) {
    console.log(e);
    return;
  }

  if (!data || data === null) {
    return null;
  }
  if (!data.chat || data.chat === undefined) {
    return null;
  }
  const chats = data.chat;

  console.log('chats', chats);

  client.writeQuery({
    query: getChatQuery,
    data: { chat: chats },
  });
};

export const writeChat = (client, chat) => {
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
    data = client.readQuery({
      query: getChatsQuery,
    });
  } catch (e) {
    console.log(e);
    return;
  }

  if (!data) return;

  const chats = data.chats;

  if (!chats) return;
  if (chats.some((c) => c.id === chat.id)) return;

  chats.unshift(chat);

  client.writeQuery({
    query: getChatsQuery,
    data: { chats },
  });
};

export const eraseChat = (client, chatId) => {
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

  let data;
  try {
    data = client.readQuery({
      query: getChatsQuery,
    });
  } catch (e) {
    console.log(e);
    return;
  }

  if (!data || !data.chats) return;

  const chats = data.chats;

  if (!chats) return;

  const chatIndex = chats.findIndex((c) => c.id === chatId);

  if (chatIndex === -1) return;

  // The chat will appear at the top of the ChatsList component
  chats.splice(chatIndex, 1);

  client.writeQuery({
    query: getChatsQuery,
    data: { chats: chats },
  });
};
