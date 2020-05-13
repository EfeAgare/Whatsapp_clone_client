import React from 'react';
import { ChatsListScreen } from './components/Chats/ChatsListScreen';
import {
  BrowserRouter,
  Route,
  Redirect,
  Switch,
  RouteComponentProps,
} from 'react-router-dom';
import ChatsRoomScreen from './components/chatRoom/ChatsRoomScreen';
import MyAnimatedSwitch from './components/animation/AnimatedSwitch';

import AuthScreen from './components/AuthScreen/index';
import { withAuth } from './services/auth.service';

const App: React.FC = () => {

  return (
    <BrowserRouter>
      <MyAnimatedSwitch>
        <Route exact path="/chats" component={withAuth(ChatsListScreen)} />
        <Route exact path="/chats/:chatId" component={withAuth(ChatsRoomScreen)} />
        <Route exact path="/sign-(in|up)" component={AuthScreen} />
        {/* <Route
        exact
        path="/chats/:chatId"
        component={({ match }: RouteComponentProps<{ chatId: string }>) => (
          
          <ChatsRoomScreen chatId={match.params.chatId} />
        )}
      /> */}
      </MyAnimatedSwitch>
      <Route exact path="/" render={redirectToChats} />
    </BrowserRouter>
  );
};

const redirectToChats = () => <Redirect to="/chats" />;

export default App;
