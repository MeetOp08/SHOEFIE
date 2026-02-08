import React from 'react';

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
        <div className="card p-8 mb-8 bg-white border border-border-color shadow-sm rounded-xl">
            <h2 className="text-xl font-bold font-display text-text-main mb-8">Delivery Status</h2>

            {/* Progress Bar Container */}
            <div className="relative mb-12 px-4">
                {/* Background Line */}
                <div className="absolute top-1/2 left-0 w-full h-1.5 bg-secondary -translate-y-1/2 rounded-full"></div>

                {/* Active Progress Line */}
                <div
                    className="absolute top-1/2 left-0 h-1.5 bg-accent -translate-y-1/2 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                ></div>

                {/* Steps */}
                <div className="relative z-10 flex justify-between w-full">
                    {steps.map((step, index) => {
                        const isCompleted = index <= currentStep;
                        const isCurrent = index === currentStep;

                        return (
                            <div key={index} className="flex flex-col items-center group relative">
                                {/* Dot/Icon */}
                                <div
                                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 z-10 ${isCompleted
                                        ? 'bg-accent border-accent text-white scale-110 shadow-lg shadow-accent/20'
                                        : 'bg-white border-secondary text-gray-300'
                                        }`}
                                >
                                    {isCompleted ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <span className="text-xs font-semibold">{index + 1}</span>
                                    )}
                                </div>

                                {/* Label */}
                                <div className="absolute top-12 w-32 text-center hidden md:block">
                                    <span className={`text-xs md:text-sm font-semibold transition-colors duration-300 ${isCurrent ? 'text-accent' : isCompleted ? 'text-text-main' : 'text-text-muted/50'
                                        }`}>
                                        {step}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Current Status Details Box */}
            <div className="bg-secondary/30 rounded-xl p-6 border border-border-color mt-8 md:mt-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
                    <div className="space-y-1">
                        <p className="text-text-muted text-xs font-bold uppercase tracking-wider">Current Status</p>
                        <p className="font-bold text-text-main text-lg">{status}</p>
                    </div>

                    {trackingId && (
                        <div className="space-y-1 md:border-l md:border-border-color md:pl-6">
                            <p className="text-text-muted text-xs font-bold uppercase tracking-wider">Tracking ID</p>
                            <p className="font-mono text-accent text-lg tracking-wide">{trackingId}</p>
                        </div>
                    )}

                    {estimatedDelivery && (
                        <div className="space-y-1 md:border-l md:border-border-color md:pl-6">
                            <p className="text-text-muted text-xs font-bold uppercase tracking-wider">Estimated Delivery</p>
                            <p className="font-bold text-text-main text-lg">{new Date(estimatedDelivery).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
