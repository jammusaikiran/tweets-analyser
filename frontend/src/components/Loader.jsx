import React from 'react';
import './Loader.css';

const Loader = ({ size = 12, ariaLabel = 'Loading' }) => {
  // size controls dot diameter (px)
  const style = {
    '--dot-size': `${size}px`,
  };

  return (
    <div className="loader" style={style} role="status" aria-live="polite" aria-label={ariaLabel}>
      <span className="dot dot1" />
      <span className="dot dot2" />
      <span className="dot dot3" />
    </div>
  );
};

export default Loader;
