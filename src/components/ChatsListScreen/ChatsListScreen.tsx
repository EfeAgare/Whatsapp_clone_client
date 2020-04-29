import React from 'react';
import { ChatsNavbar } from './ChatsNavbar';
import ChatsList from './ChatsList';

export const ChatsListScreen = () => {
  return (
    <div>
      <ChatsNavbar />
      <ChatsList />
    </div>
  );
};
