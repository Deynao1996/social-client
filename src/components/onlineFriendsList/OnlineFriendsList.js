import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useProvider} from '../../contexts/UserContext.js';
import useService from '../../hooks/useService.js';
import {BiMessageAdd} from "react-icons/bi";
import useFeatures from '../../hooks/useFeatures.js';
import './onlineFriendsList.scss';

const OnlineFriendsList = ({isMessenger}) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const {currentUser, setUserConversations, userConversations} = useProvider();
  const {itemLoadingStatus, getFriends, createConversation} = useService();
  const {showStatusModal, onAddUserConversation, renderItemsContent} = useFeatures();
  
  function renderOnlineFriendsList(arr) {
    if (arr.length === 0) return;
    
    return arr.map(({_id, profilePicture, name, lastName}) => {
      const isUserExist = userConversations.find(({members}) => members.includes(_id));

      return (
        <li 
          className="onlineFriendsList__item"
          key={_id}>
            <Link to={`/profile/${_id}`} className="onlineFriendsList__link">
              <div className="onlineFriendsList__logo">
                <img src={profilePicture} alt="person"/>
                <div></div>
              </div>
              <span>{name} {lastName}</span>
            </Link>
          {isMessenger && !isUserExist ?  
            <div 
              className="onlineFriendsList__item-add" 
              title="Add users to conversation"
              onClick={() => onAddUserConversation(currentUser, _id, setUserConversations, createConversation)}>
                <BiMessageAdd/>
            </div> : null}
        </li>
      );
    });
  };

  useEffect(() => {
    if (currentUser) {
      getFriends(currentUser._id)
      .then(res => setOnlineUsers(res.followingUsers))
      .catch((e) => showStatusModal("Couldn't fetch online friends list. Please try later", 'error')); 
    }
    // eslint-disable-next-line
  }, [currentUser?.following.length]);


  return (
    <ul className="onlineFriendsList">
      {renderItemsContent(onlineUsers, itemLoadingStatus, renderOnlineFriendsList)}
    </ul>
  )
};

export default OnlineFriendsList;