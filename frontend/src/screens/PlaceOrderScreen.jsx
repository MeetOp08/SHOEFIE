import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);

    const [createOrder, { isLoading, error }] = useCreateOrderMutation();

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping');
        } else if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart.shippingAddress.address, cart.paymentMethod, navigate]);

    const placeOrderHandler = async () => {
        try {
            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            }).unwrap();
            dispatch(clearCartItems());
            navigate(`/order/${res._id}`);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    {/* Shipping */}
                    <div className="border-b pb-4">
                        <h2 className="text-xl font-bold mb-2">Shipping</h2>
                        <p>
                            <strong>Address: </strong>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                            {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                        </p>
                    </div>

                    {/* Payment Method */}
                    <div className="border-b pb-4">
                        <h2 className="text-xl font-bold mb-2">Payment Method</h2>
                        <strong>Method: </strong>
                        {cart.paymentMethod}
                    </div>

                    {/* Order Items */}
                    <div>
                        <h2 className="text-xl font-bold mb-2">Order Items</h2>
                        {cart.cartItems.length === 0 ? (
                            <Message>Your cart is empty</Message>
                        ) : (
                            <div className="space-y-4">
                                {cart.cartItems.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-4">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                        <Link to={`/product/${item._id}`} className="hover:underline text-sm md:text-base">
                                            {item.name}
                                        </Link>
                                        <div className="text-sm md:text-base">
                                            {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="border p-4 rounded-lg shadow-sm h-fit">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="flex justify-between mb-2">
                        <span>Items</span>
                        <span>${cart.itemsPrice}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Shipping</span>
                        <span>${cart.shippingPrice}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Tax</span>
                        <span>${cart.taxPrice}</span>
                    </div>
                    <div className="flex justify-between mb-4 border-t pt-2 font-bold text-lg">
                        <span>Total</span>
                        <span>${cart.totalPrice}</span>
                    </div>

                    {error && <Message variant='danger'>{error?.data?.message || error.error}</Message>}

                    <button
                        type='button'
                        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50"
                        disabled={cart.cartItems.length === 0 || isLoading}
                        onClick={placeOrderHandler}
                    >
                        Place Order
                    </button>
                    {isLoading && <Loader />}
                </div>
            </div>
        </>
    );
};

export default PlaceOrderScreen;
