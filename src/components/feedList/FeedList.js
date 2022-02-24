import {useEffect, useState} from 'react';
import {useLocation, useSearchParams} from 'react-router-dom';
import FeedForm from '../feedForm/FeedForm.js';
import FeedPost from '../feedPost/FeedPost.js';
import {useProvider} from '../../contexts/UserContext.js';
import useService from '../../hooks/useService.js';
import useFeatures from '../../hooks/useFeatures.js';
import './feedList.scss';

const FeedList = ({userId, profileUser}) => {
  const [feeds, setFeeds] = useState([]);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const {currentUser, followings} = useProvider();
  const {getTimelinePosts, toggleLikePost, deletePost, itemLoadingStatus} = useService();
  const {showStatusModal, renderItemsContent, setTimeAgo} = useFeatures();

  const onLikePost = async (postId) => {
    let lickedPost = feeds.find(feed => feed._id === postId);
    const index = lickedPost.likes.indexOf(currentUser._id);

    if (index < 0) {
      lickedPost.likes.push(currentUser._id);
    } else {
      lickedPost.likes.splice(index, 1);
    }

    setFeeds(feeds => {
      return feeds.map(feed => feed._id === postId ? {...lickedPost} : feed);
    });

    try {
      await toggleLikePost(postId, JSON.stringify({userId: currentUser._id}));
    } catch (e) {
      showStatusModal("Something went wrong. Please try later", 'error');
    }
  };

  const onDeletePost = async (feedId) => {
    setFeeds(feeds => feeds.filter(feed => feed._id !== feedId));
    try {
      await deletePost(feedId)
    } catch (e) {
      showStatusModal("Something went wrong. Please try later", 'error');
    }
  };

  function getFilteredFeeds(userId) {
    const queryTag = searchParams.get('tag') || '';

    if (feeds.length === 0 || (location.pathname === '/' && !queryTag)) return feeds;
    if (queryTag) {
      return feeds.filter(feed => feed.tags.includes(queryTag));
    } else {
      return feeds.filter(feed => feed.userId === userId);
    }
  };

  function getUserInfo(id) {
    let userName = '';
    let userPhoto = '';

    if (profileUser) {
      userPhoto = profileUser ? profileUser.profilePicture : '';
      userName = profileUser ? profileUser.name + ' ' + profileUser.lastName : '';
    } else {
      const user = followings.find(friend => friend._id === id);

      userPhoto = user ? user.profilePicture : '';
      userName = user ? user.name + ' ' + user.lastName : '';
    }

    return {
      userName,
      userPhoto
    }
  };

  function renderUsersFeeds(arr) {
    if (arr.length === 0) {
      return <h4 className='statusMessage'>Still no any post here</h4>
    }
    
    return arr.map(props => {
      const totalLikes = props.likes?.length === 0 ? '0' : props.likes.length;
      const timeAgo = setTimeAgo(props.createdAt);

      let userName = '';
      let userPhoto = '';

      if (props.userId === currentUser?._id) {
        userName = currentUser.name + ' ' + currentUser.lastName;
        userPhoto = currentUser.profilePicture;
      } else {
        userName = getUserInfo(props.userId).userName;
        userPhoto = getUserInfo(props.userId).userPhoto;
      }

      return <FeedPost
        key={props._id}
        totalLikes={totalLikes}
        timeAgo={timeAgo}
        userName={userName}
        userPhoto={userPhoto}
        onLikePost={onLikePost}
        currentUser={currentUser}
        onDeletePost={onDeletePost}
        {...props}
      />
    });
  };

  useEffect(() => {
    if (userId) {
      getTimelinePosts(userId)
      .then(setFeeds)
      .catch(e => showStatusModal("Couldn't fetch timeline posts. Please try later", 'error'));
    }
    // eslint-disable-next-line
  }, [userId]);
  
  const filteredFeeds = getFilteredFeeds(userId);
  const feedsContent = renderItemsContent(filteredFeeds, itemLoadingStatus, renderUsersFeeds);
  const feedFormContent = currentUser?._id === userId ? <FeedForm currentUser={currentUser} /> : null;


  return (
    <div className="feed">
      {feedFormContent}
      <div className="feed__posts">
        {feedsContent}
      </div>
    </div>
  )
};

export default FeedList;
