import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
    const [paymentMethod, setPaymentMethod] = useState('PayPal'); // Or Razorpay

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
            <h1 className="text-3xl font-bold mb-6">Payment Method</h1>
            <form onSubmit={submitHandler} className="space-y-4">
                <div>
                    <label className="block mb-2 font-semibold">Select Method</label>
                    <div className="flex items-center mb-2">
                        <input
                            type="radio"
                            id="PayPal"
                            name="paymentMethod"
                            value="PayPal"
                            checked
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-2"
                        />
                        <label htmlFor="PayPal">PayPal or Credit Card</label>
                    </div>
                </div>

                <button
                    type='submit'
                    className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
                >
                    Continue
                </button>
            </form>
        </FormContainer>
    );
};

export default PaymentScreen;
