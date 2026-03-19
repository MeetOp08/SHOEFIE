import { Link } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import '../styles/CheckoutSteps.css';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
    const steps = [
        { name: 'Sign In', link: '/login', active: step1 },
        { name: 'Shipping', link: '/shipping', active: step2 },
        { name: 'Payment', link: '/payment', active: step3 },
        { name: 'Place Order', link: '/placeorder', active: step4 },
    ];

    return (
        <div className='checkout-steps-container'>
            <div className='checkout-steps-wrapper'>
                {steps.map((step, index) => (
                    <div key={index} className="checkout-step-item">
                        {/* Step Circle */}
                        <div className={`checkout-step-circle ${step.active ? 'active' : ''}`}>
                            {step.active && index < 3 && step4 ? <FaCheck /> : index + 1}
                        </div>

                        {/* Step Label (Hidden on small screens if not active) */}
                        <span className={`checkout-step-label ${step.active ? 'active' : ''}`}>
                            {step.active && step.link ? (
                                <Link to={step.link}>{step.name}</Link> // Make link clickable if active/passed
                            ) : (
                                step.name
                            )}
                        </span>

                        {/* Separator Line */}
                        {index < steps.length - 1 && (
                            <div className={`checkout-step-separator ${step.active && steps[index + 1]?.active ? 'active' : ''}`}></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CheckoutSteps;
