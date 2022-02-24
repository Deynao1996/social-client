import {useEffect, useState} from 'react';
import Conversation from '../conversation/Conversation.js';
import {useProvider} from '../../contexts/UserContext.js';
import useService from '../../hooks/useService.js';
import useFeatures from '../../hooks/useFeatures.js';


const ConversationList = ({receiveMessageUsers, setReceiveMessageUsers}) => {
  const [isLoadingStatus, setIsLoadingStatus] = useState('idle');
  const [receiversId, setReceiversId] = useState([]);
  const [querySearchParam, setQuerySearchParam] = useState('');
  const {currentUser, userConversations, setUserConversations} = useProvider();
  const {getConversations, getUser} = useService();
  const {showStatusModal, renderItemsContent} = useFeatures();

  const fillFriendsId = (arr) => {
    if (!currentUser) return;

    const newArr = arr.map(item => {
      let usersId = {
        conversationId: item._id,
        receiverId: item.members.find(i => i !== currentUser._id)
      };
      return usersId;
    });
    setReceiversId(newArr);
  };

  const fillReceivers = (users) => {
    const newArr = users.map(({_id, name, lastName, profilePicture}) => {
      const conversationId = receiversId.find(u => u.receiverId === _id).conversationId;
      const newUser = {
        conversationId,
        name,
        lastName,
        profilePicture,
      }
      return newUser;
    });
    setReceiveMessageUsers(newArr);
  };

  function getFilteredConversations(arr) {
    const keys = ['name', 'lastName'];
    return arr.filter(item => keys.some(k => item[k].includes(querySearchParam.toLowerCase())));
  };

  function renderConversationList(arr) {
    if (arr.length === 0) return <h4 className="statusMessage">You don't have any conversation yet</h4>
    const filteredConversations = getFilteredConversations(arr);
    if (filteredConversations.length === 0) return <h4 className="statusMessage">{`No matching friends by '${querySearchParam}'`}</h4>
  
    return filteredConversations.map(({conversationId, ...props}) => {
      return <Conversation
        key={conversationId}
        conversationId={conversationId}
        {...props}
      />
    });
  };

  useEffect(() => {
    if (currentUser) {
      getConversations(currentUser._id)
      .then(res => {
        setUserConversations(res);
        fillFriendsId(res);
      })
      .catch((e) => showStatusModal("Couldn't fetch user conversations. Please try later", 'error'));
    }
    // eslint-disable-next-line
  }, [currentUser?._id, userConversations.length]);
  
  useEffect(() => {
    setIsLoadingStatus('loading');
    let requests = receiversId.map(user => getUser(user.receiverId));
    Promise.all(requests)
      .then(fillReceivers)
      .then(res => setIsLoadingStatus('idle'))
      .catch((e) => showStatusModal("Couldn't fetch user conversations. Please try later", 'error'));
    // eslint-disable-next-line
  }, [receiversId.length]);

  const conversationListContent = renderItemsContent(receiveMessageUsers, isLoadingStatus, renderConversationList);


  return (
    <div className="chat__menu-wrapper">
      <input 
        placeholder="Search for friends" 
        className="chat__menu-input"
        onChange={(e) => setQuerySearchParam(e.target.value)}
        value={querySearchParam}
      />
      {conversationListContent}
    </div>
  )
};

export default ConversationList;