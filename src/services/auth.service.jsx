import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';
import signUpMutation from '../graphQl/mutations/signUp.mutation';
import meQuery from '../graphQl/queries/me.query';
import { CircularProgress, makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    alignItems: 'center',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },

  padding: {
    paddingLeft: '15px'
  }
}));

const MyContext = React.createContext(null);

export const useMe = () => {
  return useContext(MyContext);
};

export const useSignUp = () => useMutation(signUpMutation);

export const isSignedIn = () => {
  const token = localStorage.getItem('token');

  if (token == null) {
    return false;
  } else {
    return true;
  }
};

export const withAuth = (Component) => {
  return (props) => {
    if (!isSignedIn()) {
      if (props.history.location.pathname === '/sign-in') {
        return null;
      }

      return <Redirect to="/sign-in" />;
    }

    const classes = useStyles();

    const { data, loading } = useQuery(meQuery, {
      fetchPolicy: 'cache-and-network',
    });


    if (loading)
      return (
        <div className={classes.root}>
          <CircularProgress />
        </div>
      );
    return (
      <MyContext.Provider value={data?.me}>
        <Component {...props} />
      </MyContext.Provider>
    );
  };
};
