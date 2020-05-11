import gql from 'graphql-tag';
import { FRAGMENT_CHATS } from '../fragments/fullChat.fragment';

export const getChatQuery = gql`
  query GetChat($chatId: ID!) {
    chat(chatId: $chatId) {
      ...FullChat
    }
  }
  ${FRAGMENT_CHATS}
`;

