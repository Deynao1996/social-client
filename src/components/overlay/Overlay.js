import ReactDom from 'react-dom';

const OVERLAY_STYLES = {
  position: 'fixed',
  top: '0',
  bottom: '0',
  right: '0',
  left: '0',
  backgroundColor: 'rgba(0, 0, 0, .7)',
  zIndex: '1000'
};


const Overlay = ({children}) => {
  return ReactDom.createPortal(
    <>    
      <div className="overlay" style={OVERLAY_STYLES}></div>
      {children}
    </>,
    document.getElementById('portal')
  )
};

export default Overlay;
