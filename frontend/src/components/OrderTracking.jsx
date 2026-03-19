import React from 'react';
import '../styles/OrderTracking.css';

const OrderTracking = ({ status, trackingId, paymentMethod, estimatedDelivery }) => {
    const steps = [
        'Order Placed',
        'Order Confirmed',
        'Packed',
        'Shipped',
        'Out for Delivery',
        'Delivered'
    ];

    const currentStep = steps.indexOf(status) !== -1 ? steps.indexOf(status) : 0;

    return (
        <div className="order-tracking-card">
            <h2 className="order-tracking-title">Delivery Status</h2>

            {/* Progress Bar Container */}
            <div className="order-tracking-progress-container">
                {/* Background Line */}
                <div className="order-tracking-line-bg"></div>

                {/* Active Progress Line */}
                <div
                    className="order-tracking-line-active"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                ></div>

                {/* Steps */}
                <div className="order-tracking-steps">
                    {steps.map((step, index) => {
                        const isCompleted = index <= currentStep;
                        const isCurrent = index === currentStep;

                        return (
                            <div key={index} className="order-tracking-step-item">
                                {/* Dot/Icon */}
                                <div
                                    className={`order-tracking-dot ${isCompleted ? 'completed' : ''}`}
                                >
                                    {isCompleted ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="order-tracking-check-icon" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <span>{index + 1}</span>
                                    )}
                                </div>

                                {/* Label */}
                                <div className="order-tracking-label-wrapper">
                                    <span className={`order-tracking-label ${isCurrent ? 'current' : isCompleted ? 'completed' : ''}`}>
                                        {step}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Current Status Details Box */}
            <div className="order-tracking-details-box">
                <div className="order-tracking-grid">
                    <div className="order-tracking-col">
                        <p className="order-tracking-col-label">Current Status</p>
                        <p className="order-tracking-col-value">{status}</p>
                    </div>

                    {trackingId && (
                        <div className="order-tracking-col-border">
                            <p className="order-tracking-col-label">Tracking ID</p>
                            <p className="order-tracking-col-value-accent">{trackingId}</p>
                        </div>
                    )}

                    {estimatedDelivery && (
                        <div className="order-tracking-col-border">
                            <p className="order-tracking-col-label">Estimated Delivery</p>
                            <p className="order-tracking-col-value">{new Date(estimatedDelivery).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
