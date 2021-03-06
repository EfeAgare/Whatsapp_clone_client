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
import signUpMutation from '../../graphQl/mutations/signUp.mutation';
import { useMutation } from 'react-apollo';

const SignUpForm = ({ history }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');

  const updateName = useCallback(({ target }) => {
    setError('');
    setName(target.value);
  }, []);

  const updateUsername = useCallback(({ target }) => {
    setError('');
    setUsername(target.value);
  }, []);

  const updatePassword = useCallback(({ target }) => {
    setError('');
    setPassword(target.value);
  }, []);

  const updatePasswordConfirm = useCallback(({ target }) => {
    setError('');
    setPasswordConfirm(target.value);
  }, []);

  const maySignUp = useCallback(() => {
    return !!(name && username && password && password === passwordConfirm);
  }, [name, username, password, passwordConfirm]);

  const [signUp] = useMutation(signUpMutation, {
    onCompleted({ signUp: { token } }) {
      localStorage.setItem('token', token);
      history.replace('/chats');
    },
    onError(error) {
      setError(error.message || error);
    },
  });

  const handleSignUp = useCallback(() => {
    signUp({ variables: { username, password, passwordConfirm, name } });
  }, [name, username, password, passwordConfirm, signUp]);

  return (
    <SignForm>
      <ActualForm>
        <Legend>Sign up</Legend>
        <Section
          style={{
            float: 'left',
            width: 'calc(50% - 10px)',
            paddingRight: '10px',
          }}>
          <TextField
            data-testid="name-input"
            label="Name"
            value={name}
            onChange={updateName}
            autoComplete="off"
            margin="normal"
          />
          <TextField
            data-testid="username-input"
            label="Username"
            value={username}
            onChange={updateUsername}
            autoComplete="off"
            margin="normal"
          />
        </Section>
        <Section
          style={{
            float: 'right',
            width: 'calc(50% - 10px)',
            paddingLeft: '10px',
          }}>
          <TextField
            data-testid="password-input"
            label="Password"
            type="password"
            value={password}
            onChange={updatePassword}
            autoComplete="off"
            margin="normal"
          />
          <TextField
            data-testid="password-confirm-input"
            label="Confirm password"
            type="password"
            value={passwordConfirm}
            onChange={updatePasswordConfirm}
            autoComplete="off"
            margin="normal"
          />
        </Section>
        <Button
          data-testid="sign-up-button"
          type="button"
          color="secondary"
          variant="contained"
          disabled={!maySignUp()}
          onClick={handleSignUp}>
          Sign up
        </Button>
        <ErrorMessage data-testid="error-message">{error}</ErrorMessage>
      </ActualForm>
    </SignForm>
  );
};

export default SignUpForm;
