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
        if (order.isDelivered) return <span className="badge bg-green-500/10 text-green-500 border-green-500/20"><FaCheckCircle className="mr-1" /> Delivered</span>;
        if (order.isPaid) return <span className="badge bg-blue-500/10 text-blue-500 border-blue-500/20"><FaTruck className="mr-1" /> Processing</span>;
        return <span className="badge bg-yellow-500/10 text-yellow-500 border-yellow-500/20"><FaBox className="mr-1" /> Placed</span>;
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-display text-white">Order History</h2>

            {orders.length === 0 ? (
                <div className="text-center py-16 bg-gray-900 rounded-xl border border-gray-700">
                    <FaBox className="text-6xl text-gray-700 mx-auto mb-4" />
                    <h3 className="text-xl text-white font-bold mb-2">No Orders Yet</h3>
                    <p className="text-gray-400 mb-6">Looks like you haven't bought anything yet.</p>
                    <Link to="/" className="btn-primary">Start Shopping</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="card p-6 bg-gray-900 border border-gray-700 hover:border-gray-500 transition-all group">
                            <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                                <div className="space-y-1">
                                    <div className="flex items-center space-x-3">
                                        <h3 className="text-lg font-bold text-white">Order <span className="font-mono text-gray-400">#{order._id.substring(0, 10)}...</span></h3>
                                        {getStatusBadge(order)}
                                    </div>
                                    <p className="text-sm text-gray-400">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm text-gray-400">Total Amount</p>
                                        <p className="text-xl font-bold text-accent">${order.totalPrice}</p>
                                    </div>
                                    <Link to={`/order/${order._id}`} className="btn-outline">
                                        View Details
                                    </Link>
                                </div>
                            </div>

                            {/* Preview Items (First 3) */}
                            <div className="mt-6 pt-4 border-t border-gray-800 flex space-x-4 overflow-x-auto pb-2">
                                {/* We don't have items populated in getMyOrders usually, relying on backend. 
                                    If backend populates orderItems.product calling getMyOrders, we can show images.
                                    Assuming orderItems exists but might not have images if not populated. 
                                    Checking logic: usually 'orderItems' stores name, image, price directly in Mongoose schema for Order.
                                */}
                                {order.orderItems && order.orderItems.slice(0, 4).map((item, idx) => (
                                    <img key={idx} src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md border border-gray-700" title={item.name} />
                                ))}
                                {order.orderItems && order.orderItems.length > 4 && (
                                    <div className="w-16 h-16 flex items-center justify-center bg-gray-800 rounded-md border border-gray-700 text-gray-400 font-bold">
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
