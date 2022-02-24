import React, {useContext, useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import useService from '../hooks/useService';
import useFeatures from '../hooks/useFeatures.js';

const UserContext = React.createContext();

export const useProvider = () => {
  return useContext(UserContext);
}

export const UserProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [followings, setFollowings] = useState([]);
  const [userConversations, setUserConversations] = useState([]);
  const navigate = useNavigate();
  const {loginWithJWT} = useService();
  const {showStatusModal} = useFeatures();

  const login = (user, to) => {
    setCurrentUser(user);
    to && navigate(to);
    return user;
  };

  const logOut = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/auth/login', {replace: true});
  };

  useEffect(() => {
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      loginWithJWT(currentToken)
        .then(user => login(user))
        .catch((e) => {
          showStatusModal('Something went wrong', 'error');
          logOut();
        });
    } else {
      navigate('/auth/login', {replace: true});
    }
    // eslint-disable-next-line
  }, []);


  const value = {
    setCurrentUser,
    currentUser,
    followings,
    setFollowings,
    login,
    logOut,
    userConversations,
    setUserConversations
  };


  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
};
