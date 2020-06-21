import moment from 'moment';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'styled-components';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
  CardHeader,
  Card,
  makeStyles,
  IconButton,
  CardActions,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import deleteMessageSubscription from '../../graphQl/subscriptions/deleteMessage.subscription';
import { useMutation } from '@apollo/react-hooks';
import deleteMessageMutation from '../../graphQl/mutations/deleteMessage.mutation';

const Container = styled.div`
  display: block;
  flex: 2;
  overflow-y: overlay;
  padding: 0 15px;
`;

const MessageItem = styled.div`
  display: inline-block;
  position: relative;
  max-width: 100%;
  border-radius: 7px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  margin-top: 5px;
  width: 500px;
  clear: both;
  cursor: pointer;

  &::after {
    content: '';
    display: table;
    clear: both;
  }

  &::before {
    content: '';
    position: absolute;
    bottom: 3px;
    width: 12px;
    height: 19px;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: contain;
  }

  ${(props) =>
    props.isMine
      ? css`
          float: right;
          background-color: #dcf8c6;

          &::before {
            right: -11px;
            background-image: url(/assets/message-mine.png);
          }
        `
      : css`
          float: left;
          background-color: #fff;

          &::before {
            left: -11px;
            background-image: url(/assets/message-other.png);
          }
        `}
`;

const Contents = styled.div`
  padding: 5px 7px;
  word-wrap: break-word;

  &::after {
    content: ' \\00a0\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0\\00a0';
    display: inline;
  }
`;

const Timestamp = styled.div`
  position: absolute;
  right: 7px;
  color: gray;
  font-size: 12px;
`;

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: 'unset',
    backgroundColor: 'unset',
  },
  header: {
    padding: 'unset',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },

  expandOpen: {
    transform: 'rotate(180deg)',
  },
  time: {
    justifyContent: 'flex-end',
    padding: 'unset',
  },
  listItem: {
    width: '30%',
    position: 'absolute',
    top: '2px',
    zIndex: '10',
    left: ' 63%',
    backgroundColor: theme.palette.background.paper,
  },
}));

const MessageList = ({ messages, chatId, subscribeToMore }) => {
  const classes = useStyles();
  const selfRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [messageId, setMessageId] = useState(null);

  const handleSelect = (id) => {
    setOpenModal(!openModal);
    setMessageId(id);
  };

  const [deleteMessage] = useMutation(deleteMessageMutation);

  const handleDelete = useCallback(() => {
    if (messageId === null) return null;
    deleteMessage({
      variables: { chatId, messageId },
    });
  }, [deleteMessage, chatId, messageId]);

  const messageDeleteSubscription = useCallback(
    (messageId) => {
      subscribeToMore({
        document: deleteMessageSubscription,
        variables: { chatId: chatId, messageId: messageId },

        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data.deleteMessage) return prev.chat;
          const messages = prev.chat.messages.filter(
            (item) => item.id !== messageId
          );

          return {
            chat: {
              ...prev.chat,
              messages: messages,
            },
          };
        },
      });
    },
    [subscribeToMore, chatId]
  );

  useEffect(() => {
    if (!selfRef.current) return;

    messageDeleteSubscription(messageId);

    const selfDOMNode = ReactDOM.findDOMNode(selfRef.current);

    selfDOMNode.scrollTop = Number.MAX_SAFE_INTEGER;
    
    return () => {};
  }, [messages.length, messageDeleteSubscription, messageId]);

  return (
    <Container ref={selfRef}>
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          data-testid="message-item"
          isMine={message.isMine}>
          <Contents data-testid="message-content">
            <Card className={classes.root}>
              <CardHeader
                className={classes.header}
                title={message.content}
                action={
                  message.isMine ? (
                    <IconButton
                      aria-label="settings"
                      onClick={() => handleSelect(message.id)}>
                      <MoreVertIcon />
                    </IconButton>
                  ) : null
                }
              />

              <CardActions className={classes.time}>
                <Timestamp>
                  {moment(message.createdAt).format('HH:mm')}{' '}
                </Timestamp>
              </CardActions>
            </Card>
          </Contents>
          {openModal && message.id === messageId && (
            <List
              onClick={() => setOpenModal(false)}
              component="nav"
              className={classes.listItem}
              aria-label="mailbox folders">
              <ListItem button>
                <ListItemText
                  primary="Delete"
                  onClick={() => handleDelete(messageId)}
                />
              </ListItem>
            </List>
          )}
        </MessageItem>
      ))}
    </Container>
  );
};

export default MessageList;
