import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useCreateOrderMutation, useCreateCheckoutSessionMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FaLock, FaShippingFast, FaCheckCircle, FaMoneyBillWave } from 'react-icons/fa';

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
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-3xl font-display font-bold text-text-main mb-8 text-center">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Shipping Address Review */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-border-color">
                        <div className="flex items-center justify-between mb-4 border-b border-border-color pb-2">
                            <h2 className="text-xl font-bold font-display text-text-main flex items-center">
                                <FaShippingFast className="mr-2 text-accent" /> Shipping To
                            </h2>
                            <Link to="/shipping" className="text-sm text-accent hover:underline">Edit</Link>
                        </div>
                        <div className="text-text-muted space-y-1">
                            <p className="font-bold text-text-main">{cart.shippingAddress.fullName}</p>
                            <p>{cart.shippingAddress.address}</p>
                            <p>{cart.shippingAddress.city}, {cart.shippingAddress.postalCode}</p>
                            <p>{cart.shippingAddress.country}</p>
                            <p className="text-sm mt-2"><span className="font-semibold">Phone:</span> {cart.shippingAddress.phone}</p>
                        </div>
                    </div>

                    {/* Order Items Review */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-border-color">
                        <h2 className="text-xl font-bold font-display text-text-main mb-4 border-b border-border-color pb-2 flex items-center">
                            <FaCheckCircle className="mr-2 text-accent" /> Your Items
                        </h2>
                        {cart.cartItems.length === 0 ? (
                            <Message>Your cart is empty</Message>
                        ) : (
                            <div className="divide-y divide-border-color">
                                {cart.cartItems.map((item, index) => (
                                    <div key={index} className="flex items-center py-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="ml-4 flex-grow">
                                            <Link to={`/product/${item._id}`} className="font-semibold text-text-main hover:text-accent">
                                                {item.name}
                                            </Link>
                                            <p className="text-sm text-text-muted">Qty: {item.qty}</p>
                                        </div>
                                        <div className="font-bold text-text-main">
                                            ₹{(item.price * item.qty).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Summary & Payment */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-border-color sticky top-24">
                        <h2 className="text-2xl font-bold font-display text-text-main mb-6 border-b border-border-color pb-4">Order Summary</h2>

                        <div className="space-y-3 text-sm mb-6">
                            <div className="flex justify-between text-text-muted">
                                <span>Subtotal ({cart.cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                                <span>₹{cart.itemsPrice}</span>
                            </div>
                            <div className="flex justify-between text-text-muted">
                                <span>Shipping</span>
                                <span>₹{cart.shippingPrice}</span>
                            </div>
                            <div className="flex justify-between text-text-muted">
                                <span>Tax</span>
                                <span>₹{cart.taxPrice}</span>
                            </div>
                            <div className="flex justify-between border-t border-border-color pt-3 mt-2">
                                <span className="font-bold text-xl text-text-main">Total</span>
                                <span className="font-bold text-xl text-accent">₹{cart.totalPrice}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => handlePlaceOrder(true)}
                                disabled={cart.cartItems.length === 0 || loadingCreate || loadingStripe}
                                className="w-full btn-primary py-4 flex items-center justify-center text-lg shadow-md hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loadingStripe ? <Loader className="w-6 h-6" /> : (
                                    <>
                                        <span className="mr-2">Pay with Stripe</span>
                                        <FaLock className="text-sm" />
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => handlePlaceOrder(false)}
                                disabled={cart.cartItems.length === 0 || loadingCreate || loadingStripe}
                                className="w-full bg-gray-100 text-text-main hover:bg-gray-200 font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors border border-gray-300"
                            >
                                <FaMoneyBillWave className="mr-2 text-green-600" /> Pay on Delivery
                            </button>
                        </div>

                        <div className="mt-6 text-xs text-text-muted text-center flex items-center justify-center">
                            <FaLock className="mr-1" /> Secure Encrypted Payment
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
