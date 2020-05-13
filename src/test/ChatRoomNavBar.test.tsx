import { createMemoryHistory } from 'history';
import React from 'react';
import { cleanup, render, waitFor, fireEvent } from '@testing-library/react';
import ChatRoomNavBar from '../components/ChatRoom/ChatRoomNavbar';
import { ApolloProvider } from '@apollo/react-hooks';
// import { RemoveChatDocument } from '../graphQl/types';
import { mockApolloClient } from '../test-helpers';

describe('ChatNavbar', () => {
  afterEach(cleanup);

  it('renders chat data', () => {
    const time = new Date('1 Jan 2019 GMT');
    const chat = {
      id: '1',
      name: 'Foo Bar',
      picture: 'https://localhost:4000/picture.jpg',
      messages: [
        {
          id: '1',
          content: 'foo',
          createdAt: time,
        },
        {
          id: '2',
          content: 'bar',
          createdAt: time,
        },
      ],
    };

    const client = mockApolloClient({});
    const history = createMemoryHistory();

    {
      const { container, getByTestId } = render(
        <ApolloProvider client={client}>
          <ChatRoomNavBar chat={chat} history={history} />
        </ApolloProvider>
      );

      expect(getByTestId('chat-name')).toHaveTextContent('Foo Bar');
      expect(getByTestId('chat-picture')).toHaveAttribute(
        'src',
        'https://localhost:4000/picture.jpg'
      );
    }
  });

  it('goes back on arrow click', async () => {
    const time = new Date('1 Jan 2019 GMT');
    const chat = {
      id: '1',
      name: 'Foo Bar',
      picture: 'https://localhost:4000/picture.jpg',
      messages: [
        {
          id: '1',
          content: 'foo',
          createdAt: time,
        },
        {
          id: '2',
          content: 'bar',
          createdAt: time,
        },
      ],
    };

    const history = createMemoryHistory();
    const client = mockApolloClient({});

    history.push('/chats/1');

    await waitFor(() => expect(history.location.pathname).toEqual('/chats/1'));

    {
      const { container, getByTestId } = render(
        <ApolloProvider client={client}>
          <ChatRoomNavBar chat={chat} history={history} />
        </ApolloProvider>
      );

      fireEvent.click(getByTestId('back-button'));

      await waitFor(() => expect(history.location.pathname).toEqual('/chats'));
    }
  });

  it('goes back on chat removal', async () => {
    const client = mockApolloClient([
      {
        request: {
          // query: RemoveChatDocument,
          variables: { chatId: '1' },
        },
        result: {
          data: {
            removeChat: '1',
          },
        },
      },
    ]);

    const time = new Date('1 Jan 2019 GMT');
    const chat = {
      id: '1',
      name: 'Foo Bar',
      picture: 'https://localhost:4000/picture.jpg',
      messages: [
        {
          id: '1',
          content: 'foo',
          createdAt: time,
        },
        {
          id: '2',
          content: 'bar',
          createdAt: time,
        },
      ],
    };

    const history = createMemoryHistory();

    history.push('/chats/1');

    await waitFor(() => expect(history.location.pathname).toEqual('/chats/1'));

    {
      const { container, getByTestId } = render(
        <ApolloProvider client={client}>
          <ChatRoomNavBar chat={chat} history={history} />
        </ApolloProvider>
      );

      fireEvent.click(getByTestId('delete-button'));

      await waitFor(() => expect(history.location.pathname).toEqual('/chats'));
    }
  });
});
