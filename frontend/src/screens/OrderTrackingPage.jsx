import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetOrderDetailsQuery } from '../slices/ordersApiSlice';
import OrderTracking from '../components/OrderTracking';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FaArrowLeft } from 'react-icons/fa';
import '../styles/OrderTrackingPage.css';

const OrderTrackingPage = () => {
    const { id: orderId } = useParams();
    const [inputId, setInputId] = useState(orderId || '');
    const [queryId, setQueryId] = useState(orderId || null);

    const { data: order, isLoading, error } = useGetOrderDetailsQuery(queryId, {
        skip: !queryId,
    });

    const submitHandler = (e) => {
        e.preventDefault();
        setQueryId(inputId);
    };

    return (
        <div className="container-custom order-track-container">
            <Link to='/profile' className='order-track-back'>
                <FaArrowLeft className="order-track-back-icon" /> Back to Profile
            </Link>

            <h1 className="order-track-title">Track Your Order</h1>

            {/* Search Box */}
            <div className="order-track-search-wrap">
                <form onSubmit={submitHandler} className="order-track-form">
                    <input
                        type="text"
                        placeholder="Enter Order ID"
                        value={inputId}
                        onChange={(e) => setInputId(e.target.value)}
                        className="input-field order-track-input"
                    />
                    <button type="submit" className="btn-primary order-track-btn">
                        Track Order
                    </button>
                </form>
            </div>

            {queryId && (
                <>
                    {isLoading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant='danger'>{error?.data?.message || error.error || 'Order not found'}</Message>
                    ) : (
                        <div className="order-track-fade-in">
                            <OrderTracking
                                status={order.status}
                                trackingId={order.trackingId}
                                paymentMethod={order.paymentMethod}
                                estimatedDelivery={order.estimatedDeliveryDate}
                            />

                            <div className="order-track-details-card">
                                <h3 className="order-track-details-title">Shipment Details</h3>
                                <div className="order-track-details-grid">
                                    <div>
                                        <p className="order-track-detail-label">Delivery Partner</p>
                                        <p className="order-track-detail-value">{order.deliveryPartner || 'Pending Assignment'}</p>
                                    </div>
                                    <div>
                                        <p className="order-track-detail-label">Shipping Address</p>
                                        <p className="order-track-detail-value">
                                            {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default OrderTrackingPage;
