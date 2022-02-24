import {useState} from 'react';
import {Outlet} from 'react-router-dom';
import Header from '../../components/header/Header.js';
import ConversationList from '../../components/conversationList/ConversationList.js';
import OnlineFriendsList from '../../components/onlineFriendsList/OnlineFriendsList.js';
import FriendsList from '../../components/friendsList/FriendsList.js';
import './messengerLayout.scss';


const MessengerLayout = () => {
  const [renderFriendsList, setRenderFriendsList] = useState('online');
  const [receiveMessageUsers, setReceiveMessageUsers] = useState([]);

  const context = {
    receiveMessageUsers,
    setReceiveMessageUsers
  };


  return (
    <>
      <Header />  
      <div className="messenger">
        <div className="chat__menu">
          <ConversationList
            setReceiveMessageUsers={setReceiveMessageUsers}
            receiveMessageUsers={receiveMessageUsers}
          />
        </div>
        <Outlet
          context={context}
        />
        <div className="chat__online">
          <div className="chat__online-btns">
            <button 
              onClick={() => setRenderFriendsList('online')} 
              className={`chat__online-btn ${renderFriendsList === 'online' ? 'chat__online-btn_active' : ''}`}>
                Online Friends
            </button>
            <button 
              onClick={() => setRenderFriendsList('all')} 
              className={`chat__online-btn ${renderFriendsList === 'all' ? 'chat__online-btn_active' : ''}`}>
                All Friends
            </button>
          </div>
          {renderFriendsList === 'online' ? <OnlineFriendsList isMessenger={true}/> : <FriendsList isMessenger={true}/>}
        </div>
      </div>
    </>
  )
};

export default MessengerLayout;