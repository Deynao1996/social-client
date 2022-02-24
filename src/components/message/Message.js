import useFeatures from '../../hooks/useFeatures.js';
import './message.scss';

const Message = ({own, profilePicture, text, createdAt}) => {
  const {setTimeAgo} = useFeatures();

  const messageClassName = own ? "message message__own" : "message";
  const timeAgo = setTimeAgo(createdAt);


  return (
    <div className={messageClassName}>
      <div className="message__top">
        <img
          className="message__img"
          src={profilePicture}
          alt="userImage"/>
        <p className="message__text">{text}</p>
      </div>
      <div className="message__bottom">{timeAgo}</div>
    </div>
  )
};

export default Message;