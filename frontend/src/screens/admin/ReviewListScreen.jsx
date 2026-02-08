
import { FaTrash } from 'react-icons/fa';
import { useGetReviewsQuery, useDeleteReviewMutation } from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';

const ReviewListScreen = () => {
    const { data: reviews, isLoading, error, refetch } = useGetReviewsQuery();

    const [deleteReview, { isLoading: loadingDelete }] = useDeleteReviewMutation();

    const deleteHandler = async (productId, reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                await deleteReview({ productId, reviewId });
                toast.success('Review deleted');
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-display font-bold text-text-main mb-8">Reviews Management</h1>
            {loadingDelete && <Loader />}
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-border-color overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-secondary text-text-muted text-sm uppercase tracking-wider">
                                    <th className="p-4 border-b border-border-color">ID</th>
                                    <th className="p-4 border-b border-border-color">Product</th>
                                    <th className="p-4 border-b border-border-color">User</th>
                                    <th className="p-4 border-b border-border-color">Rating</th>
                                    <th className="p-4 border-b border-border-color">Comment</th>
                                    <th className="p-4 border-b border-border-color">Date</th>
                                    <th className="p-4 border-b border-border-color">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-color">
                                {reviews.map((review) => (
                                    <tr key={review._id} className="hover:bg-secondary/50 transition-colors">
                                        <td className="p-4 text-sm text-text-main">{review._id.substring(0, 10)}...</td>
                                        <td className="p-4 text-sm font-medium text-text-main">{review.productName}</td>
                                        <td className="p-4 text-sm text-text-muted">{review.name}</td>
                                        <td className="p-4 text-sm font-bold text-accent">{review.rating} ★</td>
                                        <td className="p-4 text-sm text-text-main italic">"{review.comment.substring(0, 50)}..."</td>
                                        <td className="p-4 text-sm text-text-muted">{new Date(review.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => deleteHandler(review.productId, review._id)}
                                                className="text-red-500 hover:text-red-700 transition-colors p-2"
                                                title="Delete Review"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {reviews.length === 0 && (
                        <div className="p-8 text-center text-text-muted">No reviews found.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReviewListScreen;
