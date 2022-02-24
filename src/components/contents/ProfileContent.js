import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import useService from "../../hooks/useService.js";
import useFeatures from '../../hooks/useFeatures.js';
import Profile from "../profile/Profile.js";
import UserBar from "../userBar/UserBar.js";
import FeedList from "../feedList/FeedList.js";

const ProfileContent = () => {
  const [profileUser, setProfileUser] = useState(null);
  const {userId} = useParams();
  const {getUser} = useService();
  const {showStatusModal} = useFeatures();

  useEffect(() => {
    getUser(userId)
      .then(setProfileUser)
      .catch(e => showStatusModal("Couldn't fetch user information. Please try later", 'error'));
      // eslint-disable-next-line
  }, [userId]);


  return (
    <>
      <Profile profileUser={profileUser}/>
      <ToastContainer/>
      <div className="wrapper__bottom">
        <FeedList 
          userId={userId}
          profileUser={profileUser}
          />
        <UserBar 
          userId={userId}
          profileUser={profileUser}
          />
      </div>
    </>
  )
};

export default ProfileContent;
