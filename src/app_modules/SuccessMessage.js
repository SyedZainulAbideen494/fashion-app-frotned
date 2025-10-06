import React, { useEffect, useState } from 'react';
import './SuccessMessage.css'; // Import the CSS file for styling

const SuccessMessage = ({ message, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            const hideTimer = setTimeout(() => {
                onClose();
            }, 300); // Delay to match the animation duration

            return () => clearTimeout(hideTimer);
        }, 1500);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`success-message-sucess-modal ${isVisible ? 'show__message__success__modal' : 'hide__message__success__modal'}`}>
            {message}
        </div>
    );
    
};

export default SuccessMessage;
