import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useCreateOrderMutation, useCreateCheckoutSessionMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FaLock, FaShippingFast, FaCheckCircle, FaMoneyBillWave } from 'react-icons/fa';
import '../styles/Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);

    const [createOrder, { isLoading: loadingCreate }] = useCreateOrderMutation();
    const [createCheckoutSession, { isLoading: loadingStripe }] = useCreateCheckoutSessionMutation();

    // Ensure shipping address exists
    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping');
        }
    }, [cart.shippingAddress, navigate]);

    const handlePlaceOrder = async (isStripe = false) => {
        try {
            // 1. Create Order
            const res = await createOrder({
                orderItems: cart.cartItems.map((item) => ({
                    ...item,
                    product: item._id, // Mapping _id to product field
                })),
                shippingAddress: cart.shippingAddress,
                paymentMethod: isStripe ? 'Stripe' : 'COD',
                paymentProvider: isStripe ? 'Stripe' : 'COD',
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            }).unwrap();

            // 2. Payment Flow
            if (isStripe) {
                // Create Stripe Session
                const session = await createCheckoutSession(res._id).unwrap();
                // Redirect to Stripe
                window.location.href = session.url;
            } else {
                // COD -> Redirect to Order Details (or Success)
                dispatch(clearCartItems());
                navigate(`/order-success/${res._id}`);
            }

        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="container-custom checkout-container">
            <h1 className="checkout-title">Checkout</h1>

            <div className="checkout-layout">
                {/* Left Column: Details */}
                <div className="checkout-details-col">

                    {/* Shipping Address Review */}
                    <div className="checkout-card">
                        <div className="checkout-card-header">
                            <h2 className="checkout-card-title">
                                <FaShippingFast className="checkout-card-icon" /> Shipping To
                            </h2>
                            <Link to="/shipping" className="checkout-edit-link">Edit</Link>
                        </div>
                        <div className="checkout-address-details">
                            <p className="checkout-address-name">{cart.shippingAddress.fullName}</p>
                            <p>{cart.shippingAddress.address}</p>
                            <p>{cart.shippingAddress.city}, {cart.shippingAddress.postalCode}</p>
                            <p>{cart.shippingAddress.country}</p>
                            <p className="checkout-summary-text"><span className="checkout-summary-label">Phone:</span> {cart.shippingAddress.phone}</p>
                        </div>
                    </div>

                    {/* Order Items Review */}
                    <div className="checkout-card">
                        <div className="checkout-card-header">
                            <h2 className="checkout-card-title">
                                <FaCheckCircle className="checkout-card-icon" /> Your Items
                            </h2>
                        </div>
                        {cart.cartItems.length === 0 ? (
                            <Message>Your cart is empty</Message>
                        ) : (
                            <div className="checkout-items-list">
                                {cart.cartItems.map((item, index) => (
                                    <div key={index} className="checkout-item-row">
                                        <div className="checkout-item-img-wrap">
                                            <img src={item.image} alt={item.name} className="checkout-item-img" />
                                        </div>
                                        <div className="checkout-item-info">
                                            <Link to={`/product/${item._id}`} className="checkout-item-name">
                                                {item.name}
                                            </Link>
                                            <p className="checkout-item-qty">Qty: {item.qty}</p>
                                        </div>
                                        <div className="checkout-item-price">
                                            ₹{(item.price * item.qty).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Summary & Payment */}
                <div className="checkout-summary-col">
                    <div className="checkout-summary-card">
                        <h2 className="checkout-summary-title">Order Summary</h2>

                        <div className="checkout-summary-details">
                            <div className="checkout-summary-row">
                                <span>Subtotal ({cart.cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                                <span>₹{cart.itemsPrice}</span>
                            </div>
                            <div className="checkout-summary-row">
                                <span>Shipping</span>
                                <span>₹{cart.shippingPrice}</span>
                            </div>
                            <div className="checkout-summary-row">
                                <span>Tax</span>
                                <span>₹{cart.taxPrice}</span>
                            </div>
                            <div className="checkout-summary-total">
                                <span className="checkout-summary-total-label">Total</span>
                                <span className="checkout-summary-total-value">₹{cart.totalPrice}</span>
                            </div>
                        </div>

                        <div className="checkout-actions">
                            <button
                                onClick={() => handlePlaceOrder(true)}
                                disabled={cart.cartItems.length === 0 || loadingCreate || loadingStripe}
                                className="btn-primary checkout-stripe-btn"
                            >
                                {loadingStripe ? <Loader className="w-6 h-6" /> : (
                                    <>
                                        <span style={{ marginRight: '0.5rem' }}>Pay with Stripe</span>
                                        <FaLock className="checkout-lock-icon" />
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => handlePlaceOrder(false)}
                                disabled={cart.cartItems.length === 0 || loadingCreate || loadingStripe}
                                className="checkout-cod-btn"
                            >
                                <FaMoneyBillWave className="checkout-cod-icon" /> Pay on Delivery
                            </button>
                        </div>

                        <div className="checkout-secure-note">
                            <FaLock style={{ marginRight: '0.25rem' }} /> Secure Encrypted Payment
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
