import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetOrderDetailsQuery } from '../slices/ordersApiSlice';
import OrderTracking from '../components/OrderTracking';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FaArrowLeft } from 'react-icons/fa';

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
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Link to='/profile' className='flex items-center text-text-muted hover:text-accent mb-6 transition-colors'>
                <FaArrowLeft className="mr-2" /> Back to Profile
            </Link>

            <h1 className="text-3xl font-display font-bold text-text-main mb-8 text-center">Track Your Order</h1>

            {/* Search Box */}
            <div className="max-w-xl mx-auto mb-12">
                <form onSubmit={submitHandler} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter Order ID"
                        value={inputId}
                        onChange={(e) => setInputId(e.target.value)}
                        className="input-field"
                    />
                    <button type="submit" className="btn-primary px-6 whitespace-nowrap">
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
                        <div className="animate-fade-in">
                            <OrderTracking
                                status={order.status}
                                trackingId={order.trackingId}
                                paymentMethod={order.paymentMethod}
                                estimatedDelivery={order.estimatedDeliveryDate}
                            />

                            <div className="bg-white p-6 rounded-xl border border-border-color shadow-sm mt-6">
                                <h3 className="font-bold text-lg mb-4">Shipment Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-text-muted">Delivery Partner</p>
                                        <p className="font-semibold text-text-main">{order.deliveryPartner || 'Pending Assignment'}</p>
                                    </div>
                                    <div>
                                        <p className="text-text-muted">Shipping Address</p>
                                        <p className="font-semibold text-text-main">
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
