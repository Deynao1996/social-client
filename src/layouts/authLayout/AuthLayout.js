import {Outlet} from "react-router-dom";
import './authLayout.scss';


const AuthLayout = () => {
  return (
    <div className="auth">
      <div className="auth__content">
        <h3 className="auth__content-title">Social</h3>
        <span>Connect with friends and the world around you on Social.</span>
      </div>
      <Outlet/>
    </div>
  )
};

export default AuthLayout;