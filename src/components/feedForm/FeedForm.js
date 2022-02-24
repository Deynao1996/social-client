import {useState, useRef, lazy, Suspense} from 'react';
import useService from '../../hooks/useService.js';
import useFeatures from '../../hooks/useFeatures.js';
import {TailSpin} from 'react-loader-spinner';
import {IoMdDoneAll} from "react-icons/io";
import {GoFileSubmodule} from 'react-icons/go';
import {AiFillTag, AiFillCloseCircle} from 'react-icons/ai';
import {BsFillEmojiSmileFill} from 'react-icons/bs';
import './feedForm.scss';

const PickerComponent = lazy(() => import('emoji-picker-react'));

const pickerConfig = {
  pickerStyle: {position: 'absolute', top: '30px', left: '0px', zIndex: '1000'},
  groupVisibility: {
    travel_places: false,
    activities: false,
    objects: false,
    symbols: false,
    flags: false
  },
  disableSkinTonePicker: true
};


const FeedForm = ({currentUser}) => {
  const [inputFile, setInputFile] = useState(null);
  const [inputTextContent, setInputTextContent] = useState('');
  const [inputTagContent, setInputTagContent] = useState('');
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [isPickerActive, setIsPickerActive] = useState(false);
  const [caretPosition, setCaretPosition] = useState(0);
  const inputRef = useRef();
  const {createPost} = useService();
  const {sendFileToFB} = useFeatures();

  const name = currentUser ? currentUser.name.charAt(0).toUpperCase() + currentUser.name.slice(1) : '';
  const profilePic = currentUser ? currentUser.profilePicture : 'https://kremen.gov.ua/assets/images/no-user-icon.jpg';

  const onTagValidate = () => {
    if (inputTagContent === '' || (inputTagContent.includes('#') && inputTagContent.length === 1)) {
      setInputTagContent('');
    } else if (inputTagContent.match(/#/)) {
      setInputTagContent(inputTagContent);
    } else {
      setInputTagContent(inputTagContent => '#' + inputTagContent);
    }
  };

  const onEmojiClick = (event, emojiObject) => {
    const emojiLength = emojiObject.emoji.length;
    setInputTextContent(inputTextContent => {
      const beforeIndex = inputTextContent.slice(0, caretPosition);
      const afterIndex = inputTextContent.slice(caretPosition);
      return beforeIndex + emojiObject.emoji + afterIndex;
    })
    setCaretPosition(caretPosition => caretPosition + emojiLength)
  };

  const onTogglePicker = () => {
    !isPickerActive && inputRef.current.focus();
    setIsPickerActive(isPickerActive => !isPickerActive);
  };

  function setWithMediaTags(tags, file) {
    const fileType = file.type.split('/')[0];
  
    switch (fileType) {
      case 'audio':
        return tags + '#music';  
      case 'video':
        return tags + '#movie';  
      case 'image':
        return tags;  
      default:
        return tags;  
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoadingStatus(true);

    const descr = e.target.descr.value;
    const tags = e.target.tag.value.replace(/\s/g, '');
    const post = {
      userId: currentUser._id,
      descr,
      tags: tags.toLowerCase()      
    };
    
    if (!inputFile) {
      await createPost(JSON.stringify(post));
      setLoadingStatus(false);
      return window.location.reload();
    } else {
      post.tags = setWithMediaTags(post.tags, inputFile).toLowerCase();
      sendFileToFB(post, createPost, inputFile, 'media', setLoadingStatus);
    }
  };


  return (
    <form 
      className="feed__share"
      onSubmit={handleSubmit}>
      <div className="feed__share-input">
        <img src={profilePic} alt="person"/>
        <input 
          type="text" 
          name='descr' 
          id='descr' 
          autoComplete="off" 
          ref={inputRef}
          required placeholder={`What's in your mind ${name}?`}
          onChange={(e) => setInputTextContent(e.target.value)}
          onBlur={(e) => setCaretPosition(e.target.selectionStart)}
          value={inputTextContent}
          />
      </div>
      <hr/>
      <div className='feed__share-tag'>
        <input 
          id="tag"
          name="tag" 
          type="text" 
          autoComplete='off'
          onChange={(e) => setInputTagContent(e.target.value.trimStart())}
          value={inputTagContent}
          onBlur={() => onTagValidate()}
          />
      </div>
      <div className="feed__share-bottom">
        <div className="feed__share-options">
          <div className="feed__share-option">
            <label htmlFor="file">
              {inputFile ? <IoMdDoneAll style={{fill: 'green'}}/> : <GoFileSubmodule style={{fill: 'orange'}}/>}
              <span>Photo, Video or Audio</span>
            </label>
            <input 
              id="file" 
              name="file" 
              type="file" 
              onChange={(event) => {
                setInputFile(event.currentTarget.files[0]);
              }}
              />
          </div>
          <div className="feed__share-option">
            <label htmlFor="tag">
              <AiFillTag style={{fill: 'blue'}}/>
              <span>Tag</span>
            </label>
          </div>
          <div className="feed__share-option">
            <div className="feed__share-emotions" onClick={() => onTogglePicker()}>
              {!isPickerActive ? <BsFillEmojiSmileFill style={{fill: 'DarkGoldenRod'}}/> : <AiFillCloseCircle style={{fill: 'DarkGoldenRod'}}/>}
              <span>Feelings</span>
            </div>
            <Suspense fallback={<div style={{position: 'absolute'}}><TailSpin/></div>}>
              {isPickerActive ? <PickerComponent onEmojiClick={onEmojiClick} {...pickerConfig}/> : null}
            </Suspense>
          </div>
        </div>
        <button 
          className="feed__share-submit" type="submit" 
          name="button"
          disabled={loadingStatus}>
          {loadingStatus ? 'LOADING...' : 'SHARE'}
        </button>
      </div>
    </form>
  )
};

export default FeedForm;
