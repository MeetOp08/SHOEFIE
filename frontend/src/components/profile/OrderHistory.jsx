import { Link } from 'react-router-dom';
import { useGetMyOrdersQuery } from '../../slices/ordersApiSlice';
import Loader from '../Loader';
import Message from '../Message';
import { FaBox, FaCheckCircle, FaTimesCircle, FaTruck } from 'react-icons/fa';
import '../../styles/OrderHistory.css';

const OrderHistory = () => {
    const { data: orders, isLoading, error } = useGetMyOrdersQuery();

    if (isLoading) return <Loader />;
    if (error) return <Message variant="danger">{error?.data?.message || error.error}</Message>;

    const getStatusBadge = (order) => {
        if (order.isDelivered) return <span className="order-history-badge delivered"><FaCheckCircle className="order-history-badge-icon" /> Delivered</span>;
        if (order.isPaid) return <span className="order-history-badge processing"><FaTruck className="order-history-badge-icon" /> Processing</span>;
        return <span className="order-history-badge placed"><FaBox className="order-history-badge-icon" /> Placed</span>;
    };

    return (
        <div className="order-history-container">
            <h2 className="order-history-title">Order History</h2>

            {orders.length === 0 ? (
                <div className="order-history-empty">
                    <FaBox className="order-history-empty-icon" />
                    <h3 className="order-history-empty-title">No Orders Yet</h3>
                    <p className="order-history-empty-text">Looks like you haven't bought anything yet.</p>
                    <Link to="/" className="btn-primary inline-flex">Start Shopping</Link>
                </div>
            ) : (
                <div className="order-history-list">
                    {orders.map((order) => (
                        <div key={order._id} className="order-history-card">
                            <div className="order-history-card-header">
                                <div className="order-history-card-info">
                                    <div className="order-history-card-title-row">
                                        <h3 className="order-history-card-title">Order <span className="order-history-card-id">#{order._id.substring(0, 10)}...</span></h3>
                                        {getStatusBadge(order)}
                                    </div>
                                    <p className="order-history-card-date">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="order-history-card-actions">
                                    <div className="order-history-card-total">
                                        <p className="order-history-card-total-label">Total Amount</p>
                                        <p className="order-history-card-total-value">₹{Number(order.totalPrice).toLocaleString()}</p>
                                    </div>
                                    <Link to={`/order/${order._id}`} className="btn-outline order-history-card-btn">
                                        View Details
                                    </Link>
                                </div>
                            </div>

                            {/* Preview Items (First 4) */}
                            <div className="order-history-images">
                                {order.orderItems && order.orderItems.slice(0, 4).map((item, idx) => (
                                    <div key={idx} className="order-history-image-item">
                                        <img src={item.image} alt={item.name} className="order-history-image" title={item.name} />
                                    </div>
                                ))}
                                {order.orderItems && order.orderItems.length > 4 && (
                                    <div className="order-history-image-more">
                                        +{order.orderItems.length - 4}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
