import React from 'react';
import { chats } from '../../db/db';
import moment from 'moment';

const ChatsList: React.FC = () => {
  return (
    <div>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id}>
            <img src={`${chat.picture}`} alt="Profile" />
            <div>{chat.name}</div>
            {chat.lastMessage && (
              <React.Fragment>
                <div>{chat.lastMessage.content}</div>
                <div>{moment(chat.lastMessage.createdAt).format('HH:mm')}</div>
              </React.Fragment>
            )}
          </li>
          // console.log(chat)
        ))}
      </ul>
    </div>
  );
};

export default ChatsList;
