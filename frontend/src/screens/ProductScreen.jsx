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
        <div className="min-h-screen bg-primary py-10">
            <div className="container-custom">
                <Link to="/" className="text-sm font-medium text-text-muted hover:text-accent mb-6 inline-block">
                    &larr; Back to Collection
                </Link>

                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>{error?.data?.message || error.error}</Message>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        {/* 1. Left: Image Gallery */}
                        <div className="space-y-6 sticky top-24 self-start">
                            {/* Main Image */}
                            <div className="bg-white rounded-3xl overflow-hidden aspect-[4/5] shadow-lg border border-gray-100 relative group">
                                <img
                                    src={activeImage || product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 cursor-zoom-in"
                                />
                                {/* Optional: Zoom hint icon could go here */}
                            </div>

                            {/* Thumbnails */}
                            <div className="grid grid-cols-5 gap-3">
                                {product.images && [product.image, ...product.images].map((img, idx) => {
                                    // Deduplicate main image if it appears in images array
                                    if (idx > 0 && img === product.image) return null;

                                    const isActive = (activeImage || product.image) === img;

                                    return (
                                        <div
                                            key={idx}
                                            className={`cursor-pointer rounded-xl overflow-hidden aspect-square border transition-all duration-200 ${isActive
                                                ? 'border-accent ring-2 ring-accent ring-offset-2 opacity-100'
                                                : 'border-gray-100 hover:border-gray-300 opacity-70 hover:opacity-100'}`}
                                            onClick={() => setActiveImage(img)}
                                        >
                                            <img src={img} className="w-full h-full object-cover" alt={`View ${idx + 1}`} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 2. Right: Product Details */}
                        <div className="flex flex-col">
                            {/* Header */}
                            <div className="mb-6">
                                <h2 className="text-sm font-bold text-accent uppercase tracking-wider mb-2">
                                    {typeof product.brand === 'object' ? product.brand.name : product.brand}
                                </h2>
                                <h1 className="text-3xl md:text-5xl font-display font-bold text-text-main mb-4">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-4">
                                    <div className="flex text-yellow-500 text-sm">
                                        <Rating value={product.rating} />
                                    </div>
                                    <span className="text-text-muted text-sm border-l border-border-color pl-4">
                                        {product.numReviews} Verified Reviews
                                    </span>
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="mb-8 p-6 bg-secondary rounded-xl border border-border-color">
                                <div className="flex items-baseline gap-3 mb-2">
                                    {product.discountPrice > 0 ? (
                                        <>
                                            <span className="text-4xl font-bold text-text-main">₹{product.discountPrice.toLocaleString()}</span>
                                            <span className="text-xl text-text-muted line-through">₹{product.price.toLocaleString()}</span>
                                            <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                                                {product.discount}% OFF
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-4xl font-bold text-text-main">₹{product.price.toLocaleString()}</span>
                                    )}
                                </div>
                                <p className="text-sm text-text-muted">Includes all taxes & duties. Free shipping.</p>
                            </div>

                            {/* Description */}
                            <p className="text-text-muted leading-relaxed mb-8">
                                {product.description}
                            </p>

                            {/* Size Selector */}
                            {product.sizes?.length > 0 && (
                                <div className="mb-8">
                                    <label className="block text-sm font-bold text-text-main mb-3">Select Size (UK/India)</label>
                                    <div className="flex flex-wrap gap-3">
                                        {product.sizes.map((s) => (
                                            <button
                                                key={s}
                                                className={`w-12 h-12 rounded-lg border-2 font-bold flex items-center justify-center transition-all ${size === s
                                                    ? 'border-accent bg-accent text-white shadow-lg'
                                                    : 'border-border-color text-text-main hover:border-gray-400'
                                                    }`}
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
                                <div className="text-red-600 font-bold mb-4 flex items-center animate-pulse">
                                    <FaExclamationTriangle className="mr-2" />
                                    Hurry! Only {product.countInStock} left in stock.
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4 mb-8">
                                <div className="w-24">
                                    <select
                                        className="input-field h-full font-bold text-center"
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
                                    className="btn-primary flex-grow text-lg shadow-xl"
                                >
                                    {product.countInStock > 0 ? 'Add to Cart' : 'Sold Out'}
                                </button>
                                <button
                                    onClick={addToWishlistHandler}
                                    className="w-14 h-14 rounded-lg border border-border-color flex items-center justify-center text-text-muted hover:text-red-500 hover:border-red-500 transition-colors"
                                >
                                    <FaHeart className="text-xl" />
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border-color">
                                <div className="text-center">
                                    <FaTruck className="text-2xl text-accent mx-auto mb-2" />
                                    <span className="text-xs font-bold text-text-main block">Fast Delivery</span>
                                </div>
                                <div className="text-center">
                                    <FaUndo className="text-2xl text-accent mx-auto mb-2" />
                                    <span className="text-xs font-bold text-text-main block">Easy Returns</span>
                                </div>
                                <div className="text-center">
                                    <FaShieldAlt className="text-2xl text-accent mx-auto mb-2" />
                                    <span className="text-xs font-bold text-text-main block">Secure Pay</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Related Products Section */}
                {relatedProductsData?.products?.length > 1 && (
                    <div className="mt-20 border-t border-border-color pt-10">
                        <h3 className="text-2xl font-display font-bold text-text-main mb-8">
                            You Might Also Like
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                <div className="mt-20">
                    <h3 className="text-2xl font-display font-bold text-text-main mb-8 border-b border-border-color pb-4">
                        Customer Reviews
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Existing Reviews */}
                        <div className="space-y-6">
                            {product?.reviews.length === 0 && <Message>No reviews yet.</Message>}
                            {product?.reviews.map((review) => (
                                <div key={review._id} className="card p-6">
                                    <div className="flex justify-between mb-2">
                                        <strong className="font-bold text-text-main">{review.name}</strong>
                                        <Rating value={review.rating} />
                                    </div>
                                    <p className="text-text-muted text-sm mb-2">{review.createdAt.substring(0, 10)}</p>
                                    <p className="text-text-main">{review.comment}</p>
                                </div>
                            ))}
                        </div>

                        {/* Write Review */}
                        <div className="card p-8 bg-secondary">
                            <h4 className="text-xl font-bold mb-4">Write a Review</h4>
                            {userInfo ? (
                                <form onSubmit={submitHandler} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Rating</label>
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
                                        <label className="block text-sm font-medium mb-1">Comment</label>
                                        <textarea
                                            rows="4"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="input-field"
                                            placeholder="How was the product?"
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="btn-primary w-full" disabled={loadingProductReview}>
                                        Submit Review
                                    </button>
                                </form>
                            ) : (
                                <Message>Please <Link to="/login" className="text-accent underline">sign in</Link> to write a review</Message>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductScreen;
