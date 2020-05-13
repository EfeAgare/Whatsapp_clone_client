import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import {
  cleanup,
  render,
  waitFor,
  fireEvent,
  screen,
} from '@testing-library/react';
import ChatsList from '../components/Chats/ChatsList';
import { createBrowserHistory } from 'history';

import { mockApolloClient } from '../test-helpers';
import { getChatsQuery } from '../graphQl/queries/chats.query';

describe('ChatsList', () => {
  afterEach(() => {
    cleanup();

    delete window.location;
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: '/',
      },
      writable: true,
    });
  });

  it('renders fetched chats data', async () => {
    const client = mockApolloClient([
      {
        request: { query: getChatsQuery },
        result: {
          data: {
            chats: [
              {
                __typename: 'Chat',
                id: 1,
                name: 'Foo Bar',
                picture: 'https://localhost:4000/picture.jpg',
                lastMessage: {
                  __typename: 'Message',
                  id: 1,
                  content: 'Hello',
                  isMine: true,
                  createdAt: new Date('1 Jan 2019 GMT'),
                  chat: {
                    __typename: 'Chat',
                    id: 1,
                  },
                },
              },
            ],
          },
        },
      },
    ]);

    {
      const history = createBrowserHistory();

      const { container, getByTestId } = render(
        <ApolloProvider client={client}>
          <ChatsList history={history} />
        </ApolloProvider>
      );

      await waitFor(() => container);

      // expect(getByTestId('name')).toHaveTextContent('Foo Bar');
      // expect(getByTestId('picture')).toHaveAttribute(
      //   'src',
      //   'https://localhost:4000/picture.jpg'
      // );
      // expect(getByTestId('content')).toHaveTextContent('Hello');
      // expect(getByTestId('date')).toHaveTextContent('01:00');
    }
  });

  it('should navigate to the target chat room on chat item click', async () => {
    const client = mockApolloClient([
      {
        request: { query: getChatsQuery },
        result: {
          data: {
            chats: [
              {
                __typename: 'Chat',
                name: 'Foo Bar',
                id: 1,
                picture: 'https://localhost:4000/picture.jpg',
                lastMessage: {
                  __typename: 'Message',
                  id: 1,
                  content: 'Hello',
                  createdAt: new Date('1 Jan 2019 GMT'),
                  isMine: true,
                  chat: {
                    __typename: 'Chat',
                    id: 1,
                  },
                },
              },
            ],
          },
        },
      },
    ]);

    const history = createBrowserHistory();

    {
      const { container, getByTestId } = render(
        <ApolloProvider client={client}>
          <ChatsList history={history} />
        </ApolloProvider>
      );

      await waitFor(() => container);

      fireEvent.click(getByTestId('chat'));

      await waitFor(() =>
        expect(history.location.pathname).toEqual('/chats/1')
      );
    }
  });
});
