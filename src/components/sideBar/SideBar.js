import {Link} from 'react-router-dom';
import FriendsList from '../friendsList/FriendsList.js';
import {MdRssFeed, MdGroup, MdWorkOutline, MdEventNote} from 'react-icons/md';
import {BsFillChatLeftTextFill, BsPlayCircleFill, BsQuestionCircle, BsInfoSquareFill, BsFillFileMusicFill} from 'react-icons/bs';
import './sideBar.scss';


const SideBar = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar__list">
        <li>
          <MdRssFeed />
          <Link to="/" className="sidebar__list-link">Feeds</Link>
        </li>
        <li>
          <BsFillChatLeftTextFill />
          <a href="#" className="sidebar__list-link">Chats</a>
        </li>
        <li>
          <BsPlayCircleFill />
          <Link
            className="sidebar__list-link" 
            to={{
              pathname: "/",
              search: "?tag=movie"
            }}>Videos</Link>
        </li>
        <li>
          <BsFillFileMusicFill />
          <Link
            className="sidebar__list-link" 
            to={{
              pathname: "/",
              search: "?tag=music"
            }}>Audio</Link>
        </li>
        <li>
          <MdGroup />
          <a href="#" className="sidebar__list-link">Groups</a>
        </li>
        <li>
          <BsQuestionCircle />
          <a href="#" className="sidebar__list-link">Questions</a>
        </li>
        <li>
          <MdWorkOutline />
          <a href="#" className="sidebar__list-link">Jobs</a>
        </li>
        <li>
          <MdEventNote />
          <a href="#" className="sidebar__list-link">Events</a>
        </li>
        <li>
          <BsInfoSquareFill />
          <a href="#" className="sidebar__list-link">Courses</a>
        </li>
      </ul>
      <button className="sidebar__btn">Show more</button>
      <hr/>
      <FriendsList/>
    </div>
  )
};

export default SideBar;
