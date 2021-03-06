import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { ApolloProvider } from '@apollo/react-hooks';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import client from './apolloClientSubscription/client';

const theme = createMuiTheme({
  overrides: {
    MuiTypography: {
      h5: {
        fontSize: 'unset',
        textAlign: 'justify',
      },
    },
  },
  palette: {
    primary: { main: '#2c6157' },
    secondary: { main: '#6fd056' },
  },
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </MuiThemeProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
