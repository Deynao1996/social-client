import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import useService from '../../hooks/useService';
import {useProvider} from '../../contexts/UserContext.js';
import useFeatures from '../../hooks/useFeatures.js';
import {RiUserFollowLine, RiUserUnfollowLine} from "react-icons/ri";
import './userBar.scss';


const UserBar = ({userId, profileUser}) => {
  const [friends, setFriends] = useState([]);
  const {getFriends, itemLoadingStatus} = useService();
  const {currentUser} = useProvider();
  const {showStatusModal, setRelationStatus, renderItemsContent} = useFeatures();

  function renderAllFriendsList(arr) {
    if (arr.length === 0) return;

    return arr.map(({_id, profilePicture, name, lastName}) => {
      return (
        <li key={_id}>
          <Link to={{
            pathname: `/profile/${_id}`}}>
              <img src={profilePicture} alt="friend"/>
              <span>{name} {lastName}</span>
          </Link>
        </li>
      );
    });
  };

  function renderFollowBtn(currentUser, profileUserId) {
    if (!currentUser) return;
    if (currentUser._id === profileUserId) return;
    if (currentUser.following.includes(profileUserId)) {
      return <FollowBtn 
        svg={<RiUserUnfollowLine/>} 
        text='Unfollow'
        userId={userId}
        />
    }
    if (!currentUser.following.includes(profileUserId)) {
      return <FollowBtn 
        svg={<RiUserFollowLine/>} 
        text='Follow'
        userId={userId}
        />
    }
  };

  useEffect(() => {
    getFriends(userId)
    .then(res => setFriends(res.followingUsers))
    .catch((e) => showStatusModal('Something went wrong', 'error')); 
    // eslint-disable-next-line
  }, [userId]);

  const followBtn = renderFollowBtn(currentUser, userId);


  return (
    <div className="user">
      <div className="user__info">
        {followBtn}
        <h4 className="user__info-title">User information</h4>
        <div className="user__info-descr">
          City: <span>{profileUser?.city}</span>
        </div>
        <div className="user__info-descr">
          From: <span>{profileUser?.from}</span>
        </div>
        <div className="user__info-descr">
          Relationship: {setRelationStatus(profileUser?.relationship)}
        </div>
      </div>
      <div className="user__friends">
        <h4 className="user__friends-title">{friends.length === 0 ? 'No friends yet' : 'User friends'}</h4>
        <ul 
          className="user__friends-list"
          style={{display: friends.length === 0 || itemLoadingStatus === 'loading' ? 'block' : 'grid'}}>
          {renderItemsContent(friends, itemLoadingStatus, renderAllFriendsList)}
        </ul>
      </div>
    </div>
  )
};

const FollowBtn = ({svg, text, userId}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {currentUser, setCurrentUser} = useProvider();
  const {followUser, unFollowUser} = useService();
  const {showStatusModal, startFollowUser} = useFeatures();
  
  const onChangeFollowStatus = async () => {
    setIsLoading(true);
      if (text === 'Follow') {
        startFollowUser(userId, currentUser, followUser, setCurrentUser, setIsLoading);
      } else {
        endFollowUser(userId);
      }
  };

  async function endFollowUser(userId) {
    try {
      await unFollowUser(userId, JSON.stringify({userId: currentUser._id}));
      setIsLoading(false);

      setCurrentUser(currentUser => {
        const newFollowingArray = currentUser.following.filter(id => id !== userId);
        return {...currentUser, following: newFollowingArray}
      })
    } catch (error) {
      showStatusModal('Something went wrong', 'error');  
    }
  };


  return (
    <button 
      className="user__info-follow"
      onClick={onChangeFollowStatus}
      disabled={isLoading}>
        <span className='user__info-text'>{text}</span>
        <span className="user__info-icon">
          {svg}
        </span>
    </button>
  )
};

export default UserBar;