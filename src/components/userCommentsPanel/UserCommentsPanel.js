import {Link} from 'react-router-dom';
import useService from '../../hooks/useService';
import {BsTrash} from "react-icons/bs";
import useFeatures from '../../hooks/useFeatures.js';


const UserCommentsPanel = ({currentUser, postId, usersComments, setUsersComments, userId}) => {
  const {updateComment} = useService();
  const {showStatusModal, setTimeAgo} = useFeatures();

  const handleSubmit = async (e, {_id, name, lastName, profilePicture}) => {
    e.preventDefault();
    
    const comment = {
      userId: _id,
      name,
      lastName,
      profilePicture,
      message: e.target.message.value,
      commentId: new Date().getTime()
    };
    setUsersComments(usersComments => [...usersComments, comment]);
    await updateComment(postId, JSON.stringify(comment));
    e.target.reset();
  };

  const onRemoveComment = async (commentId) => {
    try {
      await updateComment(postId, JSON.stringify({commentId: commentId}));
      setUsersComments(usersComments => usersComments.filter(comment => comment.commentId !== commentId));
    } catch (error) {
      showStatusModal("Couldn't remove comment. Please try later", 'error');
    }
  };

  function renderUsersComments(arr) {
    if (arr.length === 0) return;
    
    return arr.map((item, i) => {
      const timeAgo = setTimeAgo(item.createdAt);

      return (
        <div 
          className="feed__comment"
          key={item._id || i}>
          <img className="feed__comment-img" src={item.profilePicture} alt="user"/>    
          <div className="feed__comment-content">
            <Link 
              to={{
                pathname: `/profile/${item.userId}`
              }} 
              className="feed__comment-name">{item.lastName} {item.name} </Link>
            <span className="feed__comment-date">{timeAgo}</span>
            {(userId === currentUser._id) || (item.userId === currentUser._id) ?
              <div 
                className="feed__comment-trash"
                onClick={() => onRemoveComment(item.commentId)}>
                  <BsTrash/>
              </div> :
              null}
            <div className="feed__comment-message">{item.message}</div>
          </div>
        </div>
      ) 
    }); 
  };

  const usersCommentsContent = renderUsersComments(usersComments);

  
  return (
    <div className="feed__comments">
      {usersCommentsContent}
      <form 
        className="feed__comment feed__comment-form"
        onSubmit={(e) => handleSubmit(e, currentUser)}>
          <img className="feed__comment-img" src={currentUser.profilePicture} alt="user"/>    
          <div className="feed__comment-content">
            <span className="feed__comment-name">{currentUser.lastName + " " + currentUser.name}</span>
            <div className="feed__comment-wrapper">
              <textarea type="text" autoComplete="off" id="message" name="message" className="feed__comment-textarea" placeholder="My message..." required autoFocus={true}/>
              <button type="submit" className="feed__comment-submit">Send</button>
            </div>
          </div>
      </form>
    </div>
  )
};

export default UserCommentsPanel;