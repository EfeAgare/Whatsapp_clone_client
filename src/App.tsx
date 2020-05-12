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
import { useCacheService } from './services/cache.service';

const App: React.FC = () => {
  useCacheService()
  return (
    <BrowserRouter>
      <MyAnimatedSwitch>
        <Route exact path="/chats" component={ChatsListScreen} />
        <Route exact path="/chats/:chatId" component={ChatsRoomScreen} />
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
