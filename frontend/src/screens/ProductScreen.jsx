import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    useGetProductDetailsQuery,
    useCreateReviewMutation,
} from '../slices/productsApiSlice';
import Rating from '../components/Rating'; // We might need to update this component too or use the inline one
import Loader from '../components/Loader';
import Message from '../components/Message';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';

const ProductScreen = () => {
    const { id: productId } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo } = useSelector((state) => state.auth);


    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    // New State for Attributes
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');

    const {
        data: product,
        isLoading,
        refetch,
        error,
    } = useGetProductDetailsQuery(productId);

    const [createReview, { isLoading: loadingProductReview }] =
        useCreateReviewMutation();

    const addToCartHandler = () => {
        if (!size) {
            toast.error('Please select a size');
            return;
        }
        dispatch(addToCart({ ...product, qty, size, color }));
        navigate('/cart');
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await createReview({
                productId,
                rating,
                comment,
            }).unwrap();
            refetch();
            toast.success('Review Submitted');
            setRating(0);
            setComment('');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Link className='btn-outline px-4 py-2 inline-flex items-center text-sm mb-8' to='/'>
                <FaArrowLeft className="mr-2" /> Go Back
            </Link>

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Product Image */}
                        <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-700">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{product.name}</h3>
                                {product.brand && (
                                    <div className="flex items-center mb-2">
                                        <p className="text-gray-400 text-sm">Brand: <span className="text-accent font-semibold">{product.brand.name}</span></p>
                                    </div>
                                )}
                                <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                                <div className="flex items-center gap-4 mb-4">
                                    <p className="text-4xl font-bold text-accent">${product.price}</p>
                                    {product.discount > 0 && (
                                        <span className="bg-red-600 text-white px-2 py-1 text-xs rounded-full">-{product.discount}% OFF</span>
                                    )}
                                </div>
                                <p className="text-gray-300 leading-relaxed">{product.description}</p>
                            </div>

                            <div className="card p-6 border-t font-semibold">
                                <div className="flex justify-between mb-4 border-b border-gray-700 pb-2">
                                    <span className="text-gray-400">Price:</span>
                                    <span className="text-white">${product.price}</span>
                                </div>
                                <div className="flex justify-between mb-4 border-b border-gray-700 pb-2">
                                    <span className="text-gray-400">Status:</span>
                                    <span className={product.countInStock > 0 ? 'text-green-500' : 'text-red-500'}>
                                        {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                                    </span>
                                </div>

                                {product.countInStock > 0 && (
                                    <>
                                        {/* Size Selector */}
                                        <div className="mb-4">
                                            <span className="block text-gray-400 mb-2">Select Size (UK/India):</span>
                                            <div className="flex flex-wrap gap-2">
                                                {product.sizes?.length > 0 ? (
                                                    product.sizes.map((s) => (
                                                        <button
                                                            key={s}
                                                            className={`px-3 py-1 border rounded ${size === s ? 'border-accent text-accent' : 'border-gray-600 text-gray-300 hover:border-gray-400'}`}
                                                            onClick={() => setSize(s)}
                                                        >
                                                            {s}
                                                        </button>
                                                    ))
                                                ) : <span className="text-sm text-gray-500">Standard</span>}
                                            </div>
                                        </div>

                                        {/* Color Selector */}
                                        {product.colors?.length > 0 && (
                                            <div className="mb-4">
                                                <span className="block text-gray-400 mb-2">Select Color:</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {product.colors.map((c) => (
                                                        <button
                                                            key={c}
                                                            className={`px-3 py-1 border rounded ${color === c ? 'border-accent text-accent' : 'border-gray-600 text-gray-300 hover:border-gray-400'}`}
                                                            onClick={() => setColor(c)}
                                                        >
                                                            {c}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-gray-400">Qty:</span>
                                            <select
                                                className="bg-gray-800 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-accent"
                                                value={qty}
                                                onChange={(e) => setQty(Number(e.target.value))}
                                            >
                                                {[...Array(product.countInStock).keys()].map(
                                                    (x) => (
                                                        <option key={x + 1} value={x + 1}>
                                                            {x + 1}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                    </>
                                )}

                                <button
                                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                    type='button'
                                    disabled={product.countInStock === 0}
                                    onClick={addToCartHandler}
                                >
                                    Add To Cart
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="mt-16 max-w-4xl">
                        <h2 className="text-2xl font-display font-bold text-accent mb-6">Reviews</h2>
                        {product.reviews.length === 0 && <Message>No Reviews</Message>}

                        <div className="space-y-4 mb-8">
                            {product.reviews?.map((review) => (
                                <div key={review._id} className="card p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <strong className="text-white">{review.name}</strong>
                                        <Rating value={review.rating} />
                                    </div>
                                    <p className="text-gray-400 text-sm mb-2">{review.createdAt.substring(0, 10)}</p>
                                    <p className="text-gray-300">{review.comment}</p>
                                </div>
                            ))}
                        </div>


                        {/* Write Review Form */}
                        <div className="card p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Write a Customer Review</h2>
                            {loadingProductReview && <Loader />}
                            {userInfo ? (
                                <form onSubmit={submitHandler} className="space-y-4">
                                    <div>
                                        <label className="block mb-1 text-sm font-semibold text-gray-300">Rating</label>
                                        <select
                                            value={rating}
                                            onChange={(e) => setRating(Number(e.target.value))}
                                            className="input-field"
                                        >
                                            <option value=''>Select...</option>
                                            <option value='1'>1 - Poor</option>
                                            <option value='2'>2 - Fair</option>
                                            <option value='3'>3 - Good</option>
                                            <option value='4'>4 - Very Good</option>
                                            <option value='5'>5 - Excellent</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-semibold text-gray-300">Comment</label>
                                        <textarea
                                            rows='3'
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="input-field"
                                        ></textarea>
                                    </div>
                                    <button
                                        disabled={loadingProductReview}
                                        type='submit'
                                        className="btn-primary"
                                    >
                                        Submit
                                    </button>
                                </form>
                            ) : (
                                <Message>
                                    Please <Link to='/login' className="underline text-accent">sign in</Link> to write a review
                                </Message>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductScreen;
