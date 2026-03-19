import { Link } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '../../slices/ordersApiSlice';
import { toast } from 'react-toastify';
import '../../styles/admin/OrderListScreen.css';

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
        <div className="container-custom admin-order-container">
            <h1 className="admin-order-title">Orders</h1>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <div className="admin-order-card">
                    <div className="admin-order-table-wrapper">
                        <table className="admin-order-table">
                            <thead className="admin-order-thead">
                                <tr>
                                    <th className="admin-order-th">ID</th>
                                    <th className="admin-order-th">USER</th>
                                    <th className="admin-order-th">DATE</th>
                                    <th className="admin-order-th">TOTAL</th>
                                    <th className="admin-order-th">PAID</th>
                                    <th className="admin-order-th">STATUS</th>
                                    <th className="admin-order-th">ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id} className="admin-order-tr">
                                        <td className="admin-order-td admin-order-td-id">{order._id.substring(0, 10)}...</td>
                                        <td className="admin-order-td admin-order-td-user">{order.user && order.user.name}</td>
                                        <td className="admin-order-td admin-order-td-date">{order.createdAt.substring(0, 10)}</td>
                                        <td className="admin-order-td admin-order-td-total">${order.totalPrice}</td>
                                        <td className="admin-order-td">
                                            {order.isPaid ? (
                                                <span className="admin-order-badge paid">
                                                    {order.paidAt.substring(0, 10)}
                                                </span>
                                            ) : (
                                                <span className="admin-order-badge pending">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="admin-order-td">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className={`admin-order-select ${order.status === 'Delivered' ? 'delivered' :
                                                    order.status === 'Cancelled' ? 'cancelled' :
                                                        'default'
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
                                        <td className="admin-order-td">
                                            <Link to={`/order/${order._id}`} className="admin-order-link">
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
