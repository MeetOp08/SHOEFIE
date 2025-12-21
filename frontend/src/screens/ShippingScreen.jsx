import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../slices/cartSlice';

const ShippingScreen = () => {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const [address, setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        navigate('/payment');
    };

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 />
            <h1 className="text-3xl font-display font-bold mb-6 text-white text-center">Shipping Details</h1>
            <form onSubmit={submitHandler} className="space-y-4">
                <div>
                    <label className="block mb-1 font-semibold text-gray-300">Address</label>
                    <input
                        type='text'
                        placeholder='Enter full address'
                        value={address}
                        required
                        onChange={(e) => setAddress(e.target.value)}
                        className="input-field"
                    ></input>
                </div>

                <div>
                    <label className="block mb-1 font-semibold text-gray-300">City</label>
                    <input
                        type='text'
                        placeholder='Enter city'
                        value={city}
                        required
                        onChange={(e) => setCity(e.target.value)}
                        className="input-field"
                    ></input>
                </div>

                <div>
                    <label className="block mb-1 font-semibold text-gray-300">Postal Code</label>
                    <input
                        type='text'
                        placeholder='Enter postal code'
                        value={postalCode}
                        required
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="input-field"
                    ></input>
                </div>

                <div>
                    <label className="block mb-1 font-semibold text-gray-300">Country</label>
                    <input
                        type='text'
                        placeholder='Enter country'
                        value={country}
                        required
                        onChange={(e) => setCountry(e.target.value)}
                        className="input-field"
                    ></input>
                </div>

                <button
                    type='submit'
                    className="btn-primary w-full mt-4"
                >
                    Continue
                </button>
            </form>
        </FormContainer>
    );
};

export default ShippingScreen;
