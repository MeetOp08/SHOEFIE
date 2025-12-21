import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
    return (
        <div className='flex justify-center mb-8'>
            <div className='flex space-x-4 text-sm md:text-base'>
                {step1 ? (
                    <Link to='/login' className='text-black font-semibold hover:underline'>Sign In</Link>
                ) : (
                    <span className='text-gray-400'>Sign In</span>
                )}

                {step2 ? (
                    <Link to='/shipping' className='text-black font-semibold hover:underline'>Shipping</Link>
                ) : (
                    <span className='text-gray-400'>Shipping</span>
                )}

                {step3 ? (
                    <Link to='/payment' className='text-black font-semibold hover:underline'>Payment</Link>
                ) : (
                    <span className='text-gray-400'>Payment</span>
                )}

                {step4 ? (
                    <Link to='/placeorder' className='text-black font-semibold hover:underline'>Place Order</Link>
                ) : (
                    <span className='text-gray-400'>Place Order</span>
                )}
            </div>
        </div>
    );
};

export default CheckoutSteps;
