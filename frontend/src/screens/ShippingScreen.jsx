import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../slices/cartSlice';

const ShippingScreen = () => {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const [address, setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');
    const [fullName, setFullName] = useState(shippingAddress?.fullName || '');
    const [phone, setPhone] = useState(shippingAddress?.phone || '');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country, fullName, phone }));
        navigate('/payment');
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <CheckoutSteps step1 step2 />

            <div className="card p-8 md:p-10 mt-8 bg-white shadow-lg border border-border-color">
                <h1 className="text-3xl font-display font-bold mb-6 text-text-main border-b border-border-color pb-4">Shipping Details</h1>

                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label className="block mb-2 font-semibold text-text-main">Full Name</label>
                        <input
                            type='text'
                            placeholder='Enter full name'
                            value={fullName}
                            required
                            onChange={(e) => setFullName(e.target.value)}
                            className="input-field"
                        ></input>
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold text-text-main">Phone Number</label>
                        <input
                            type='text'
                            placeholder='Enter phone number'
                            value={phone}
                            required
                            onChange={(e) => setPhone(e.target.value)}
                            className="input-field"
                        ></input>
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold text-text-main">Address</label>
                        <input
                            type='text'
                            placeholder='123 Main St, Apt 4B'
                            value={address}
                            required
                            onChange={(e) => setAddress(e.target.value)}
                            className="input-field"
                        ></input>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 font-semibold text-text-main">City</label>
                            <input
                                type='text'
                                placeholder='New York'
                                value={city}
                                required
                                onChange={(e) => setCity(e.target.value)}
                                className="input-field"
                            ></input>
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold text-text-main">Postal Code</label>
                            <input
                                type='text'
                                placeholder='10001'
                                value={postalCode}
                                required
                                onChange={(e) => setPostalCode(e.target.value)}
                                className="input-field"
                            ></input>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold text-text-main">Country</label>
                        <input
                            type='text'
                            placeholder='United States'
                            value={country}
                            required
                            onChange={(e) => setCountry(e.target.value)}
                            className="input-field"
                        ></input>
                    </div>

                    <div className="pt-4">
                        <button
                            type='submit'
                            className="btn-primary w-full py-3 text-lg"
                        >
                            Continue to Payment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShippingScreen;
