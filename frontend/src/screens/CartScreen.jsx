import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <Message>
                        Your cart is empty <Link to='/' className="underline">Go Back</Link>
                    </Message>
                ) : (
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div key={item._id} className="flex items-center justify-between border-b pb-4">
                                <div className="flex items-center space-x-4">
                                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                                    <Link to={`/product/${item._id}`} className="font-semibold text-lg hover:underline">{item.name}</Link>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <p>${item.price}</p>
                                    <select
                                        className="border p-1 rounded"
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
                                        onClick={() => removeFromCartHandler(item._id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="border p-4 rounded-lg shadow-sm h-fit">
                <h2 className="text-xl font-bold mb-4">
                    Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
                </h2>
                <div className="text-2xl font-bold mb-4">
                    ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                </div>
                <button
                    type='button'
                    className={`w-full bg-black text-white py-2 rounded hover:bg-gray-800 ${cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                >
                    Proceed To Checkout
                </button>
            </div>
        </div>
    );
};

export default CartScreen;
