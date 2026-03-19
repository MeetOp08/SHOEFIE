import React from 'react';
import '../styles/Message.css';

const Message = ({ variant = 'info', children }) => {
    return (
        <div className={`message-alert message-${variant}`} role="alert">
            {children}
        </div>
    );
};

export default Message;
