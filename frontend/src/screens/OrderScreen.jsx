import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import OrderTracking from '../components/OrderTracking';
import {
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useDeliverOrderMutation,
    useUpdateOrderStatusMutation
} from '../slices/ordersApiSlice'; // Need to add useUpdateOrderStatusMutation to slices

const OrderScreen = () => {
    const { id: orderId } = useParams();

    const {
        data: order,
        refetch,
        isLoading,
        error,
    } = useGetOrderDetailsQuery(orderId);

    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
    const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
    const [updateStatus, { isLoading: loadingStatus }] = useUpdateOrderStatusMutation(); // Hypothetical hook

    const { userInfo } = useSelector((state) => state.auth);

    const paymentHandler = async () => {
        try {
            await payOrder({ orderId, details: { id: 'SIM_PAY_ID', status: 'COMPLETED', email_address: userInfo.email, update_time: String(Date.now()) } });
            refetch();
            toast.success('Payment Successful (Simulated)');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    const deliverOrderHandler = async () => {
        try {
            await deliverOrder(orderId);
            refetch();
            toast.success('Order Delivered');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const statusHandler = async (status, extraData = {}) => {
        try {
            await updateStatus({ orderId, status, ...extraData }).unwrap();
            refetch();
            toast.success(`Order Updated to ${status}`);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return isLoading ? (
        <Loader />
    ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
    ) : (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-8">Order <span className="text-accent">#{order._id}</span></h1>

            <OrderTracking
                status={order.status}
                trackingId={order.trackingId}
                estimatedDelivery={order.estimatedDeliveryDate}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="card p-6">
                        <h2 className="text-xl font-bold font-display text-accent mb-4">Shipping</h2>
                        <p className="text-gray-300 mb-2"><strong>Name: </strong> {order.user.name}</p>
                        <p className="text-gray-300 mb-2"><strong>Email: </strong> <a href={`mailto:${order.user.email}`} className="hover:text-accent">{order.user.email}</a></p>
                        <p className="text-gray-300 mb-4">
                            <strong>Address: </strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                        {order.isDelivered ? (
                            <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                        ) : (
                            <Message variant='danger'>Not Delivered</Message>
                        )}

                        {/* Origin Details */}
                        {order.originDetails && order.originDetails.originCity && (
                            <div className="mt-4 border-t border-gray-700 pt-4">
                                <p className="text-gray-400 text-sm">Dispatched From:</p>
                                <p className="text-white">
                                    {order.originDetails.originWarehouse} - {order.originDetails.originCity}, {order.originDetails.originCountry}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="card p-6">
                        <h2 className="text-xl font-bold font-display text-accent mb-4">Payment Method</h2>
                        <p className="text-gray-300 mb-4"><strong>Method: </strong> {order.paymentMethod}</p>
                        {order.isPaid ? (
                            <Message variant='success'>Paid on {order.paidAt}</Message>
                        ) : order.paymentMethod === 'COD' ? (
                            <Message variant='warning'>Pending Payment (Pay on Delivery)</Message>
                        ) : (
                            <Message variant='danger'>Not Paid</Message>
                        )}
                    </div>

                    <div className="card p-6">
                        <h2 className="text-xl font-bold font-display text-accent mb-4">Order Items</h2>
                        {order.orderItems.length === 0 ? (
                            <Message>Order is empty</Message>
                        ) : (
                            <div className="space-y-4">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-4 border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                                        <Link to={`/product/${item.product}`} className="hover:text-accent font-semibold flex-grow text-white">
                                            {item.name}
                                        </Link>
                                        <div className="text-gray-300">
                                            {item.qty} x ${item.price} = <span className="text-white font-bold">${(item.qty * item.price).toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-span-1">
                    <div className="card p-6 sticky top-24">
                        <h2 className="text-2xl font-bold font-display text-accent mb-6 border-b border-gray-700 pb-4">Order Summary</h2>
                        <div className="space-y-3 text-gray-300">
                            <div className="flex justify-between">
                                <span>Items</span>
                                <span>${order.itemsPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>${order.shippingPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>${order.taxPrice}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-700 pt-3 font-bold text-xl text-white">
                                <span>Total</span>
                                <span>${order.totalPrice}</span>
                            </div>
                        </div>

                        {!order.isPaid && (
                            <div className="mt-6">
                                {loadingPay && <Loader />}
                                <button
                                    onClick={paymentHandler}
                                    className="bg-blue-600 w-full text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                                >
                                    Pay Order (Simulate)
                                </button>
                            </div>
                        )}

                        {loadingDeliver && <Loader />}

                        {/* Admin Controls */}
                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <div className="space-y-2 mt-6 border-t border-gray-700 pt-4">
                                <h3 className="font-bold text-white mb-2">Admin Actions</h3>

                                {order.status === 'Order Placed' && (
                                    <button onClick={() => statusHandler('confirm')} className='btn-primary w-full'>Confirm Order</button>
                                )}
                                {order.status === 'Order Confirmed' && (
                                    <button onClick={() => statusHandler('pack')} className='btn-primary w-full'>Pack Order</button>
                                )}
                                {order.status === 'Packed' && (
                                    <button onClick={() => {
                                        const tracking = prompt('Enter Tracking ID');
                                        if (tracking) statusHandler('ship', { deliveryPartner: 'Amazon Logistics', trackingId: tracking, estimatedDeliveryDate: new Date(Date.now() + 86400000 * 3) })
                                    }} className='btn-primary w-full'>Ship Order</button>
                                )}
                                {order.status === 'Shipped' && (
                                    <button onClick={() => statusHandler('out')} className='btn-primary w-full'>Out for Delivery</button>
                                )}
                                {order.status === 'Out for Delivery' && (
                                    <button onClick={deliverOrderHandler} className='btn-primary w-full'>Mark Delivered</button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderScreen;
