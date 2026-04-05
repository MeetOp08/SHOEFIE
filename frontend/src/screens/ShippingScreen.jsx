import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../slices/cartSlice';
import '../styles/ShippingScreen.css';

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
        <div className="shipping-container">
            <CheckoutSteps step1 step2 />

            <div className="shipping-card">
                <h1 className="shipping-title">Shipping Details</h1>

                <form onSubmit={submitHandler} className="shipping-form">
                    <div>
                        <label className="shipping-label">Full Name</label>
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
                        <label className="shipping-label">Phone Number</label>
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
                        <label className="shipping-label">Address</label>
                        <input
                            type='text'
                            placeholder='123 Main St, Apt 4B'
                            value={address}
                            required
                            onChange={(e) => setAddress(e.target.value)}
                            className="input-field"
                        ></input>
                    </div>

                    <div className="shipping-grid">
                        <div>
                            <label className="shipping-label">City</label>
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
                            <label className="shipping-label">Postal Code</label>
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
                        <label className="shipping-label">Country</label>
                        <input
                            type='text'
                            placeholder='United States'
                            value={country}
                            required
                            onChange={(e) => setCountry(e.target.value)}
                            className="input-field"
                        ></input>
                    </div>

                    <div className="shipping-submit-wrapper">
                        <button
                            type='submit'
                            className="btn-primary shipping-submit-btn"
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
