import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { FaTrash, FaShoppingCart, FaArrowLeft, FaHeartBroken, FaHeart } from 'react-icons/fa';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';
import { addToCart } from '../slices/cartSlice';
import '../styles/WishlistScreen.css';

const WishlistScreen = () => {
    const { data: wishlist, isLoading, refetch, error } = useGetWishlistQuery();
    const [removeFromWishlist, { isLoading: loadingremove }] = useRemoveFromWishlistMutation();
    const dispatch = useDispatch();

    const removeFromWishlistHandler = async (id) => {
        try {
            await removeFromWishlist(id).unwrap();
            refetch();
            toast.success('Removed from wishlist');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const addToCartHandler = (product) => {
        dispatch(addToCart({ ...product, qty: 1 }));
        toast.success('Added to Cart');
    };

    return (
        <div className="container-custom wishlist-container">
            <div className="wishlist-header-wrapper">
                <div>
                    <Link className="wishlist-back-link group" to='/'>
                        <FaArrowLeft className="wishlist-back-icon" /> Continue Shopping
                    </Link>
                    <h1 className="wishlist-title">
                        My Wishlist <span className="wishlist-title-count">{wishlist?.length > 0 && `(${wishlist.length} Items)`}</span>
                    </h1>
                </div>
            </div>

            {isLoading ? (
                <div className="wishlist-loader-container"><Loader /></div>
            ) : error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : wishlist.length === 0 ? (
                <div className="wishlist-empty-card">
                    <div className="wishlist-empty-icon-wrap">
                        <FaHeartBroken className="wishlist-empty-icon" />
                    </div>
                    <h2 className="wishlist-empty-title">Your wishlist is empty</h2>
                    <p className="wishlist-empty-text">Explore our premium collection and save your favorites here.</p>
                    <Link to='/' className="btn-primary wishlist-start-shopping">Explore Collection</Link>
                </div>
            ) : (
                <div className="wishlist-grid">
                    {wishlist.map((product) => (
                        <div key={product._id} className="wishlist-item-card group">
                            {/* Discount Badge */}
                            <div className="wishlist-item-badge-wrap">
                                {product.countInStock === 0 && (
                                    <span className="wishlist-item-soldout-badge">SOLD OUT</span>
                                )}
                            </div>

                            {/* Remove Button (Absolute) */}
                            <button
                                onClick={() => removeFromWishlistHandler(product._id)}
                                className="wishlist-item-remove-btn"
                                disabled={loadingremove}
                                title="Remove from Wishlist"
                            >
                                <FaTrash />
                            </button>

                            <Link to={`/product/${product._id}`} className="wishlist-item-img-link">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="wishlist-item-img"
                                />
                            </Link>

                            <div className="wishlist-item-details">
                                <Link to={`/product/${product._id}`}>
                                    <h3 className="wishlist-item-title">{product.name}</h3>
                                </Link>
                                <div className="wishlist-item-brand">{product.brand}</div>

                                <div className="wishlist-item-status-row">
                                    <div className="wishlist-item-price-wrap">
                                        <span className="wishlist-item-price">${product.price}</span>
                                    </div>
                                    <div className={`wishlist-item-status-text ${product.countInStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                        {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                                    </div>
                                </div>

                                <button
                                    onClick={() => addToCartHandler(product)}
                                    disabled={product.countInStock === 0}
                                    className="btn-primary wishlist-item-btn"
                                >
                                    <FaShoppingCart /> {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistScreen;
