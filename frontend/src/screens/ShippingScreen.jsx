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
            <h1 className="text-3xl font-bold mb-6">Shipping</h1>
            <form onSubmit={submitHandler} className="space-y-4">
                <div>
                    <label className="block mb-1 font-semibold">Address</label>
                    <input
                        type='text'
                        placeholder='Enter address'
                        value={address}
                        required
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full border p-2 rounded"
                    ></input>
                </div>

                <div>
                    <label className="block mb-1 font-semibold">City</label>
                    <input
                        type='text'
                        placeholder='Enter city'
                        value={city}
                        required
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full border p-2 rounded"
                    ></input>
                </div>

                <div>
                    <label className="block mb-1 font-semibold">Postal Code</label>
                    <input
                        type='text'
                        placeholder='Enter postal code'
                        value={postalCode}
                        required
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full border p-2 rounded"
                    ></input>
                </div>

                <div>
                    <label className="block mb-1 font-semibold">Country</label>
                    <input
                        type='text'
                        placeholder='Enter country'
                        value={country}
                        required
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full border p-2 rounded"
                    ></input>
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

export default ShippingScreen;
