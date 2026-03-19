import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductDetailsQuery, useCreateReviewMutation, useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import { addToCart } from '../slices/cartSlice';
import { useAddToWishlistMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Rating from '../components/Rating';
import { FaHeart, FaTruck, FaUndo, FaShieldAlt, FaStar, FaExclamationTriangle } from 'react-icons/fa';
import '../styles/ProductScreen.css';

const ProductScreen = () => {
    const { id: productId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [qty, setQty] = useState(1);
    const [activeImage, setActiveImage] = useState('');
    const [size, setSize] = useState('');

    // Ratings state
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);

    // Fetch related products
    const categoryId = product?.category?._id || product?.category;
    const { data: relatedProductsData } = useGetProductsQuery(
        { category: categoryId },
        { skip: !categoryId }
    );

    const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();
    const [addToWishlist] = useAddToWishlistMutation();

    const { userInfo } = useSelector((state) => state.auth);

    const addToCartHandler = () => {
        if (!size && product.sizes?.length > 0) {
            toast.error('Please select a size');
            return;
        }
        dispatch(addToCart({ ...product, qty, size }));
        navigate('/cart');
    };

    const addToWishlistHandler = async () => {
        try {
            await addToWishlist({ productId }).unwrap();
            toast.success('Added to Wishlist');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await createReview({ productId, rating, comment }).unwrap();
            refetch();
            toast.success('Review Submitted');
            setRating(0);
            setComment('');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="product-screen-container">
            <div className="container-custom">
                <Link to="/" className="product-back-link">
                    &larr; Back to Collection
                </Link>

                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>{error?.data?.message || error.error}</Message>
                ) : (
                    <div className="product-layout">
                        {/* 1. Left: Image Gallery */}
                        <div className="product-gallery">
                            {/* Main Image */}
                            <div className="product-main-image-card">
                                <img
                                    src={activeImage || product.image}
                                    alt={product.name}
                                    className="product-main-img"
                                />
                                {/* Optional: Zoom hint icon could go here */}
                            </div>

                            {/* Thumbnails */}
                            <div className="product-thumbnails-grid">
                                {product.images && [product.image, ...product.images].map((img, idx) => {
                                    // Deduplicate main image if it appears in images array
                                    if (idx > 0 && img === product.image) return null;

                                    const isActive = (activeImage || product.image) === img;

                                    return (
                                        <div
                                            key={idx}
                                            className={`product-thumbnail-wrap ${isActive ? 'active' : 'inactive'}`}
                                            onClick={() => setActiveImage(img)}
                                        >
                                            <img src={img} className="product-thumbnail-img" alt={`View ${idx + 1}`} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 2. Right: Product Details */}
                        <div className="product-details-col">
                            {/* Header */}
                            <div className="product-header">
                                <h2 className="product-brand">
                                    {typeof product.brand === 'object' ? product.brand.name : product.brand}
                                </h2>
                                <h1 className="product-title">
                                    {product.name}
                                </h1>
                                <div className="product-rating-row">
                                    <div className="product-stars">
                                        <Rating value={product.rating} />
                                    </div>
                                    <span className="product-reviews-count">
                                        {product.numReviews} Verified Reviews
                                    </span>
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="product-pricing-card">
                                <div className="product-pricing-row">
                                    {product.discountPrice > 0 ? (
                                        <>
                                            <span className="product-price-main">₹{product.discountPrice.toLocaleString()}</span>
                                            <span className="product-price-muted">₹{product.price.toLocaleString()}</span>
                                            <span className="product-discount-badge">
                                                {product.discount}% OFF
                                            </span>
                                        </>
                                    ) : (
                                        <span className="product-price-main">₹{product.price.toLocaleString()}</span>
                                    )}
                                </div>
                                <p className="product-pricing-note">Includes all taxes & duties. Free shipping.</p>
                            </div>

                            {/* Description */}
                            <p className="product-description-text">
                                {product.description}
                            </p>

                            {/* Size Selector */}
                            {product.sizes?.length > 0 && (
                                <div className="product-size-container">
                                    <label className="product-size-label">Select Size (UK/India)</label>
                                    <div className="product-size-grid">
                                        {product.sizes.map((s) => (
                                            <button
                                                key={s}
                                                className={`product-size-btn ${size === s ? 'active' : 'inactive'}`}
                                                onClick={() => setSize(s)}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Low Stock Warning */}
                            {product.countInStock > 0 && product.countInStock <= (product.lowStockThreshold || 5) && (
                                <div className="product-stock-warning">
                                    <FaExclamationTriangle />
                                    Hurry! Only {product.countInStock} left in stock.
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="product-actions-row">
                                <div className="product-qty-select-wrap">
                                    <select
                                        className="input-field product-qty-select"
                                        value={qty}
                                        onChange={(e) => setQty(Number(e.target.value))}
                                    >
                                        {[...Array(Math.min(10, product.countInStock)).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={addToCartHandler}
                                    disabled={product.countInStock === 0}
                                    className="btn-primary product-add-cart-btn"
                                >
                                    {product.countInStock > 0 ? 'Add to Cart' : 'Sold Out'}
                                </button>
                                <button
                                    onClick={addToWishlistHandler}
                                    className="product-wishlist-btn"
                                >
                                    <FaHeart className="product-wishlist-icon" />
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="product-trust-badges">
                                <div className="product-trust-item">
                                    <FaTruck className="product-trust-icon" />
                                    <span className="product-trust-text">Fast Delivery</span>
                                </div>
                                <div className="product-trust-item">
                                    <FaUndo className="product-trust-icon" />
                                    <span className="product-trust-text">Easy Returns</span>
                                </div>
                                <div className="product-trust-item">
                                    <FaShieldAlt className="product-trust-icon" />
                                    <span className="product-trust-text">Secure Pay</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Related Products Section */}
                {relatedProductsData?.products?.length > 1 && (
                    <div className="product-section product-section-top-border">
                        <h3 className="product-section-title">
                            You Might Also Like
                        </h3>
                        <div className="product-related-grid">
                            {relatedProductsData.products
                                .filter((p) => p._id !== productId)
                                .slice(0, 4)
                                .map((product) => (
                                    <Product key={product._id} product={product} />
                                ))}
                        </div>
                    </div>
                )}

                {/* Reviews Section */}
                <div className="product-section">
                    <h3 className="product-section-title product-section-title-border">
                        Customer Reviews
                    </h3>
                    <div className="product-reviews-layout">
                        {/* Existing Reviews */}
                        <div className="product-reviews-list">
                            {product?.reviews.length === 0 && <Message>No reviews yet.</Message>}
                            {product?.reviews.map((review) => (
                                <div key={review._id} className="card product-review-card">
                                    <div className="product-review-header">
                                        <strong className="product-review-author">{review.name}</strong>
                                        <Rating value={review.rating} />
                                    </div>
                                    <p className="product-review-date">{review.createdAt.substring(0, 10)}</p>
                                    <p className="product-review-text">{review.comment}</p>
                                </div>
                            ))}
                        </div>

                        {/* Write Review */}
                        <div className="card product-review-write">
                            <h4 className="product-review-write-title">Write a Review</h4>
                            {userInfo ? (
                                <form onSubmit={submitHandler} className="product-review-form">
                                    <div>
                                        <label className="product-review-label">Rating</label>
                                        <select
                                            value={rating}
                                            onChange={(e) => setRating(Number(e.target.value))}
                                            className="input-field"
                                        >
                                            <option value="">Select...</option>
                                            <option value="5">5 - Excellent</option>
                                            <option value="4">4 - Very Good</option>
                                            <option value="3">3 - Good</option>
                                            <option value="2">2 - Fair</option>
                                            <option value="1">1 - Poor</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="product-review-label">Comment</label>
                                        <textarea
                                            rows="4"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="input-field"
                                            placeholder="How was the product?"
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="btn-primary product-review-submit-btn" disabled={loadingProductReview}>
                                        Submit Review
                                    </button>
                                </form>
                            ) : (
                                <Message>Please <Link to="/login" className="product-review-login-link">sign in</Link> to write a review</Message>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductScreen;
