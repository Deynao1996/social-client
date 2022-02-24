import OnlineFriendsList from '../onlineFriendsList/OnlineFriendsList.js';
import './onlineUserBar.scss';


const OnlineUserBar = () => {
  return (
    <div className="rightBar">
      <div className="rightBar__info">
        <img src="assets/gift.png" alt="gift"/>
        <span><b>Pola Foster</b> and <b>3 other friends</b> have a birthday today.</span>
      </div>
      <img src="assets/ad.png" alt="birthday" className="rightBar__image"/>
      <div className="rightBar__title">Online Friends</div>
      <OnlineFriendsList/>
    </div>
  )
};

export default OnlineUserBar;