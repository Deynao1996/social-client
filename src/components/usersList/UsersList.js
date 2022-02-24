import {useEffect, useState} from 'react';
import {Link, useSearchParams} from 'react-router-dom';
import useService from '../../hooks/useService.js';
import useFeatures from '../../hooks/useFeatures.js';
import './usersList.scss';


const UsersList = () => {
  const [searchParams] = useSearchParams();
  const [allUsers, setAllUsers] = useState([]);
  const {getAllUsers, itemLoadingStatus} = useService();
  const {showStatusModal, setRelationStatus, renderItemsContent} = useFeatures();

  function getFilteredUsers() {
    const queryUser = searchParams.get('user') || '';

    if (allUsers.length === 0) return allUsers;
    if (queryUser) {
      return allUsers.filter(user => user.name.includes(queryUser) || user.lastName.includes(queryUser));
    } else {
      return allUsers;
    }
  };

  function renderUsers(arr) {
    if (arr.length === 0) {
      return <h4 className='statusMessage'>No any users here</h4>
    } 

    return arr.map(({city, name, lastName, profilePicture, _id, from, followers, following, relationship}) => {
      return (
        <Link 
          to={`profile/${_id}`} 
          className="users__link"
          key={_id}>
            <img src={profilePicture} alt="user"/>
            <div className="users__info">
              <div className="users__info-content">
                <span className="users__info-name"><b>{name} {lastName}</b></span>
                <div className="users__info-city"><b>City:</b> {city}</div>
                <div className="users__info-from"><b>From:</b> {from}</div>
                <div className="users__info-relationship"><b>Relationship:</b> {setRelationStatus(relationship)}</div>
              </div>
              <div className="users__info-friends">
                <div className="users__info-followers"><b>Followers:</b> {followers?.length}</div>
                <div className="users__info-followings"><b>Following:</b> {following?.length}</div>
              </div>
            </div>        
        </Link>
      )
    });
  };

  useEffect(() => {
    getAllUsers()
      .then(setAllUsers)
      .catch((e) => showStatusModal("Couldn't fetch users list. Please try later", 'error'))
    // eslint-disable-next-line
  }, []);

  const filteredUsers = getFilteredUsers();
  const usersListContent = renderItemsContent(filteredUsers, itemLoadingStatus, renderUsers);

  
  return (
    <div className="users">
      <div className="users__list">
        {usersListContent}
      </div>
    </div>
  )
};

export default UsersList;
