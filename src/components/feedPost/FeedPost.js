import {useState} from 'react';
import {Link} from 'react-router-dom';
import UserCommentsPanel from '../userCommentsPanel/UserCommentsPanel.js';
import UserLikesPanel from '../userLikesPanel/UserLikesPanel.js';
import {BsHeartFill} from 'react-icons/bs';
import {RiDeleteBack2Line} from 'react-icons/ri';
import './feedPost.scss';


const FeedPost = ({_id, userPhoto, userId, userName, timeAgo, descr, media, totalLikes, onLikePost, currentUser, likes, tags, comments, onDeletePost}) => {
  const [isLikePanelActive, setIsLikePanelActive] = useState(false);
  const [isCommentPanelActive, setIsCommentPanelActive] = useState(false);
  const [usersComments, setUsersComments] = useState(comments);

  const mediaExtension = media?.match(/(\w+)(\?alt)/u)[1];
  const mediaContent = setMediaContent(media, mediaExtension);

  let tagsArr = tags === '' ? [] : tags.split('#').filter(n => n);
  let likeClassName = 'feed__bottom-heart';

  if (currentUser && likes.includes(currentUser._id)) {
    likeClassName += ' feed__bottom-heart_licked';
  }

  function setMediaContent(path, ext) {
    if (!path) return;
  
    switch (ext) {
      case 'mp3':
        return <audio src={path} controls preload="metadata"/>  
      case 'mp4':
        return <video src={path} controls preload="metadata" loop/>
      default:
        return <img src={path} alt="post"/>
    }
  };

  function renderTags(tags) {
    if (tags.length === 0) {
      return;
    }

    return tags.map((tag, i)=> {
      return <Link 
        to={{
          pathname: `/`,
          search: `?tag=${tag}`
        }}
        key={i}>#{tag}</Link>
    })
  };

  const tagsListContent = renderTags(tagsArr); 
    

  return (
    <>
      <div
        className="feed__post">
        <div className="feed__post-top">
          <Link 
            to={{pathname: `/profile/${userId}`}} 
            className="feed__top-left">
              <img src={userPhoto} alt="person"/>
              <span className="feed__top-username">{userName}</span>
              <span className="feed__top-date">{timeAgo}</span>
          </Link>
          {currentUser._id === userId ? 
          <div 
            className="feed__top-right"
            title='Delete post'
            onClick={() => onDeletePost(_id)}>
              <RiDeleteBack2Line/>
          </div> : null}
        </div>
        <div className="feed__post-center">
          <span>{descr}</span>
          {tagsListContent ? <div>{tagsListContent}</div> : null}
          {mediaContent}
        </div>
        <div className="feed__post-bottom">
          <div className="feed__bottom-left">
            <div 
              className={likeClassName}
              onClick={() => onLikePost(_id)}>
                <BsHeartFill/>
            </div>
            <span 
              onClick={() => likes.length !== 0 && setIsLikePanelActive(isLikePanelActive => !isLikePanelActive)}>
                {totalLikes} people like it
            </span>
            {isLikePanelActive ? <UserLikesPanel likesId={likes}/> : null}
          </div>
          <div className="feed__bottom-right">
            <div 
              className="feed__bottom-comments"
              onClick={() => setIsCommentPanelActive(isCommentPanelActive => !isCommentPanelActive)}>
                {usersComments.length === 1 ? usersComments.length + ' comment' : usersComments.length + ' comments'}
            </div>
          </div>
        </div>
      </div>
      {isCommentPanelActive ? 
        <UserCommentsPanel 
          currentUser={currentUser} 
          postId={_id} 
          usersComments={usersComments} 
          setUsersComments={setUsersComments}
          userId={userId}/>
          : null}  
    </>
  )
};

export default FeedPost;