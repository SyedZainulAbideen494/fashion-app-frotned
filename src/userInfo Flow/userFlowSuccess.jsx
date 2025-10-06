import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import successTick from './Success.json';
import './successUserFlow.css';

const SuccessUserFlow = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/upload-new-cloth');
  };

  return (
    <div className="success-wrapper">
      <div className="success-animation">
        <Player
          autoplay
          loop={false}
          src={successTick}
          style={{ height: '180px', width: '180px' }}
        />
      </div>
      <h1 className="success-title">You're All Set!</h1>
      <p className="success-text">We’ve saved your details. Ready to upload your wardrobe?</p>
      <button className="success-btn" onClick={handleNext}>Next →</button>
    </div>
  );
};

export default SuccessUserFlow;
