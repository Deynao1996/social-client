import {useEffect, useState, useRef} from 'react';
import {useParams, useOutletContext, useNavigate} from 'react-router-dom';
import {useProvider} from '../../contexts/UserContext.js';
import useService from '../../hooks/useService.js';
import Message from '../../components/message/Message.js';
import useFeatures from '../../hooks/useFeatures.js';
import {ToastContainer} from 'react-toastify';
import './chatBox.scss';


const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const {conversationId} = useParams();
  const {getMessages, sendMessage, itemLoadingStatus} = useService();
  const {currentUser} = useProvider();
  const {receiveMessageUsers} = useOutletContext();
  const scrollRef = useRef();
  const navigate = useNavigate();
  const {showStatusModal, renderItemsContent} = useFeatures();

  const fillMessages = (arr) => {
    const newArr = arr.map(({sender, text, conversationId, createdAt, _id}) => {
      const isOwn = sender !== currentUser._id;
      const profilePicture = !isOwn ? currentUser.profilePicture : receiveMessageUsers.find(receiver => receiver.conversationId === conversationId).profilePicture;
      return {
        sender,
        text,
        profilePicture,
        createdAt,
        _id,
        own: isOwn
      }
    });
    setMessages(newArr);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!conversationId) return;
    const body = {
      conversationId,
      sender: currentUser._id,
      text: e.target.message.value
    }

    try {
      const newMessage = await sendMessage(JSON.stringify(body));
      console.log(newMessage);
      setMessages([...messages, {...newMessage, profilePicture: currentUser.profilePicture}]);
      e.target.reset();
    } catch (error) {
      showStatusModal("Could't send a message. Please try later!", 'error');
    }
  };

  function renderMessagesList(arr) {
    if (arr.length === 0 ) return <h4 className="statusMessage">You don't have any messages yet</h4>;
            
    return arr.map(({_id, ...props}) => {
      return (
        <Message
          key={_id}
          {...props}/>
      )
    });
  };

  useEffect(() => {
    if (!currentUser) return navigate('/chat');
    if (conversationId) {
      getMessages(conversationId)
        .then(fillMessages)
        .catch((e) => showStatusModal("Could't fetch messages. Please try later", 'error'));
    }
    // eslint-disable-next-line
  }, [conversationId, currentUser?._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messages]);

  const messagesListContent = renderItemsContent(messages, itemLoadingStatus, renderMessagesList);


  return (
    <div className="chat__box">
      <ToastContainer 
        autoClose={false}
        position="top-center"
        closeOnClick
        draggable
        style={{width: "400px"}}
      />
      <div className="chat__box-wrapper">   
      {conversationId ? 
        <div className="chat__box-top">
          {messagesListContent}
          <hr ref={scrollRef}/>
          <form 
            className="chat__box-bottom"
            onSubmit={handleSubmit}>
              <div className="chat__box-query">
                <textarea name="message" rows="2" className="chat__box-input" id="msg" required autoComplete="off"></textarea>
                <label htmlFor="msg"><span>What's your message?</span></label>
              </div>
              <button type="submit" className="chat__box-submit">
                Send
              </button>
          </form>
        </div> : 
        <span className="noConversationText">
          Open a conversation to start a chat.
        </span>
      }         
      </div>
    </div>
  )
};

export default ChatBox;