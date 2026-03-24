import React, { useEffect, useState } from 'react';
import { UserCheck, X } from 'lucide-react';
import './WelcomeModal.css';

const WelcomeModal = ({ user, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to trigger the slide-in animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation before actually removing from DOM
  };

  if (!user) return null;

  return (
    <div className="welcome-overlay" onClick={handleClose}>
      <div 
        className={`welcome-dialog ${isVisible ? 'visible' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="welcome-close-btn" onClick={handleClose}>
          <X size={20} />
        </button>
        
        <div className="welcome-icon-container">
          <UserCheck size={32} className="welcome-icon" />
        </div>
        
        <div className="welcome-content">
          <h2>Welcome back{user.username ? `, ${user.username}` : ''}!</h2>
          <p>You have successfully logged into your DSSearch account.</p>
        </div>
        
        <div className="welcome-actions">
          <button className="welcome-btn" onClick={handleClose}>
            Continue Searching
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
