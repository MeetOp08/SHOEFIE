import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaArrowLeft, FaMinus, FaPlus } from 'react-icons/fa';
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
        <div className="bg-primary min-h-screen pt-12 pb-24">
            <div className="container-custom">

                {/* Header */}
                <div className="flex items-center justify-between mb-8 border-b border-border-color pb-6">
                    <h1 className="text-3xl font-display font-bold text-text-main">
                        Shopping Bag
                        <span className="text-text-muted text-lg font-sans font-normal ml-2">
                            ({cartItems.reduce((acc, item) => acc + item.qty, 0)} Items)
                        </span>
                    </h1>
                    <Link to='/' className="text-text-main hover:text-accent text-sm font-medium flex items-center transition-colors">
                        <FaArrowLeft className="mr-2" /> Continue Shopping
                    </Link>
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-24 bg-secondary rounded-xl">
                        <h2 className="text-2xl font-bold text-text-main mb-4">Your bag is empty</h2>
                        <p className="text-text-muted mb-8">Looks like you haven't added any items to the bag yet.</p>
                        <Link to="/" className="btn-primary inline-flex">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Cart Items List */}
                        <div className="flex-1 space-y-6">
                            {cartItems.map((item) => (
                                <div key={item._id} className="flex gap-6 p-6 bg-white rounded-xl border border-border-color shadow-sm hover:shadow-md transition-shadow">
                                    {/* Image */}
                                    <div className="w-32 h-32 flex-shrink-0 bg-secondary rounded-lg overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover object-center"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-text-main hover:text-accent transition-colors">
                                                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                                                </h3>
                                                <p className="text-sm text-text-muted mt-1">
                                                    {item.brand && <span className="uppercase tracking-wide text-xs">{item.brand}</span>}
                                                </p>
                                                <div className="text-sm text-text-muted mt-2 space-y-1">
                                                    <p>Size: <span className="text-text-main font-medium">{item.size || 'N/A'}</span></p>
                                                    <p>Color: <span className="text-text-main font-medium">{item.color || 'N/A'}</span></p>
                                                </div>
                                            </div>
                                            <span className="text-lg font-bold text-text-main">
                                                ₹{(item.price * item.qty).toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex justify-between items-center mt-4">
                                            <div className="flex items-center border border-border-color rounded-lg bg-secondary">
                                                <button
                                                    className="px-3 py-2 text-text-muted hover:text-text-main transition-colors disabled:opacity-30"
                                                    onClick={() => addToCartHandler(item, item.qty - 1)}
                                                    disabled={item.qty <= 1}
                                                >
                                                    <FaMinus size={10} />
                                                </button>
                                                <span className="px-3 py-2 font-medium text-sm w-8 text-center text-text-main">{item.qty}</span>
                                                <button
                                                    className="px-3 py-2 text-text-muted hover:text-text-main transition-colors disabled:opacity-30"
                                                    onClick={() => addToCartHandler(item, item.qty + 1)}
                                                    disabled={item.qty >= item.countInStock}
                                                >
                                                    <FaPlus size={10} />
                                                </button>
                                            </div>

                                            <button
                                                type='button'
                                                className='text-text-muted hover:text-red-500 transition-colors text-sm font-medium flex items-center gap-2'
                                                onClick={() => removeFromCartHandler(item._id)}
                                            >
                                                <FaTrash size={14} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary Side Panel */}
                        <div className="lg:w-96">
                            <div className="bg-white p-8 rounded-xl border border-border-color sticky top-28 shadow-soft">
                                <h2 className="text-xl font-bold text-text-main mb-6 border-b border-border-color pb-4">Order Summary</h2>

                                <div className="space-y-4 mb-6 text-sm">
                                    <div className="flex justify-between text-text-muted">
                                        <span>Subtotal</span>
                                        <span className="text-text-main font-medium">₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-text-muted">
                                        <span>Shipping Attempt</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between text-text-muted border-b border-border-color pb-4">
                                        <span>Tax Estimate</span>
                                        <span className="text-text-main">Calculated at checkout</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-text-main pt-2">
                                        <span>Total</span>
                                        <span className="text-accent">₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    type='button'
                                    className='btn-primary w-full py-4 text-base shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                                    disabled={cartItems.length === 0}
                                    onClick={checkoutHandler}
                                >
                                    Proceed to Checkout
                                </button>

                                <p className="text-xs text-text-muted text-center mt-4">
                                    Secure Checkout - SSL Encrypted
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartScreen;
