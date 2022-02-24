import {useState, useEffect, useLayoutEffect, useRef} from 'react/cjs/react.development';
import {AiOutlineSearch, AiOutlineClose, AiFillSetting} from 'react-icons/ai';
import {BsFillPersonFill, BsFillChatLeftTextFill} from 'react-icons/bs';
import {NavLink, Link, useSearchParams, useNavigate} from 'react-router-dom';
import {useProvider} from '../../contexts/UserContext.js';
import useService from '../../hooks/useService.js';
import useFeatures from '../../hooks/useFeatures.js';
import Overlay from '../overlay/Overlay.js';
import Modal from '../modal/Modal.js';
import ProfileSettings from '../profileSettings/ProfileSettings.js';
import './header.scss';

const Header = () => {
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [possibleFriendsId, setPossibleFriendsId] = useState([]);
  const [possibleFriends, setPossibleFriends] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);
  const [isSettingsActive, setIsSettingsActive] = useState(false);
  const [ignoringUsers, setIgnoringUsers] = useState([]);
  const [searchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState('');
  const firstFocusRef = useRef(true);
  const navigate = useNavigate();
  const {showStatusModal, startFollowUser} = useFeatures();

  const {logOut, currentUser, setCurrentUser} = useProvider();
  const {getUser, followUser, updateUser} = useService();

  const fillPossibleFriendsId = (user) => {
    if (!user || user.followers.length === 0) return;
    if (user.following.length === 0) return setPossibleFriendsId([...user.followers]);

    user.followers.forEach(followerId => {
      if (!user.following.includes(followerId)) {
        setPossibleFriendsId(possibleFriendsId => {
          return [...new Set([...possibleFriendsId, followerId])];
        });
      } else {
        setPossibleFriendsId(possibleFriendsId => {
          return possibleFriendsId.filter(id => id !== followerId);
        });
      }
    });
  };

  const onActiveModal = () => {
    const modalStatus = localStorage.getItem('showModal');

    if (!firstFocusRef.current || modalStatus) return; 
    setIsModalActive(true);
    firstFocusRef.current = false;
  };

  const onIgnoringUser = async (userId, currentUser) => {
    let newArr = [...new Set([...ignoringUsers, userId])];
    setIgnoringUsers(newArr);
    try {
      await updateUser(currentUser._id, JSON.stringify({ignoring: newArr}));
    } catch (error) {
      showStatusModal('Something went wrong', 'error');
    }
  };

  const onFormReset = () => {
    setInputValue('');
    navigate('/');
  };

  function setSearchUrlParams(pathName) {
    if (pathName.includes('?tag')) {
      return navigate({
        pathname: '/',
        search: pathName,
      });
    }
    navigate({
      pathname: '/',
      search: pathName,
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const query = e.target.search.value.toLowerCase();
    const searchPathName = query.includes('#') ? `?tag=${query.replace(/#/g, "")}` : `?user=${query}`; 
    setSearchUrlParams(searchPathName);
  };

  function renderPossibleFriendsList(friends) {
    if (friends.length === 0) return <li className="header__followers-link info">There are no new followers</li>

    return friends.map(({_id, username, profilePicture}) => {
      const slicedUserName = username.length > 10 ? username.slice(0, 10) + '...' : username;
      
      return (
        <li 
          className="header__followers-link"
          key={_id}>
          <Link to={{pathname: `/profile/${_id}`}}>
            <img src={profilePicture} alt="char"/> {slicedUserName} is following you but you don't follow back
          </Link>
          <button 
            className="header__followers-follow"
            onClick={() => startFollowUser(_id, currentUser, followUser, setCurrentUser, setIsLoading)}
            disabled={loading}>
              Follow
          </button>
          <button 
            className="header__followers-ignore"
            onClick={() => onIgnoringUser(_id, currentUser)}>
              Ignore
          </button>
        </li>
      )
    });
  };

  useLayoutEffect(() => {
    fillPossibleFriendsId(currentUser);
    // eslint-disable-next-line
  }, [currentUser?.followers.length, currentUser?.following.length, currentUser?.ignoring.length]);
  
  useLayoutEffect(() => {
    if (currentUser) {
      setIgnoringUsers(currentUser.ignoring);
    }
    // eslint-disable-next-line
  }, [currentUser?.ignoring.length]);

  useEffect(() => {
    const tagParam = searchParams.get('tag') ? '#' + searchParams.get('tag') : '';
    const params = tagParam || searchParams.get('user') || '';
    setInputValue(params);
    // eslint-disable-next-line
  }, [searchParams.get('tag'), searchParams.get('user')])
  
  useEffect(() => {
    if (possibleFriendsId.length === 0) {
      return setPossibleFriends([]);
    }
    let requests = possibleFriendsId
      .filter(value => {
        return ignoringUsers.indexOf(value) === - 1;
    }).map(id => getUser(id));
    Promise.all(requests)
      .then(setPossibleFriends)
      .catch((e) => showStatusModal('Something went wrong', 'error'))
    // eslint-disable-next-line
  }, [possibleFriendsId.length, ignoringUsers.length]);
  
  const profilePic = currentUser ? currentUser.profilePicture : 'https://kremen.gov.ua/assets/images/no-user-icon.jpg';
  const possibleFriendsList = renderPossibleFriendsList(possibleFriends);


  return (
    <header className="header">
      {isModalActive ? 
        <Overlay>
          <Modal onClose={() => setIsModalActive(false)}/>
        </Overlay> : 
        null}
      {isSettingsActive ? 
        <Overlay>
          <ProfileSettings 
            onClose={() => setIsSettingsActive(false)}
            currentUser={currentUser}/>
        </Overlay> : 
        null}
      <NavLink className="header__link" to="/">Social</NavLink>
      <form 
        className="header__search" 
        onSubmit={handleSubmit} 
        autoComplete="off">
          <button type="submit" className="header__search-submit"><AiOutlineSearch /></button>
          <input 
            className="header__search-input" 
            type="search" 
            name="search" 
            id="search" 
            placeholder="Search for friends and posts"
            value={inputValue}
            onFocus={() => onActiveModal()}
            onChange={(e) => setInputValue(e.target.value.toLowerCase())}
            />
            {inputValue ? 
              <AiOutlineClose 
                onClick={() => onFormReset()}
                style={{cursor: 'pointer'}}/> : 
                null}
      </form>
      <div className="header__bar">
        <div className="header__bar-nav">
          <NavLink to="/">Timeline</NavLink>
          <NavLink to={`/profile/${currentUser?._id}`}>Profile</NavLink>
          <span onClick={logOut}>Logout</span>
        </div>
        <div className="header__bar-icons">
          <div 
            className="header__followers" 
            onClick={() => setIsDropdownActive(isDropdownActive => !isDropdownActive)}>
            <div 
              className="header__followers-link">
              <BsFillPersonFill style={{fontSize: '1.6rem'}}/>
                {possibleFriends.length === 0 ? null : <span>{possibleFriends.length}</span>}
            </div>
            <ul className="header__followers-dropdown" style={{display: isDropdownActive ? 'block' : 'none'}}>
              {possibleFriendsList}
            </ul>
          </div>
          <div className="header__chat">
            <Link 
              to="/chat" 
              className="header__chat-link">
                <BsFillChatLeftTextFill />
                <span>2</span>
            </Link>
          </div>
          <div className="header__bell">
            <div 
              className="header__bell-link"
              onClick={() => setIsSettingsActive(true)}>
                <AiFillSetting/>
            </div>
          </div>
        </div>
        <NavLink to={`/profile/${currentUser?._id}`} className="header__bar-char">
          <img src={profilePic} alt="char"/>
        </NavLink>
      </div>
    </header>
  )
};

export default Header;
