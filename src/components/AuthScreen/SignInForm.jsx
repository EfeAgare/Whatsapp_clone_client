import React from 'react';
import { useCallback, useState } from 'react';
import {
  SignForm,
  ActualForm,
  Legend,
  Section,
  TextField,
  Button,
  ErrorMessage,
} from './form-components';
import { useMutation } from '@apollo/react-hooks';
import signInMutation from '../../graphQl/mutations/signIn.mutation';

const SignInForm = ({ history }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [signIn] = useMutation(signInMutation, {
    onCompleted({ signIn: { token } }) {
      localStorage.setItem('token', token);
      history.replace('/chats');
    },
    onError(error) {
      setError(error.message || error);
    },
  });

  const onUsernameChange = useCallback(({ target }) => {
    setError('');
    setUsername(target.value);
  }, []);

  const onPasswordChange = useCallback(({ target }) => {
    setError('');
    setPassword(target.value);
  }, []);

  const maySignIn = useCallback(() => {
    return !!(username && password);
  }, [username, password]);

  const handleSignIn = useCallback(() => {
    signIn({ variables: { username, password } });
  }, [username, password, signIn]);

  return (
    <SignForm>
      <ActualForm>
        <Legend>Sign in</Legend>
        <Section style={{ width: '100%' }}>
          <TextField
            data-testid="username-input"
            label="Username"
            value={username}
            onChange={onUsernameChange}
            margin="normal"
            placeholder="Enter your username"
          />
          <TextField
            data-testid="password-input"
            label="Password"
            type="password"
            value={password}
            onChange={onPasswordChange}
            margin="normal"
            placeholder="Enter your password"
          />
        </Section>
        <Button
          data-testid="sign-in-button"
          type="button"
          color="secondary"
          variant="contained"
          disabled={!maySignIn()}
          onClick={handleSignIn}>
          Sign in
        </Button>
        <ErrorMessage data-testid="error-message">{error}</ErrorMessage>
      </ActualForm>
    </SignForm>
  );
};

export default SignInForm;
