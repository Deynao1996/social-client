import {useRef, useState} from "react";
import {useProvider} from '../../contexts/UserContext.js';
import useService from '../../hooks/useService.js';
import {AiOutlineDelete} from "react-icons/ai";
import Overlay from '../overlay/Overlay.js';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import useFeatures from '../../hooks/useFeatures.js';
import './conversation.scss';


const Conversation = ({profilePicture, name, lastName, conversationId}) => {
  const [isShowWarning, setIsShowWarning] = useState(false);
  const isFirstRenderRef = useRef(true);
  const {setUserConversations} = useProvider();
  const {deleteConversation} = useService();
  const {showStatusModal} = useFeatures();
  
  const createWarningMessage = (name) => {
    const capitalName = name.charAt(0).toUpperCase() + name.slice(1);
    toast.warn(`If you delete this conversation, it will be deleted permanently for you and also for ${capitalName}!`, {
      onClose: () => setIsShowWarning(false)
    });
  };
  
  const showWarningMessage = (e, conversationId) => {
    e.preventDefault();
    if (!isFirstRenderRef.current) {
      onDeleteConversation(conversationId);
    } else {
      setIsShowWarning(true);
      createWarningMessage(name);
      isFirstRenderRef.current = false;
    }
  };

  const onDeleteConversation = async (conversationId) => {
    try {
      await deleteConversation(conversationId);
      setUserConversations(userConversations => {
        return userConversations.filter(conversation => conversation._id !== conversationId);
      });
    } catch (e) {
      showStatusModal("Couldn't delete conversations. Please try later", 'error')
    }
  };

  
  return (
    <>
      {isShowWarning ? <Overlay/> : null}
      <Link 
        className="conversation"
        to={conversationId}>
        <img
          className="conversation__img"
          src={profilePicture}
          alt="userConversation"
        />
        <span className="conversation__name">{lastName} {name}</span>
        <div 
          className="conversation__remove" 
          title="Remove conversation"
          onClick={(e) => showWarningMessage(e, conversationId)}>
            <AiOutlineDelete/>
        </div>
      </Link>
    </>
  )
};

export default Conversation;