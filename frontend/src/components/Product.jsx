import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaPlus } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import '../styles/Product.css';

const Product = ({ product }) => {
    const dispatch = useDispatch();

    const addToCartHandler = (e) => {
        e.preventDefault(); // Prevent navigating to product page
        dispatch(addToCart({ ...product, qty: 1 }));
        toast.success('Added to bag');
    };

    return (
        <div className="card product-card">
            {/* Discount Badge */}
            {product.discount > 0 && (
                <span className="product-badge">
                    -{product.discount}%
                </span>
            )}

            {/* Image Container */}
            <Link to={`/product/${product._id}`} className="product-img-container">
                <img
                    src={product.image}
                    alt={product.name}
                    className="product-img"
                    loading="lazy"
                />

                {/* Overlay gradient for text readability if needed, or just subtle darken */}
                <div className="product-overlay" />

                {/* Quick Add Button (Visible on Hover) */}
                <button
                    onClick={addToCartHandler}
                    className="product-quick-add"
                    title="Quick Add"
                >
                    <FaPlus className="text-sm" />
                </button>
            </Link>

            {/* Content */}
            <div className="product-content">
                <div className="product-meta">
                    <span className="product-brand">
                        {typeof product.brand === 'object' ? product.brand.name : product.brand}
                    </span>
                    <div className="product-rating">
                        <FaStar />
                        <span>({product.numReviews})</span>
                    </div>
                </div>

                <Link to={`/product/${product._id}`} className="product-title-link">
                    <h3 className="product-title">
                        {product.name}
                    </h3>
                </Link>

                <p className="product-desc">
                    {product.description}
                </p>

                <div className="product-price-container">
                    {product.discountPrice && product.discountPrice > 0 ? (
                        <>
                            <span className="product-price">₹{product.discountPrice.toLocaleString()}</span>
                            <span className="product-price-old">₹{product.price.toLocaleString()}</span>
                        </>
                    ) : (
                        <span className="product-price">₹{product.price.toLocaleString()}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Product;
