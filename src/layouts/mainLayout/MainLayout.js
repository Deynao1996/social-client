import {Outlet} from 'react-router-dom';
import Header from '../../components/header/Header.js';
import SideBar from '../../components/sideBar/SideBar.js';


const MainLayout = () => {
  return (
    <>
      <Header/>
      <div className="container">
        <SideBar/>
        <div className="wrapper">
          <Outlet/>
        </div>
      </div>
    </>
  )
};

export default MainLayout;