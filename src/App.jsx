import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChatsListScreen } from './components/Chats/ChatsListScreen';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import ChatsRoomScreen from './components/ChatRoom/ChatsRoomScreen';
import MyAnimatedSwitch from './components/animation/AnimatedSwitch';

import AuthScreen from './components/AuthScreen/index';
import { withAuth } from './services/auth.service';
import ChatCreationScreen from './components/ChatCreationScreen/index';
import { UserProfile } from './components/Users/UserProfile';

const App = () => {
  
  return (
    <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      <MyAnimatedSwitch>
      
        <Route exact path="/chats" component={withAuth(ChatsListScreen)} />
        <Route exact path="/user/:id" component={withAuth(UserProfile)} />
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
