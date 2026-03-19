import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaArrowLeft, FaMinus, FaPlus } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import '../styles/CartScreen.css';

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
        <div className="cart-container">
            <div className="container-custom">

                {/* Header */}
                <div className="cart-header">
                    <h1 className="cart-title">
                        Shopping Bag
                        <span className="cart-item-count">
                            ({cartItems.reduce((acc, item) => acc + item.qty, 0)} Items)
                        </span>
                    </h1>
                    <Link to='/' className="cart-continue-link">
                        <FaArrowLeft className="cart-back-icon" /> Continue Shopping
                    </Link>
                </div>

                {cartItems.length === 0 ? (
                    <div className="cart-empty-message">
                        <h2 className="cart-empty-title">Your bag is empty</h2>
                        <p className="cart-empty-text">Looks like you haven't added any items to the bag yet.</p>
                        <Link to="/" className="btn-primary cart-start-shopping">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="cart-layout">
                        {/* Cart Items List */}
                        <div className="cart-items-list">
                            {cartItems.map((item) => (
                                <div key={item._id} className="cart-item-card">
                                    {/* Image */}
                                    <div className="cart-item-image-wrapper">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="cart-item-image"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="cart-item-details">
                                        <div className="cart-item-info-top">
                                            <div>
                                                <h3 className="cart-item-title">
                                                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                                                </h3>
                                                <p className="cart-item-brand-wrapper">
                                                    {item.brand && <span className="cart-item-brand">{item.brand}</span>}
                                                </p>
                                                <div className="cart-item-variants">
                                                    <p>Size: <span className="cart-item-variant-value">{item.size || 'N/A'}</span></p>
                                                    <p>Color: <span className="cart-item-variant-value">{item.color || 'N/A'}</span></p>
                                                </div>
                                            </div>
                                            <span className="cart-item-price">
                                                ₹{(item.price * item.qty).toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="cart-item-actions">
                                            <div className="cart-qty-control">
                                                <button
                                                    className="cart-qty-btn"
                                                    onClick={() => addToCartHandler(item, item.qty - 1)}
                                                    disabled={item.qty <= 1}
                                                >
                                                    <FaMinus size={10} />
                                                </button>
                                                <span className="cart-qty-value">{item.qty}</span>
                                                <button
                                                    className="cart-qty-btn"
                                                    onClick={() => addToCartHandler(item, item.qty + 1)}
                                                    disabled={item.qty >= item.countInStock}
                                                >
                                                    <FaPlus size={10} />
                                                </button>
                                            </div>

                                            <button
                                                type='button'
                                                className="cart-remove-btn"
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
                        <div className="cart-summary-wrapper">
                            <div className="cart-summary-card">
                                <h2 className="cart-summary-title">Order Summary</h2>

                                <div className="cart-summary-details">
                                    <div className="cart-summary-row">
                                        <span>Subtotal</span>
                                        <span className="value">₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toLocaleString()}</span>
                                    </div>
                                    <div className="cart-summary-row">
                                        <span>Shipping Attempt</span>
                                        <span className="value-green">Free</span>
                                    </div>
                                    <div className="cart-summary-row border-b">
                                        <span>Tax Estimate</span>
                                        <span className="value-black">Calculated at checkout</span>
                                    </div>
                                    <div className="cart-summary-total">
                                        <span>Total</span>
                                        <span className="total-accent">₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    type='button'
                                    className="btn-primary cart-checkout-btn"
                                    disabled={cartItems.length === 0}
                                    onClick={checkoutHandler}
                                >
                                    Proceed to Checkout
                                </button>

                                <p className="cart-secure-text">
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
