import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useCreateOrderMutation, useGetRazorpayKeyQuery, usePayOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);

    const [createOrder, { isLoading, error }] = useCreateOrderMutation();
    const { data: razorpayKey } = useGetRazorpayKeyQuery();
    const [payOrder] = usePayOrderMutation();

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
                    await payOrder({
                        orderId: order._id,
                        details: {
                            id: response.razorpay_payment_id,
                            status: 'COMPLETED',
                            update_time: new Date().toISOString(),
                            email_address: cart.shippingAddress.email || 'user@example.com',
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
                name: cart.shippingAddress.name,
                email: 'user@example.com',
                contact: '9999999999',
            },
            theme: {
                color: '#D4AF37',
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
            if (cart.paymentMethod === 'Razorpay') {
                // Open Razorpay
                handleRazorpayPayment(res, res); // In a real app, res would contain backend-generated order details
            } else {
                // COD or others
                dispatch(clearCartItems());
                navigate(`/order/${res._id}`);
            }

        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <CheckoutSteps step1 step2 step3 step4 />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Shipping */}
                    <div className="card p-6">
                        <h2 className="text-xl font-bold font-display text-accent mb-4">Shipping Information</h2>
                        <p className="text-gray-300">
                            <strong className="text-white">Address: </strong>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                            {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                        </p>
                    </div>

                    {/* Payment Method */}
                    <div className="card p-6">
                        <h2 className="text-xl font-bold font-display text-accent mb-4">Payment Method</h2>
                        <p className="text-gray-300">
                            <strong className="text-white">Method: </strong>
                            {cart.paymentMethod} {cart.paymentProvider && cart.paymentProvider !== cart.paymentMethod ? `(${cart.paymentProvider})` : ''}
                        </p>
                    </div>

                    {/* Order Items */}
                    <div className="card p-6">
                        <h2 className="text-xl font-bold font-display text-accent mb-4">Order Items</h2>
                        {cart.cartItems.length === 0 ? (
                            <Message>Your cart is empty</Message>
                        ) : (
                            <div className="space-y-4">
                                {cart.cartItems.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-4 border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                                        <Link to={`/product/${item._id}`} className="hover:text-accent font-semibold flex-grow">
                                            {item.name}
                                        </Link>
                                        <div className="text-gray-300">
                                            {item.qty} x ${item.price} = <span className="text-white font-bold">${(item.qty * item.price).toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="col-span-1">
                    <div className="card p-6 sticky top-24">
                        <h2 className="text-2xl font-bold font-display text-accent mb-6 border-b border-gray-700 pb-4">Order Summary</h2>
                        <div className="space-y-3 text-gray-300">
                            <div className="flex justify-between">
                                <span>Items</span>
                                <span>${cart.itemsPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>${cart.shippingPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>${cart.taxPrice}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-700 pt-3 font-bold text-xl text-white">
                                <span>Total</span>
                                <span>${cart.totalPrice}</span>
                            </div>
                        </div>

                        {error && <div className="mt-4"><Message variant='danger'>{error?.data?.message || error.error}</Message></div>}

                        <button
                            type='button'
                            className="btn-primary w-full mt-6 disabled:opacity-50"
                            disabled={cart.cartItems.length === 0 || isLoading}
                            onClick={placeOrderHandler}
                        >
                            {cart.paymentMethod === 'Razorpay' ? 'Pay & Place Order' : 'Place Order'}
                        </button>
                        {isLoading && <Loader />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderScreen;
