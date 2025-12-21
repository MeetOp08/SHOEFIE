import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    useGetProductDetailsQuery,
    useCreateReviewMutation,
} from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Rating = ({ value, text }) => {
    return (
        <div className='flex items-center mb-2'>
            {[1, 2, 3, 4, 5].map((index) => (
                <span key={index} className='text-yellow-500'>
                    {value >= index ? (
                        <FaStar />
                    ) : value >= index - 0.5 ? (
                        <FaStarHalfAlt />
                    ) : (
                        <FaRegStar />
                    )}
                </span>
            ))}
            <span className='ml-2 text-gray-600 text-sm'>{text && text}</span>
        </div>
    );
};

const ProductScreen = () => {
    const { id: productId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const {
        data: product,
        isLoading,
        error,
        refetch,
    } = useGetProductDetailsQuery(productId);

    const [createReview, { isLoading: loadingProductReview }] =
        useCreateReviewMutation();

    const { userInfo } = useSelector((state) => state.auth);

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
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
        <>
            <Link className='btn btn-light my-3 text-blue-500 hover:underline' to='/'>
                Go Back
            </Link>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        {/* Image */}
                        <div>
                            <img
                                src={product.image}
                                alt={product.name}
                                className='w-full rounded-lg shadow-lg'
                            />
                        </div>

                        {/* Details */}
                        <div>
                            <h3 className='text-2xl font-bold mb-2'>{product.name}</h3>
                            <Rating
                                value={product.rating}
                                text={`${product.numReviews} reviews`}
                            />
                            <p className='text-2xl font-semibold my-4'>${product.price}</p>
                            <p className='text-gray-600 mb-4'>{product.description}</p>

                            <div className="border p-4 rounded-lg shadow-sm">
                                <div className="flex justify-between mb-2">
                                    <span>Price:</span>
                                    <span className="font-bold">${product.price}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Status:</span>
                                    <span className={product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}>
                                        {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                                    </span>
                                </div>

                                {product.countInStock > 0 && (
                                    <div className="flex justify-between items-center mb-4">
                                        <span>Qty</span>
                                        <select
                                            className="border rounded p-1"
                                            value={qty}
                                            onChange={(e) => setQty(Number(e.target.value))}
                                        >
                                            {[...Array(product.countInStock).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <button
                                    onClick={addToCartHandler}
                                    className={`w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition ${product.countInStock === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                                    disabled={product.countInStock === 0}
                                >
                                    Add To Cart
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className='mt-10'>
                        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                        {product.reviews.length === 0 && <Message>No Reviews</Message>}
                        <div className="space-y-4">
                            {product.reviews.map((review) => (
                                <div key={review._id} className="bg-gray-100 p-4 rounded">
                                    <div className="flex justify-between">
                                        <strong>{review.name}</strong>
                                        <Rating value={review.rating} text="" />
                                    </div>
                                    <p className="text-sm text-gray-500">{review.createdAt.substring(0, 10)}</p>
                                    <p className="mt-2">{review.comment}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6">
                            <h2 className="text-xl font-bold mb-3">Write a Customer Review</h2>
                            {userInfo ? (
                                <form onSubmit={submitHandler} className="space-y-4">
                                    <div>
                                        <label className="block mb-1">Rating</label>
                                        <select
                                            value={rating}
                                            onChange={(e) => setRating(Number(e.target.value))}
                                            className="w-full border p-2 rounded"
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
                                        <label className="block mb-1">Comment</label>
                                        <textarea
                                            className="w-full border p-2 rounded"
                                            rows="3"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <button
                                        disabled={loadingProductReview}
                                        type='submit'
                                        className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
                                    >
                                        Submit
                                    </button>
                                </form>
                            ) : (
                                <Message>
                                    Please <Link to='/login' className="underline">sign in</Link> to write a review
                                </Message>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default ProductScreen;
