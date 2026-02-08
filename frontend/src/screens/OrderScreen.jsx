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
} from '../slices/ordersApiSlice';

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
    const [updateStatus, { isLoading: loadingStatus }] = useUpdateOrderStatusMutation();

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
            <h1 className="text-2xl md:text-3xl font-display font-bold text-text-main mb-8">Order <span className="text-accent">#{order._id}</span></h1>

            <OrderTracking
                status={order.status}
                trackingId={order.trackingId}
                estimatedDelivery={order.estimatedDeliveryDate}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Shipping Info */}
                    <div className="card p-6 bg-white border border-border-color shadow-sm">
                        <h2 className="text-xl font-bold font-display text-text-main mb-4 border-b border-border-color pb-2">Shipping Information</h2>
                        <div className="space-y-2 text-text-muted">
                            <p><strong className="text-text-main">Name: </strong> {order.user.name}</p>
                            <p><strong className="text-text-main">Email: </strong> <a href={`mailto:${order.user.email}`} className="hover:text-accent transition-colors">{order.user.email}</a></p>
                            <p>
                                <strong className="text-text-main">Address: </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                        </div>
                        <div className="mt-4">
                            {order.isDelivered ? (
                                <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                            ) : (
                                <Message variant='danger'>Not Delivered</Message>
                            )}
                        </div>

                        {/* Origin Details */}
                        {order.originDetails && order.originDetails.originCity && (
                            <div className="mt-6 border-t border-border-color pt-4">
                                <p className="text-text-muted text-sm font-semibold">Dispatched From:</p>
                                <p className="text-text-main">
                                    {order.originDetails.originWarehouse} - {order.originDetails.originCity}, {order.originDetails.originCountry}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Payment Info */}
                    <div className="card p-6 bg-white border border-border-color shadow-sm">
                        <h2 className="text-xl font-bold font-display text-text-main mb-4 border-b border-border-color pb-2">Payment Method</h2>
                        <p className="text-text-muted mb-4"><strong className="text-text-main">Method: </strong> {order.paymentMethod}</p>
                        {order.isPaid ? (
                            <Message variant='success'>Paid on {order.paidAt}</Message>
                        ) : order.paymentMethod === 'COD' ? (
                            <Message variant='warning'>Pending Payment (Pay on Delivery)</Message>
                        ) : (
                            <Message variant='danger'>Not Paid</Message>
                        )}
                    </div>

                    {/* Order Items */}
                    <div className="card p-6 bg-white border border-border-color shadow-sm">
                        <h2 className="text-xl font-bold font-display text-text-main mb-4 border-b border-border-color pb-2">Order Items</h2>
                        {order.orderItems.length === 0 ? (
                            <Message>Order is empty</Message>
                        ) : (
                            <div className="space-y-4">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-4 border-b border-border-color pb-4 last:border-0 last:pb-0">
                                        <div className="w-16 h-16 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <Link to={`/product/${item.product}`} className="hover:text-accent font-semibold flex-grow text-text-main">
                                            {item.name}
                                        </Link>
                                        <div className="text-text-muted">
                                            {item.qty} x <span className="font-medium">₹{item.price.toLocaleString()}</span> = <span className="text-text-main font-bold">₹{(item.qty * item.price).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="col-span-1">
                    <div className="card p-6 sticky top-24 bg-white border border-border-color shadow-lg">
                        <h2 className="text-2xl font-bold font-display text-text-main mb-6 border-b border-border-color pb-4">Order Summary</h2>
                        <div className="space-y-3 text-text-muted text-sm">
                            <div className="flex justify-between">
                                <span>Items</span>
                                <span>₹{Number(order.itemsPrice).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>₹{Number(order.shippingPrice).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>₹{Number(order.taxPrice).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-t border-border-color pt-3 font-bold text-xl text-text-main">
                                <span>Total</span>
                                <span>₹{Number(order.totalPrice).toLocaleString()}</span>
                            </div>
                        </div>

                        {!order.isPaid && (
                            <div className="mt-6">
                                {loadingPay && <Loader />}
                                <button
                                    onClick={paymentHandler}
                                    className="btn-primary w-full shadow-lg"
                                >
                                    Pay Order (Simulate)
                                </button>
                            </div>
                        )}

                        {loadingDeliver && <Loader />}

                        {/* Admin Controls */}
                        {userInfo && userInfo.isAdmin && !order.isDelivered && (order.isPaid || order.paymentMethod === 'COD') && (
                            <div className="space-y-3 mt-6 border-t border-border-color pt-4">
                                <h3 className="font-bold text-text-main mb-2">Admin Actions</h3>

                                {order.status === 'Order Placed' && (
                                    <button onClick={() => statusHandler('confirm')} className='btn-outline w-full hover:bg-accent hover:text-white hover:border-accent'>Confirm Order</button>
                                )}
                                {order.status === 'Order Confirmed' && (
                                    <button onClick={() => statusHandler('pack')} className='btn-outline w-full hover:bg-accent hover:text-white hover:border-accent'>Pack Order</button>
                                )}
                                {order.status === 'Packed' && (
                                    <button onClick={() => {
                                        const tracking = prompt('Enter Tracking ID');
                                        if (tracking) statusHandler('ship', { deliveryPartner: 'Logistics Partner', trackingId: tracking, estimatedDeliveryDate: new Date(Date.now() + 86400000 * 3) })
                                    }} className='btn-outline w-full hover:bg-accent hover:text-white hover:border-accent'>Ship Order</button>
                                )}
                                {order.status === 'Shipped' && (
                                    <button onClick={() => statusHandler('out')} className='btn-outline w-full hover:bg-accent hover:text-white hover:border-accent'>Out for Delivery</button>
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
