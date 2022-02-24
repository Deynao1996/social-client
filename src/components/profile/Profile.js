import {Parallax} from 'react-parallax';
import './profile.scss';

const Profile = ({profileUser}) => {
  return (
    <div className="wrapper__top">
      <div className="profile">
        <div className="profile__wrapper">
          <Parallax
            bgImage={profileUser?.coverPicture || 'https://coolbackgrounds.io/images/backgrounds/white/pure-white-background-85a2a7fd.jpg'}
            strength={300}
            style={{width: '100%', height: '250px'}}
            bgImageStyle={{'objectFit': 'cover', width: '100%', height: '250px'}}>
          </Parallax>
          <img src={profileUser?.profilePicture || 'https://kremen.gov.ua/assets/images/no-user-icon.jpg'} alt="user" className="profile__user"/>
        </div>
        <div className="profile__data">
          <h4 className="profile__data-title">{profileUser?.name} {profileUser?.lastName}</h4>
          <span>{profileUser?.descr}</span>
        </div>
      </div>
    </div>
  )
};

export default Profile;