import {useEffect, useState} from 'react';
import useFeatures from '../../hooks/useFeatures.js';
import useService from '../../hooks/useService';
import {FcAddImage, FcPicture} from "react-icons/fc";
import {IoMdDoneAll} from "react-icons/io";
import {AiOutlineLoading} from "react-icons/ai";
import './profileSettings.scss';


const ProfileSettings = ({onClose, currentUser}) => {
  const [userImage, setUserImage] = useState(null);
  const [userImageLoading, setUserImageLoading] = useState(false);
  const [backgroundImageLoading, setBackgroundImageLoading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [userImages, setUserImages] = useState({});
  const {updateUser} = useService();
  const {showStatusModal, sendFileToFB} = useFeatures();

  const {city, coverPicture, from, profilePicture, name, lastName, descr} = currentUser;

  const onResetSettings = () => {
    onClose();
    setUserImage(null);    
    setBackgroundImage(null);    
    setUserImages({});
  };

  function validateValue(arr) {
    let errorsArr = [];
    arr.forEach(item => {
      if (!/^[A-Za-z]+$/.test(item)) {
        errorsArr.push(item);
      }
    })
    return errorsArr;
  };
  
  function setSvgContent(isLoading, image, Component) {
    if (isLoading) return <AiOutlineLoading className="svg_rotate"/>;
    if (image && !isLoading) return <IoMdDoneAll style={{fill: 'green'}}/>;
    if (!image && !isLoading) return <Component/>;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const customErrors = validateValue([e.target.name.value, e.target.lastName.value]);
    
    if (customErrors.length !== 0) {
      return showStatusModal(`${customErrors[0]} is not valid!`, 'error');
    }
    
    const newUser = {
      lastName: e.target.lastName.value || lastName,
      name: e.target.name.value || name,
      city: e.target.city.value || city,
      from: e.target.from.value || from,
      descr: e.target.title.value || descr,
      relationship: e.target.relationship.value,
      profilePicture: userImages?.profilePicture || profilePicture,
      coverPicture: userImages?.coverPicture || coverPicture
    };

    try {
      await updateUser(currentUser._id, JSON.stringify(newUser));
      window.location.reload();
    } catch (error) {
      showStatusModal("Couldn't update user. Please try later", 'error');
    }
  };

  useEffect(() => {
    if (!backgroundImage) return;
    setBackgroundImageLoading(true);
    sendFileToFB(userImages, setUserImages, backgroundImage, 'coverPicture', setBackgroundImageLoading, false, false);
  }, [backgroundImage]);
  
  useEffect(() => {
    if (!userImage) return;
    setUserImageLoading(true);
    sendFileToFB(userImages, setUserImages, userImage, 'profilePicture', setUserImageLoading, false, false);
  }, [userImage]);


  return (
    <form className="settings" onSubmit={(e) => handleSubmit(e, userImage, backgroundImage)}>
      <div className="settings__bg">
        <img src={userImages.coverPicture || coverPicture} alt="profileBg"/>
      </div>
      <img className="settings__img" src={userImages.profilePicture || profilePicture} alt="userImage"/>
      <div className="settings__images">
        <div className="settings__images-wrapper">
          <label htmlFor="profilePicture">
            {setSvgContent(userImageLoading, userImage, FcAddImage)}
            <span>Change profile picture</span>
          </label>
          <input 
            id="profilePicture" 
            name="profilePicture" 
            type="file"
            onChange={(event) => setUserImage(event.currentTarget.files[0])}/>
        </div>
        <div className="settings__images-wrapper">
        <label htmlFor="background">
          {setSvgContent(backgroundImageLoading, backgroundImage, FcPicture)}
          <span>Change background image</span>
        </label>
        <input 
          id="background" 
          name="background" 
          type="file"
          onChange={(event) => setBackgroundImage(event.currentTarget.files[0])}/>
        </div>
      </div>
      <div className="settings__container">
        <div className="settings__title">
          <label htmlFor="title"><b>Title: </b></label>
          <input autoComplete='off' type="text" id="title" defaultValue={descr}/>
        </div>      
        <div className="settings__lastName">
          <label htmlFor="lastName"><b>Last Name: </b></label>
          <input autoComplete='off' type="text" id="lastName" defaultValue={lastName}/>
        </div>      
        <div className="settings__name">
          <label htmlFor="name"><b>Name: </b></label>
          <input autoComplete='off' type="text" id="name" defaultValue={name}/>
        </div>      
        <div className="settings__city">
          <label htmlFor="city"><b>City: </b></label>
          <input autoComplete='off' type="text" id="city" defaultValue={city}/>
        </div>      
        <div className="settings__from">
          <label htmlFor="from"><b>From: </b></label>
          <input autoComplete='off' type="text" id="from" defaultValue={from}/>
        </div>      
        <div className="settings__relationship">
          <label htmlFor="relationship"><b>Relationship: </b></label>
          <select id="relationship" defaultValue={currentUser?.relationship ? currentUser.relationship : '0'}>
            <option value={1} label="Married"></option>
            <option value={2} label="Actively looking"></option>
            <option value={3} label="Difficult situation"></option>
            <option value={0} label="No information yet"></option>
          </select>
        </div>
      </div>
      <div className="settings__btns">
        <div className="settings__btns-close" onClick={onResetSettings}>Close</div>
        <button type="submit" className="settings__btns-save" disabled={userImageLoading || backgroundImageLoading}>Save Changes</button>
      </div>
    </form>
  )
};

export default ProfileSettings;