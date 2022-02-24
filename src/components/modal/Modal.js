import Typical from 'react-typical';
import {AiOutlineSearch, AiOutlineClose} from 'react-icons/ai';
import {IoLockClosedOutline} from 'react-icons/io5';
import './modal.scss';

const SVG_STYLES = {
  cursor: 'pointer',
  marginRight: '5px'
};


const Modal = ({onClose}) => {

  function onBlockModal() {
    localStorage.setItem('showModal', 'block');
    onClose();
  };


  return (
    <div className="modal">
        <button className="modal__btn"><AiOutlineSearch /></button>
        <div className="modal__input">
          <Typical
            steps={['To find posts by tag start typing with #', 3000, 'To find users start your typing with name/last name', 3000, 'To find all users just focus the field and press Enter', 3000]}
            loop={1}
            wrapper="span"
            />  
          <div className="modal__btns">
            <IoLockClosedOutline 
              title="Never show me again this message" 
              style={SVG_STYLES}
              onClick={onBlockModal}
              />
            <AiOutlineClose 
              title="Close"
              style={SVG_STYLES} 
              onClick={onClose}
              />
          </div>
        </div>
    </div>
  )
};

export default Modal;
