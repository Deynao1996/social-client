import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import useService from '../../hooks/useService';
import useFeatures from '../../hooks/useFeatures.js';

const CAROUSEL_STYLES = {
  overflowX: 'scroll',
  overflowY: 'hidden'
};


const UserLikesPanel = ({likesId}) => {
  const [likedUsers, setLikedUsers] = useState([]);
  const {getUser} = useService();
  const {showStatusModal} = useFeatures();

  function renderLickedUsers() {
    if (likedUsers.length === 0) return likesId.map((item, i) => {
      return (
        <div key={i} className="feed__bottom-item">
         <img src='https://kremen.gov.ua/assets/images/no-user-icon.jpg' alt="user"/>
        </div>
      ) 
    });
    
    return likedUsers.map(({_id, profilePicture}) => {
      return (
        <Link 
          to={{pathname: `/profile/${_id}`}} 
          className="feed__bottom-item"
          key={_id}>
            <img src={profilePicture} alt="user"/>
        </Link>
      )
    });
  };
  
  const lickedUsersContent = renderLickedUsers();
  
  useEffect(() => {
    if (likesId.length === 0) return;
    
    let requests = likesId.map(id => getUser(id));
    Promise.all(requests)
      .then(setLikedUsers)
      .catch((e) => showStatusModal("Couldn't fetch liked list. Please try later", 'error'))
  }, [likesId.length]);
  
  
  return (
    <div className="feed__bottom-carousel" style={likesId.length > 6 ? CAROUSEL_STYLES : null}>
      {lickedUsersContent}
    </div>
  )
};

export default UserLikesPanel;