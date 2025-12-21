import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    };

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <h1 className="text-3xl font-display font-bold mb-6 text-white text-center">Payment Method</h1>
            <form onSubmit={submitHandler} className="space-y-6">
                <div>
                    <legend className="block mb-4 font-semibold text-gray-300">Select Method</legend>

                    <div className="flex items-center p-4 border border-gray-600 rounded-lg bg-gray-800 hover:border-accent transition-colors cursor-pointer" onClick={() => setPaymentMethod('PayPal')}>
                        <input
                            type="radio"
                            id="PayPal"
                            name="paymentMethod"
                            value="PayPal"
                            checked={paymentMethod === 'PayPal'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4 text-accent bg-gray-700 border-gray-500 focus:ring-accent"
                        />
                        <label htmlFor="PayPal" className="ml-3 text-sm font-medium text-white cursor-pointer w-full">
                            PayPal or Credit Card
                        </label>
                    </div>
                    {/* Add more payment methods here similarly */}
                </div>

                <button
                    type='submit'
                    className="btn-primary w-full"
                >
                    Continue
                </button>
            </form>
        </FormContainer>
    );
};

export default PaymentScreen;
