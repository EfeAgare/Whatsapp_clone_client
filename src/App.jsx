import React from 'react';
import { ChatsListScreen } from './components/Chats/ChatsListScreen';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import ChatsRoomScreen from './components/ChatRoom/ChatsRoomScreen';
import MyAnimatedSwitch from './components/animation/AnimatedSwitch';

import AuthScreen from './components/AuthScreen/index';
import { withAuth } from './services/auth.service';
import ChatCreationScreen from './components/ChatCreationScreen/index';

const App = () => {
  return (
    <BrowserRouter>
      <MyAnimatedSwitch>
        <Route exact path="/chats" component={withAuth(ChatsListScreen)} />
        <Route
          exact
          path="/chats/:chatId"
          component={withAuth(ChatsRoomScreen)}
        />
        <Route
          exact
          path="/new-chat"
          component={withAuth(ChatCreationScreen)}
        />
        <Route exact path="/sign-(in|up)" component={AuthScreen} />
      </MyAnimatedSwitch>
      <Route exact path="/" render={redirectToChats} />
    </BrowserRouter>
  );
};

const redirectToChats = () => <Redirect to="/chats" />;

export default App;
