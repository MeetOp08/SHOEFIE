import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';

const OrderListScreen = () => {
    const { data: orders, isLoading, error } = useGetOrdersQuery();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-display font-bold text-text-main mb-8">Orders</h1>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-border-color overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-border-color text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                                    <th className="py-4 px-6">ID</th>
                                    <th className="py-4 px-6">USER</th>
                                    <th className="py-4 px-6">DATE</th>
                                    <th className="py-4 px-6">TOTAL</th>
                                    <th className="py-4 px-6">PAID</th>
                                    <th className="py-4 px-6">DELIVERED</th>
                                    <th className="py-4 px-6">ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-color">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6 text-sm text-text-muted font-mono">{order._id}</td>
                                        <td className="py-4 px-6 font-medium text-text-main">{order.user && order.user.name}</td>
                                        <td className="py-4 px-6 text-sm text-text-muted">{order.createdAt.substring(0, 10)}</td>
                                        <td className="py-4 px-6 text-text-main font-bold">${order.totalPrice}</td>
                                        <td className="py-4 px-6">
                                            {order.isPaid ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {order.paidAt.substring(0, 10)}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Not Paid
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            {order.isDelivered ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {order.deliveredAt.substring(0, 10)}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <Link to={`/order/${order._id}`} className="text-accent hover:text-orange-700 text-sm font-semibold hover:underline">
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderListScreen;
