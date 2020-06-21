import MaterialList from '@material-ui/core/List';
import MaterialItem from '@material-ui/core/ListItem';
import gql from 'graphql-tag';
import React from 'react';
import styled from 'styled-components';
import * as fragments from '../../graphQl/fragments';
import { useQuery } from '@apollo/react-hooks';
import { CircularProgress } from '@material-ui/core';
import { useStyles } from '../../services/auth.service';
import { MessageContent } from '../Chats/ChatsList';

const ActualList = styled(MaterialList)`
  padding: 0;
`;

const UserItem = styled(MaterialItem)`
  position: relative;
  padding: 7.5px 15px;
  display: flex;
  cursor: pinter;
`;

const ProfilePicture = styled.img`
  height: 50px;
  width: 50px;
  object-fit: cover;
  border-radius: 50%;
`;

const NameInfo = styled.div`
  width: calc(100% - 60px);
  height: 46px;
  padding: 15px 0;
  margin-left: 10px;
  position: relative;
`;

const Name = styled.div`
  font-weight: bold;
`;

export const UsersListQuery = gql`
  query UsersList {
    users {
      ...User
    }
  }
  ${fragments.user}
`;

const UsersList = ({ onUserPick }) => {
  const classes = useStyles();

  const { data, loading } = useQuery(UsersListQuery);

  if (data === undefined) return null;

  if (loading)
    return (
      <div className={classes.root}>
        <CircularProgress />
      </div>
    );
  const users = data.users;

  return (
    <ActualList>
      {users.map((user) => (
        <UserItem
          key={user.id}
          data-testid="user"
          onClick={onUserPick.bind(null, user)}
          button>
          {user !== null && user.picture !== null && (
            <React.Fragment>
              <ProfilePicture data-testid="picture" src={user.picture} />
              <NameInfo>
                <Name data-testid="name" className={classes.padding}>
                  {user.name}
                </Name>
                <React.Fragment>
                  <MessageContent
                    data-testid="content"
                    className={classes.padding}>
                    {user.aboutme}
                  </MessageContent>
                </React.Fragment>
              </NameInfo>
            </React.Fragment>
          )}
        </UserItem>
      ))}
    </ActualList>
  );
};

export default UsersList;
