import React from 'react';

const Message = ({ variant = 'info', children }) => {
    let colorClass = 'bg-blue-100 text-blue-700';
    if (variant === 'danger') {
        colorClass = 'bg-red-100 text-red-700';
    } else if (variant === 'success') {
        colorClass = 'bg-green-100 text-green-700';
    } else if (variant === 'warning') {
        colorClass = 'bg-yellow-100 text-yellow-700';
    }

    return (
        <div className={`p-4 mb-4 text-sm rounded-lg ${colorClass}`} role="alert">
            {children}
        </div>
    );
};

export default Message;
