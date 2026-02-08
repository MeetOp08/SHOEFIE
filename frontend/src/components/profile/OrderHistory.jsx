import { Link } from 'react-router-dom';
import { useGetMyOrdersQuery } from '../../slices/ordersApiSlice';
import Loader from '../Loader';
import Message from '../Message';
import { FaBox, FaCheckCircle, FaTimesCircle, FaTruck } from 'react-icons/fa';

const OrderHistory = () => {
    const { data: orders, isLoading, error } = useGetMyOrdersQuery();

    if (isLoading) return <Loader />;
    if (error) return <Message variant="danger">{error?.data?.message || error.error}</Message>;

    const getStatusBadge = (order) => {
        if (order.isDelivered) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"><FaCheckCircle className="mr-1" /> Delivered</span>;
        if (order.isPaid) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"><FaTruck className="mr-1" /> Processing</span>;
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200"><FaBox className="mr-1" /> Placed</span>;
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-display text-text-main">Order History</h2>

            {orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-border-color shadow-sm">
                    <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl text-text-main font-bold mb-2">No Orders Yet</h3>
                    <p className="text-text-muted mb-6">Looks like you haven't bought anything yet.</p>
                    <Link to="/" className="btn-primary inline-flex">Start Shopping</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="card p-6 bg-white border border-border-color hover:shadow-md transition-all group">
                            <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                                <div className="space-y-1">
                                    <div className="flex items-center space-x-3">
                                        <h3 className="text-lg font-bold text-text-main">Order <span className="font-mono text-text-muted text-base">#{order._id.substring(0, 10)}...</span></h3>
                                        {getStatusBadge(order)}
                                    </div>
                                    <p className="text-sm text-text-muted">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm text-text-muted">Total Amount</p>
                                        <p className="text-xl font-bold text-text-main">₹{Number(order.totalPrice).toLocaleString()}</p>
                                    </div>
                                    <Link to={`/order/${order._id}`} className="btn-outline text-sm py-2 px-4 hover:bg-accent hover:border-accent hover:text-white">
                                        View Details
                                    </Link>
                                </div>
                            </div>

                            {/* Preview Items (First 4) */}
                            <div className="mt-6 pt-4 border-t border-gray-100 flex space-x-4 overflow-x-auto pb-2 scrollbar-thin">
                                {order.orderItems && order.orderItems.slice(0, 4).map((item, idx) => (
                                    <div key={idx} className="w-16 h-16 rounded-md border border-border-color overflow-hidden flex-shrink-0 bg-secondary">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" title={item.name} />
                                    </div>
                                ))}
                                {order.orderItems && order.orderItems.length > 4 && (
                                    <div className="w-16 h-16 flex items-center justify-center bg-gray-50 rounded-md border border-border-color text-text-muted font-bold flex-shrink-0">
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
