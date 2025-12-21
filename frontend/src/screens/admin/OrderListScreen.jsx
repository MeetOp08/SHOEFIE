import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';

const OrderListScreen = () => {
    const { data: orders, isLoading, error } = useGetOrdersQuery();

    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Orders</h1>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="py-2 px-4 border">ID</th>
                                <th className="py-2 px-4 border">USER</th>
                                <th className="py-2 px-4 border">DATE</th>
                                <th className="py-2 px-4 border">TOTAL</th>
                                <th className="py-2 px-4 border">PAID</th>
                                <th className="py-2 px-4 border">DELIVERED</th>
                                <th className="py-2 px-4 border"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="border-b hover:bg-gray-50">
                                    <td className="py-2 px-4">{order._id}</td>
                                    <td className="py-2 px-4">{order.user && order.user.name}</td>
                                    <td className="py-2 px-4">{order.createdAt.substring(0, 10)}</td>
                                    <td className="py-2 px-4">${order.totalPrice}</td>
                                    <td className="py-2 px-4">
                                        {order.isPaid ? (
                                            <span className="text-green-500">{order.paidAt.substring(0, 10)}</span>
                                        ) : (
                                            <FaTimes className="text-red-500" />
                                        )}
                                    </td>
                                    <td className="py-2 px-4">
                                        {order.isDelivered ? (
                                            <span className="text-green-500">{order.deliveredAt.substring(0, 10)}</span>
                                        ) : (
                                            <FaTimes className="text-red-500" />
                                        )}
                                    </td>
                                    <td className="py-2 px-4">
                                        <Link to={`/order/${order._id}`} className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 text-sm">
                                            Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default OrderListScreen;
