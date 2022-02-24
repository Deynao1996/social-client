import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import {toast} from 'react-toastify';
import app from '../firebase.js';
import moment from 'moment';
import {TailSpin} from  'react-loader-spinner';


const useFeatures = () => {
  function sendFileToFB(obj, setObj, file, keyName, setLoading, isReload = true, isStringify = true) {
    const fileName = new Date().getTime() + file.name;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
          default:
        }
      }, 
      (error) => {
        showStatusModal('Something went wrong', 'error');
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            const newObj = {...obj, [keyName]: downloadURL}
            return newObj;
        }).then(obj => setObj(isStringify ? JSON.stringify(obj) : obj))
          .then(() => {
            setLoading(false);
            isReload && window.location.reload();
          })
          .catch(e => showStatusModal("Couldn't upload media to server. Please try later", 'error'));
      }
    )
  };

  function showStatusModal(message, status) {
    toast(message, {type: status});
  };

  async function startFollowUser(userId, currentUser, followUser, setCurrentUser, setIsLoading) {
    try {
      await followUser(userId, JSON.stringify({userId: currentUser._id}));
      setIsLoading(false);
      
      setCurrentUser(currentUser => {
        return {...currentUser, following: [...currentUser.following, userId]}
      }) 
    } catch (error) {
      showStatusModal('Something went wrong', 'error');  
    }
  };
  
  function setRelationStatus(num) {
    switch (num) {
      case 1:
        return <span>Married</span>;
      case 2:
        return <span>Actively looking</span>;
      case 3:
        return <span>Difficult situation</span>;
      case 0:
        return <span>Not information yet</span>;
      default:
        return <span>Not information yet</span>;
    }
  };

  async function onAddUserConversation(currentUser, userId, setConversations, createConversation) {
    const body = {
      senderId: currentUser._id,
      receiverId: userId
    };
  
    try {
      const newConversation = await createConversation(JSON.stringify(body));
      setConversations(conversations => [...conversations, newConversation]);
    } catch (error) {
      showStatusModal("Couldn't add user to conversations. Please try later", 'error');      
    }
  };

  function renderItemsContent(arr, status, func, ...args) {
    if (status === "loading") {
      return <div className="spinner">
              <TailSpin color="black"/>
            </div>;
    } else if (status === "error") {
      return <h5 className="statusMessage">Loading error. Please try later</h5>;
    } else {
      return func(arr, ...args);
    }
  };

  function setTimeAgo(createdAt) {
    const postDate = new Date(createdAt).toLocaleString('en-GB');
    return createdAt? moment(postDate, 'DD/MM/YYYY, kk:mm:ss').fromNow() : 'just now';
  };


  return {
    sendFileToFB,
    showStatusModal,
    startFollowUser,
    setRelationStatus,
    onAddUserConversation,
    renderItemsContent,
    setTimeAgo
  }
};

export default useFeatures;