import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useCreateOrderMutation, useGetRazorpayKeyQuery, usePayOrderMutation, useVerifyPaymentMutation } from '../slices/ordersApiSlice';
import { clearCartItems, applyDiscount } from '../slices/cartSlice';
import { useValidateCouponMutation } from '../slices/couponsApiSlice';

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
        <div className="container mx-auto px-4 py-8">
            <CheckoutSteps step1 step2 step3 step4 />

            <h1 className="text-3xl font-display font-bold text-text-main mb-8 mt-8">Review Order</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Shipping Info */}
                    <div className="card p-6">
                        <h2 className="text-xl font-bold font-display text-text-main mb-4 border-b border-border-color pb-2">Shipping Information</h2>
                        <p className="text-text-muted">
                            <strong className="text-text-main">Address: </strong>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                            {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                        </p>
                    </div>

                    {/* Payment Info */}
                    <div className="card p-6">
                        <h2 className="text-xl font-bold font-display text-text-main mb-4 border-b border-border-color pb-2">Payment Method</h2>
                        <p className="text-text-muted">
                            <strong className="text-text-main">Method: </strong>
                            {cart.paymentMethod} {cart.paymentProvider && cart.paymentProvider !== cart.paymentMethod ? `(${cart.paymentProvider})` : ''}
                        </p>
                    </div>

                    {/* Order Items */}
                    <div className="card p-6">
                        <h2 className="text-xl font-bold font-display text-text-main mb-4 border-b border-border-color pb-2">Order Items</h2>
                        {cart.cartItems.length === 0 ? (
                            <Message>Your cart is empty</Message>
                        ) : (
                            <div className="space-y-4">
                                {cart.cartItems.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-4 border-b border-border-color pb-4 last:border-0 last:pb-0">
                                        <div className="w-16 h-16 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <Link to={`/product/${item._id}`} className="hover:text-accent font-semibold flex-grow text-text-main">
                                            {item.name}
                                        </Link>
                                        <div className="text-text-muted">
                                            {item.qty} x <span className="font-medium">₹{item.price.toLocaleString()}</span> = <span className="text-text-main font-bold">₹{(item.qty * item.price).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="col-span-1">
                    <div className="card p-6 sticky top-24 bg-white shadow-lg border border-border-color">
                        <h2 className="text-2xl font-bold font-display text-text-main mb-6 border-b border-border-color pb-4">Order Summary</h2>

                        {/* Coupon Input */}
                        <div className="mb-6 flex gap-2">
                            <input
                                type="text"
                                placeholder="Coupon Code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="input-field py-2 text-sm"
                            />
                            <button
                                onClick={applyCouponHandler}
                                disabled={loadingCoupon || cart.discount > 0}
                                className="btn-primary text-sm px-4 whitespace-nowrap disabled:opacity-50"
                            >
                                Apply
                            </button>
                        </div>

                        <div className="space-y-3 text-text-muted text-sm">
                            <div className="flex justify-between">
                                <span>Items</span>
                                <span>₹{Number(cart.itemsPrice).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>₹{Number(cart.shippingPrice).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>₹{Number(cart.taxPrice).toLocaleString()}</span>
                            </div>
                            {cart.discount > 0 && (
                                <div className="flex justify-between text-green-600 font-medium">
                                    <span>Discount ({cart.discount}%)</span>
                                    <span>-₹{(Number(cart.itemsPrice) * cart.discount / 100).toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between border-t border-border-color pt-3 font-bold text-xl text-text-main">
                                <span>Total</span>
                                <span>₹{Number(cart.totalPrice).toLocaleString()}</span>
                            </div>
                        </div>

                        {error && <div className="mt-4"><Message variant='danger'>{error?.data?.message || error.error}</Message></div>}

                        <button
                            type='button'
                            className="btn-primary w-full mt-6 py-4 text-base shadow-xl disabled:opacity-50"
                            disabled={cart.cartItems.length === 0 || isLoading}
                            onClick={placeOrderHandler}
                        >
                            {cart.paymentMethod === 'CARD' || cart.paymentMethod === 'UPI' ? 'Pay & Place Order' : 'Place Order'}
                        </button>
                        {isLoading && <div className="mt-4 flex justify-center"><Loader /></div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderScreen;
