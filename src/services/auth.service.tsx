import React, { useCallback, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { useApolloClient } from '@apollo/react-hooks';
import { useCacheService } from './cache.service';
import { useSignInMutation, User, useMeQuery, useSignUpMutation } from '../graphQl/types';

const MyContext = React.createContext<User | null>(null);

export const useMe = () => {
  return useContext(MyContext);
};

export const useSignIn = useSignInMutation;

export const useSignUp = useSignUpMutation;

export const useSignOut = () => {
  const client = useApolloClient();

  return useCallback(() => {
    // "expires" represents the lifespan of a cookie. Beyond that date the cookie will
    // be deleted by the browser. "expires" cannot be viewed from "document.cookie"
    document.cookie = `authToken=;expires=${new Date(0)}`;

    // Clear cache
    return client.clearStore();
  }, [client]);
};

export const isSignedIn = () => {
  return /authToken=.+(;|$)/.test(document.cookie);
};

export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return (props: any) => {
    if (!isSignedIn()) {
      if (props.history.location.pathname === '/sign-in') {
        return null;
      }

      return <Redirect to="/sign-in" />;
    }

    // useCacheService();

    const signOut = useSignOut();
    const { data, error, loading } = useMeQuery();

    if (loading) return null;

    if (data === undefined) return null;

    if (error || !data.me) {
      signOut();

      return <Redirect to="/sign-in" />;
    }

    return (
      <MyContext.Provider value={data.me}>
        <Component {...(props as P)} />
      </MyContext.Provider>
    );
  };
};
