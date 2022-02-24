import {useSearchParams } from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import {useProvider} from '../../contexts/UserContext.js';
import FeedList from '../feedList/FeedList.js';
import UsersList from '../usersList/UsersList.js';
import OnlineUserBar from '../onlineUserBar/OnlineUserBar.js';

const HomeContent = () => {
  const {currentUser} = useProvider();
  
  
  return (
    <div className="wrapper__bottom">
      <ToastContainer/>
      <View currentUser={currentUser}/>
      <OnlineUserBar/>
    </div>
  )
};

const View = ({currentUser}) => {
  const [searchParams] = useSearchParams();

  if (searchParams.get('tag')) {
    return <FeedList userId={currentUser?._id}/>
  } else if (searchParams.get('user') || searchParams.get('user') === '') {
    return <UsersList/>
  } else {
    return <FeedList userId={currentUser?._id}/>
  }
};

export default HomeContent;