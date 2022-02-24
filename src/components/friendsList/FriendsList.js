import {useEffect} from 'react';
import {Link} from 'react-router-dom';
import useService from '../../hooks/useService.js';
import {useProvider} from '../../contexts/UserContext.js';
import useFeatures from '../../hooks/useFeatures.js';
import {BiMessageAdd} from "react-icons/bi";
import './friendsList.scss';


const FriendsList = ({isMessenger}) => {
  const {currentUser, followings, setFollowings, userConversations, setUserConversations} = useProvider();
  const {getFriends, itemLoadingStatus, createConversation} = useService();
  const {showStatusModal, onAddUserConversation, renderItemsContent} = useFeatures();

  function renderFriendsList(arr) {
    if (arr.length === 0) {
      return (
        <>
          <h4 className="statusMessage">You don't have any friends yet</h4>
          <Link 
            className="sidebar__link" 
            to={{
              pathname: "/",
              search: "?user=",
            }}>Find new friends</Link>
        </>
      )
    }
    
    return arr.map(({_id, profilePicture, name, lastName}) => {
      const isUserExist = userConversations.find(({members}) => members.includes(_id));

      return (
        <li key={_id}>
          <Link to={`/profile/${_id}`} className="sidebar__friendsList-link">
            <img src={profilePicture} alt="char"/>
            <span>{name} {lastName}</span>
          </Link>
          {isMessenger && !isUserExist ? 
            <div 
              className="sidebar__friendsList-add" 
              title="Add user to conversation"
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
      .then(res => setFollowings(res.followingUsers))
      .catch((e) => showStatusModal("Couldn't fetch friends list. Please try later", 'error')); 
    }
    // eslint-disable-next-line
  }, [currentUser?.following.length]);

  const friendsListContent = renderItemsContent(followings, itemLoadingStatus, renderFriendsList); 

  
  return (
    <ul className="friendsList">
      {friendsListContent}
    </ul>
  )
};

export default FriendsList;