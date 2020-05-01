import React from 'react';
import { ChatsListScreen } from './components/Chats/ChatsListScreen';
import { BrowserRouter, Route, Redirect, Switch, RouteComponentProps } from 'react-router-dom';
import ChatsRoomScreen from './components/Chats/ChatsRoomScreen';

const App: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/chats" component={ChatsListScreen} />
      <Route exact path="/chats/:chatId" component={ChatsRoomScreen} />
      {/* <Route
        exact
        path="/chats/:chatId"
        component={({ match }: RouteComponentProps<{ chatId: string }>) => (
          
          <ChatsRoomScreen chatId={match.params.chatId} />
        )}
      /> */}
    </Switch>
    <Route exact path="/" render={redirectToChats} />
  </BrowserRouter>
);

const redirectToChats = () => <Redirect to="/chats" />;

export default App;
