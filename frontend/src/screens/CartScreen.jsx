import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const addToCartHandler = async (product, qty) => {
        dispatch(addToCart({ ...product, qty }));
    };

    const removeFromCartHandler = async (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-display font-bold mb-8 text-accent">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <Message>
                    Your cart is empty. <Link to="/" className="underline text-accent">Go Back</Link>
                </Message>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item._id} className="card flex items-center p-4 gap-4">
                                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />

                                <div className="flex-grow">
                                    <Link to={`/product/${item._id}`} className="text-lg font-semibold hover:text-accent transition-colors">
                                        {item.name}
                                    </Link>
                                    <p className="text-gray-400 text-sm">${item.price}</p>
                                </div>

                                <select
                                    className="bg-gray-800 border border-gray-600 rounded p-1 text-white focus:outline-none"
                                    value={item.qty}
                                    onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                                >
                                    {[...Array(item.countInStock).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                            {x + 1}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    type='button'
                                    className='text-red-500 hover:text-red-400 transition-colors p-2'
                                    onClick={() => removeFromCartHandler(item._id)}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="col-span-1">
                        <div className="card p-6 sticky top-24">
                            <h2 className="text-2xl font-bold mb-4">
                                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
                            </h2>
                            <p className="text-3xl font-bold text-accent mb-6">
                                ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                            </p>
                            <button
                                type='button'
                                className='btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed'
                                disabled={cartItems.length === 0}
                                onClick={checkoutHandler}
                            >
                                Proceed To Checkout
                            </button>
                            <div className="mt-4 text-center">
                                <Link to='/' className="text-gray-400 hover:text-white text-sm flex items-center justify-center">
                                    <FaArrowLeft className="mr-2" /> Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartScreen;
