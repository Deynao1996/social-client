import {Routes, Route} from 'react-router-dom';
import {UserProvider} from '../../contexts/UserContext.js';
import MainLayout from '../../layouts/mainLayout/MainLayout.js';
import MessengerLayout from '../../layouts/messengerLayout/MessengerLayout.js';
import AuthLayout from '../../layouts/authLayout/AuthLayout.js';
import LoginContent from '../contents/LoginContent.js';
import HomeContent from '../contents/HomeContent.js';
import ProfileContent from '../contents/ProfileContent.js';
import RegisterContent from '../contents/RegisterContent.js';
import ChatBox from '../chatBox/ChatBox.js';
import ScrollToTop from '../scrollToTop/ScrollToTop.js';


const App = () => {
  return (
    <UserProvider>
      <ScrollToTop>
        <Routes>
          <Route path="/" element={<MainLayout/>}>
            <Route index element={<HomeContent/>}/>
            <Route path="profile/:userId" element={<ProfileContent/>}/>
          </Route>
          <Route path="/auth" element={<AuthLayout/>}>
            <Route path="register" element={<RegisterContent/>}/>
            <Route path="login" element={<LoginContent/>}/>
          </Route>
          <Route path="/chat" element={<MessengerLayout/>}>
            <Route index element={<ChatBox/>}/>
            <Route path=":conversationId"element={<ChatBox/>}/>
          </Route>
        </Routes>
      </ScrollToTop>
    </UserProvider>
  )
};

export default App;
