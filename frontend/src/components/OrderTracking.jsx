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
        <div className="card p-6 mb-6">
            <h2 className="text-xl font-bold font-display text-accent mb-6">Delivery Status</h2>

            {/* Progress Bar */}
            <div className="relative mb-8">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-700 -translate-y-1/2 z-0"></div>

                {/* Active Progress Line */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-accent -translate-y-1/2 z-0 transition-all duration-500"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                ></div>

                <div className="relative z-10 flex justify-between w-full">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${index <= currentStep
                                        ? 'bg-accent border-accent text-black scale-110'
                                        : 'bg-gray-800 border-gray-600 text-gray-500'
                                    }`}
                            >
                                {index <= currentStep ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <span className="text-xs">{index + 1}</span>
                                )}
                            </div>
                            <span className={`text-xs mt-2 font-semibold hidden md:block ${index <= currentStep ? 'text-accent' : 'text-gray-500'
                                }`}>
                                {step}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Current Status Details */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-4 md:space-y-0">
                    <div className="flex-1">
                        <p className="text-gray-400 text-sm">Status</p>
                        <p className="font-bold text-white text-lg">{status}</p>
                    </div>
                    {trackingId && (
                        <div className="flex-1 border-l border-gray-700 pl-4">
                            <p className="text-gray-400 text-sm">Tracking ID</p>
                            <p className="font-mono text-accent text-lg">{trackingId}</p>
                        </div>
                    )}
                    {estimatedDelivery && (
                        <div className="flex-1 border-l border-gray-700 pl-4">
                            <p className="text-gray-400 text-sm">Est. Delivery</p>
                            <p className="font-bold text-white">{new Date(estimatedDelivery).toLocaleDateString()}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
