import { Link } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
    const steps = [
        { name: 'Sign In', link: '/login', active: step1 },
        { name: 'Shipping', link: '/shipping', active: step2 },
        { name: 'Payment', link: '/payment', active: step3 },
        { name: 'Place Order', link: '/placeorder', active: step4 },
    ];

    return (
        <div className='flex justify-center mb-8'>
            <div className='flex items-center space-x-2 md:space-x-4'>
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center">
                        {/* Step Circle */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${step.active ? 'bg-accent border-accent text-primary' : 'bg-transparent border-gray-600 text-gray-500'
                            }`}>
                            {step.active && index < 3 && step4 ? <FaCheck /> : index + 1}
                        </div>

                        {/* Step Label (Hidden on small screens if not active) */}
                        <span className={`ml-2 font-semibold text-sm ${step.active ? 'text-white' : 'text-gray-500 hidden md:inline'}`}>
                            {step.active && step.link ? (
                                <Link to={step.link}>{step.name}</Link> // Make link clickable if active/passed
                            ) : (
                                step.name
                            )}
                        </span>

                        {/* Separator Line */}
                        {index < steps.length - 1 && (
                            <div className={`w-8 md:w-16 h-1 mx-2 rounded ${step.active && steps[index + 1].active ? 'bg-accent' : 'bg-gray-700'}`}></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CheckoutSteps;
