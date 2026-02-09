import { Link } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '../../slices/ordersApiSlice';
import { toast } from 'react-toastify';

const OrderListScreen = () => {
    const { data: orders, isLoading, error, refetch } = useGetOrdersQuery(); // Add refetch
    const [updateOrderStatus] = useUpdateOrderStatusMutation();

    const handleStatusChange = async (orderId, newStatus) => {
        let statusEndpoint = '';
        switch (newStatus) {
            case 'Order Confirmed': statusEndpoint = 'confirm'; break;
            case 'Packed': statusEndpoint = 'pack'; break;
            case 'Shipped': statusEndpoint = 'ship'; break;
            case 'Out for Delivery': statusEndpoint = 'out'; break;
            case 'Delivered': statusEndpoint = 'deliver'; break;
            default: return; // Handle other cases or return if no match
        }

        try {
            await updateOrderStatus({ orderId, status: statusEndpoint }).unwrap();
            toast.success(`Order status updated to ${newStatus}`);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

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
                                    <th className="py-4 px-6">STATUS</th>
                                    <th className="py-4 px-6">ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-color">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6 text-sm text-text-muted font-mono">{order._id.substring(0, 10)}...</td>
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
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className={`text-xs font-semibold px-2 py-1 rounded border-0 cursor-pointer focus:ring-0 ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-blue-100 text-blue-800'
                                                    }`}
                                            >
                                                <option value="Order Placed">Placed</option>
                                                <option value="Order Confirmed">Confirmed</option>
                                                <option value="Packed">Packed</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Out for Delivery">Out for Delivery</option>
                                                <option value="Delivered">Delivered</option>
                                            </select>
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
