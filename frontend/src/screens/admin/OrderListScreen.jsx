import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';

const OrderListScreen = () => {
    const { data: orders, isLoading, error } = useGetOrdersQuery();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-display font-bold text-white mb-8">Orders</h1>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-700">
                    <table className="min-w-full bg-gray-800 text-gray-300">
                        <thead>
                            <tr className="bg-primary text-left text-accent uppercase text-sm tracking-wider">
                                <th className="py-3 px-6">ID</th>
                                <th className="py-3 px-6">USER</th>
                                <th className="py-3 px-6">DATE</th>
                                <th className="py-3 px-6">TOTAL</th>
                                <th className="py-3 px-6">PAID</th>
                                <th className="py-3 px-6">DELIVERED</th>
                                <th className="py-3 px-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-700 transition-colors">
                                    <td className="py-4 px-6">{order._id}</td>
                                    <td className="py-4 px-6 font-semibold text-white">{order.user && order.user.name}</td>
                                    <td className="py-4 px-6">{order.createdAt.substring(0, 10)}</td>
                                    <td className="py-4 px-6 text-white font-bold">${order.totalPrice}</td>
                                    <td className="py-4 px-6">
                                        {order.isPaid ? (
                                            <span className="text-green-500 font-semibold">{order.paidAt.substring(0, 10)}</span>
                                        ) : (
                                            <FaTimes className="text-red-500" />
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        {order.isDelivered ? (
                                            <span className="text-green-500 font-semibold">{order.deliveredAt.substring(0, 10)}</span>
                                        ) : (
                                            <FaTimes className="text-red-500" />
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        <Link to={`/order/${order._id}`} className="text-accent hover:underline text-sm font-semibold">
                                            Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderListScreen;
