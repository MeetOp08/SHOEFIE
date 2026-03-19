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
import '../styles/OrderScreen.css';

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
        <div className="container-custom order-container">
            <h1 className="order-title">Order <span className="order-title-accent">#{order._id}</span></h1>

            <OrderTracking
                status={order.status}
                trackingId={order.trackingId}
                estimatedDelivery={order.estimatedDeliveryDate}
            />

            <div className="order-layout">
                <div className="order-details-col">
                    {/* Shipping Info */}
                    <div className="order-card">
                        <h2 className="order-card-title">Shipping Information</h2>
                        <div className="order-card-text">
                            <p><strong className="order-card-label">Name: </strong> {order.user.name}</p>
                            <p><strong className="order-card-label">Email: </strong> <a href={`mailto:${order.user.email}`} className="order-email-link">{order.user.email}</a></p>
                            <p>
                                <strong className="order-card-label">Address: </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                        </div>
                        <div className="order-status-msg">
                            {order.isDelivered ? (
                                <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                            ) : (
                                <Message variant='danger'>Not Delivered</Message>
                            )}
                        </div>

                        {/* Origin Details */}
                        {order.originDetails && order.originDetails.originCity && (
                            <div className="order-origin-details">
                                <p className="order-origin-label">Dispatched From:</p>
                                <p className="order-origin-value">
                                    {order.originDetails.originWarehouse} - {order.originDetails.originCity}, {order.originDetails.originCountry}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Payment Info */}
                    <div className="order-card">
                        <h2 className="order-card-title">Payment Method</h2>
                        <p className="order-card-text" style={{ marginBottom: '1rem' }}>
                            <strong className="order-card-label">Method: </strong> {order.paymentMethod}
                        </p>
                        {order.isPaid ? (
                            <Message variant='success'>Paid on {order.paidAt}</Message>
                        ) : order.paymentMethod === 'COD' ? (
                            <Message variant='warning'>Pending Payment (Pay on Delivery)</Message>
                        ) : (
                            <Message variant='danger'>Not Paid</Message>
                        )}
                    </div>

                    {/* Order Items */}
                    <div className="order-card">
                        <h2 className="order-card-title">Order Items</h2>
                        {order.orderItems.length === 0 ? (
                            <Message>Order is empty</Message>
                        ) : (
                            <div className="order-items-list">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="order-item-row">
                                        <div className="order-item-img-wrap">
                                            <img src={item.image} alt={item.name} className="order-item-img" />
                                        </div>
                                        <Link to={`/product/${item.product}`} className="order-item-name">
                                            {item.name}
                                        </Link>
                                        <div className="order-item-price-calc">
                                            {item.qty} x <span className="order-item-price-unit">₹{item.price.toLocaleString()}</span> = <span className="order-item-price-total">₹{(item.qty * item.price).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="order-summary-col">
                    <div className="order-summary-card">
                        <h2 className="order-summary-title">Order Summary</h2>
                        <div className="order-summary-details">
                            <div className="order-summary-row">
                                <span>Items</span>
                                <span>₹{Number(order.itemsPrice).toLocaleString()}</span>
                            </div>
                            <div className="order-summary-row">
                                <span>Shipping</span>
                                <span>₹{Number(order.shippingPrice).toLocaleString()}</span>
                            </div>
                            <div className="order-summary-row">
                                <span>Tax</span>
                                <span>₹{Number(order.taxPrice).toLocaleString()}</span>
                            </div>
                            <div className="order-summary-total">
                                <span>Total</span>
                                <span>₹{Number(order.totalPrice).toLocaleString()}</span>
                            </div>
                        </div>

                        {!order.isPaid && (
                            <div className="order-pay-btn-wrap">
                                {loadingPay && <Loader />}
                                <button
                                    onClick={paymentHandler}
                                    className="btn-primary order-pay-btn"
                                >
                                    Pay Order (Simulate)
                                </button>
                            </div>
                        )}

                        {loadingDeliver && <Loader />}

                        {/* Admin Controls */}
                        {userInfo && userInfo.isAdmin && !order.isDelivered && (order.isPaid || order.paymentMethod === 'COD') && (
                            <div className="order-admin-actions">
                                <h3 className="order-admin-title">Admin Actions</h3>

                                {order.status === 'Order Placed' && (
                                    <button onClick={() => statusHandler('confirm')} className='order-admin-btn'>Confirm Order</button>
                                )}
                                {order.status === 'Order Confirmed' && (
                                    <button onClick={() => statusHandler('pack')} className='order-admin-btn'>Pack Order</button>
                                )}
                                {order.status === 'Packed' && (
                                    <button onClick={() => {
                                        const tracking = prompt('Enter Tracking ID');
                                        if (tracking) statusHandler('ship', { deliveryPartner: 'Logistics Partner', trackingId: tracking, estimatedDeliveryDate: new Date(Date.now() + 86400000 * 3) })
                                    }} className='order-admin-btn'>Ship Order</button>
                                )}
                                {order.status === 'Shipped' && (
                                    <button onClick={() => statusHandler('out')} className='order-admin-btn'>Out for Delivery</button>
                                )}
                                {order.status === 'Out for Delivery' && (
                                    <button onClick={deliverOrderHandler} className='order-admin-btn-primary'>Mark Delivered</button>
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
