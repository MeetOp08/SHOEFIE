
import { FaTrash } from 'react-icons/fa';
import { useGetReviewsQuery, useDeleteReviewMutation } from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';
import '../../styles/admin/ReviewListScreen.css';

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
        <div className="container-custom admin-review-container">
            <h1 className="admin-review-title">Reviews Management</h1>
            {loadingDelete && <Loader />}
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : (
                <div className="admin-review-card">
                    <div className="admin-review-table-wrapper">
                        <table className="admin-review-table">
                            <thead className="admin-review-thead">
                                <tr>
                                    <th className="admin-review-th">ID</th>
                                    <th className="admin-review-th">Product</th>
                                    <th className="admin-review-th">User</th>
                                    <th className="admin-review-th">Rating</th>
                                    <th className="admin-review-th">Comment</th>
                                    <th className="admin-review-th">Date</th>
                                    <th className="admin-review-th">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map((review) => (
                                    <tr key={review._id} className="admin-review-tr">
                                        <td className="admin-review-td admin-review-td-id">{review._id.substring(0, 10)}...</td>
                                        <td className="admin-review-td admin-review-td-product">{review.productName}</td>
                                        <td className="admin-review-td admin-review-td-user">{review.name}</td>
                                        <td className="admin-review-td admin-review-td-rating">{review.rating} ★</td>
                                        <td className="admin-review-td admin-review-td-comment">"{review.comment.substring(0, 50)}..."</td>
                                        <td className="admin-review-td admin-review-td-date">{new Date(review.createdAt).toLocaleDateString()}</td>
                                        <td className="admin-review-td">
                                            <button
                                                onClick={() => deleteHandler(review.productId, review._id)}
                                                className="admin-review-delete-btn"
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
                        <div className="admin-review-empty">No reviews found.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReviewListScreen;
