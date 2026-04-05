import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useCreateOrderMutation, useGetRazorpayKeyQuery, usePayOrderMutation, useVerifyPaymentMutation } from '../slices/ordersApiSlice';
import { applyDiscount, clearCartItems } from '../slices/cartSlice';
import { useValidateCouponMutation } from '../slices/couponsApiSlice';
import '../styles/PlaceOrderScreen.css';

const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);

    const [createOrder, { isLoading, error }] = useCreateOrderMutation();
    const { data: razorpayKey } = useGetRazorpayKeyQuery();
    const [payOrder] = usePayOrderMutation();
    const [verifyPayment, { isLoading: loadingVerify }] = useVerifyPaymentMutation();
    const [validateCoupon, { isLoading: loadingCoupon }] = useValidateCouponMutation();

    const [couponCode, setCouponCode] = useState('');

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping');
        } else if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart.shippingAddress.address, cart.paymentMethod, navigate]);

    const handleRazorpayPayment = async (order, res) => {
        const options = {
            key: razorpayKey?.keyId || 'rzp_test_placeholder', // Fallback for dev
            amount: order.totalPrice * 100,
            currency: 'INR',
            name: 'Shoefie',
            description: 'Order Payment',
            image: '/images/logo.png',
            order_id: res.razorpayOrderId, // If backend creates one
            handler: async function (response) {
                try {
                    await verifyPayment({
                        orderId: order._id,
                        details: {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        },
                    });
                    dispatch(clearCartItems());
                    navigate(`/order/${order._id}`);
                    toast.success('Payment Successful');
                } catch (err) {
                    toast.error(err?.data?.message || err.message);
                }
            },
            prefill: {
                name: cart.shippingAddress.name || 'User',
                email: 'user@example.com',
                contact: '9999999999',
            },
            theme: {
                color: '#ea580c',
            },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    const placeOrderHandler = async () => {
        try {
            // 1. Create Order
            const res = await createOrder({
                orderItems: cart.cartItems.map((item) => ({
                    ...item,
                    product: item._id,
                })),
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            }).unwrap();

            // 2. Handle Payment Flow
            if (cart.paymentMethod === 'Razorpay' || cart.paymentMethod === 'CARD') {
                handleRazorpayPayment(res, res);
            } else {
                // COD or others
                dispatch(clearCartItems());
                navigate(`/order/${res._id}`);
            }

        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const applyCouponHandler = async () => {
        try {
            const res = await validateCoupon({ code: couponCode }).unwrap();
            dispatch(applyDiscount({ discount: res.discount, code: res.code }));
            toast.success(`${res.discount}% Discount Applied`);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="container-custom placeorder-container">
            <CheckoutSteps step1 step2 step3 step4 />

            <h1 className="placeorder-title">Review Order</h1>

            <div className="placeorder-layout">
                <div className="placeorder-details-col">
                    {/* Shipping Info */}
                    <div className="placeorder-card">
                        <h2 className="placeorder-card-title">Shipping Information</h2>
                        <p className="placeorder-card-text">
                            <strong className="placeorder-card-label">Address: </strong>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                            {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                        </p>
                    </div>

                    {/* Payment Info */}
                    <div className="placeorder-card">
                        <h2 className="placeorder-card-title">Payment Method</h2>
                        <p className="placeorder-card-text">
                            <strong className="placeorder-card-label">Method: </strong>
                            {cart.paymentMethod} {cart.paymentProvider && cart.paymentProvider !== cart.paymentMethod ? `(${cart.paymentProvider})` : ''}
                        </p>
                    </div>

                    {/* Order Items */}
                    <div className="placeorder-card">
                        <h2 className="placeorder-card-title">Order Items</h2>
                        {cart.cartItems.length === 0 ? (
                            <Message>Your cart is empty</Message>
                        ) : (
                            <div className="placeorder-items-list">
                                {cart.cartItems.map((item, index) => (
                                    <div key={index} className="placeorder-item-row">
                                        <div className="placeorder-item-img-wrap">
                                            <img src={item.image} alt={item.name} className="placeorder-item-img" />
                                        </div>
                                        <Link to={`/product/${item._id}`} className="placeorder-item-name">
                                            {item.name}
                                        </Link>
                                        <div className="placeorder-item-price-calc">
                                            {item.qty} x <span className="placeorder-item-price-unit">₹{item.price.toLocaleString()}</span> = <span className="placeorder-item-price-total">₹{(item.qty * item.price).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="placeorder-summary-col">
                    <div className="placeorder-summary-card">
                        <h2 className="placeorder-summary-title">Order Summary</h2>

                        {/* Coupon Input */}
                        <div className="placeorder-coupon-wrap">
                            <input
                                type="text"
                                placeholder="Coupon Code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="input-field placeorder-coupon-input"
                            />
                            <button
                                onClick={applyCouponHandler}
                                disabled={loadingCoupon || cart.discount > 0}
                                className="btn-primary placeorder-coupon-btn"
                            >
                                Apply
                            </button>
                        </div>

                        <div className="placeorder-summary-details">
                            <div className="placeorder-summary-row">
                                <span>Items</span>
                                <span>₹{Number(cart.itemsPrice).toLocaleString()}</span>
                            </div>
                            <div className="placeorder-summary-row">
                                <span>Shipping</span>
                                <span>₹{Number(cart.shippingPrice).toLocaleString()}</span>
                            </div>
                            <div className="placeorder-summary-row">
                                <span>Tax</span>
                                <span>₹{Number(cart.taxPrice).toLocaleString()}</span>
                            </div>
                            {cart.discount > 0 && (
                                <div className="placeorder-summary-discount">
                                    <span>Discount ({cart.discount}%)</span>
                                    <span>-₹{(Number(cart.itemsPrice) * cart.discount / 100).toLocaleString()}</span>
                                </div>
                            )}
                            <div className="placeorder-summary-total">
                                <span>Total</span>
                                <span>₹{Number(cart.totalPrice).toLocaleString()}</span>
                            </div>
                        </div>

                        {error && <div style={{ marginTop: '1rem' }}><Message variant='danger'>{error?.data?.message || error.error}</Message></div>}

                        <button
                            type='button'
                            className="btn-primary placeorder-submit-btn"
                            disabled={cart.cartItems.length === 0 || isLoading}
                            onClick={placeOrderHandler}
                        >
                            {cart.paymentMethod === 'CARD' || cart.paymentMethod === 'UPI' ? 'Pay & Place Order' : 'Place Order'}
                        </button>
                        {isLoading && <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}><Loader /></div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderScreen;
