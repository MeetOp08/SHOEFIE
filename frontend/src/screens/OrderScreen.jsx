import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetPayPalClientIdQuery,
    useDeliverOrderMutation,
} from '../slices/ordersApiSlice';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

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
    const { userInfo } = useSelector((state) => state.auth);

    // PayPal placeholder logic (simplified for this task)
    // Real implementation would use PayPal script to load buttons
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

    return isLoading ? (
        <Loader />
    ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
    ) : (
        <>
            <h1 className="text-2xl font-bold mb-4">Order {order._id}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="border-b pb-4">
                        <h2 className="text-xl font-bold mb-2">Shipping</h2>
                        <p><strong>Name: </strong> {order.user.name}</p>
                        <p><strong>Email: </strong> {order.user.email}</p>
                        <p>
                            <strong>Address: </strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                        {order.isDelivered ? (
                            <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                        ) : (
                            <Message variant='danger'>Not Delivered</Message>
                        )}
                    </div>

                    <div className="border-b pb-4">
                        <h2 className="text-xl font-bold mb-2">Payment Method</h2>
                        <p><strong>Method: </strong> {order.paymentMethod}</p>
                        {order.isPaid ? (
                            <Message variant='success'>Paid on {order.paidAt}</Message>
                        ) : (
                            <Message variant='danger'>Not Paid</Message>
                        )}
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-2">Order Items</h2>
                        {order.orderItems.length === 0 ? (
                            <Message>Order is empty</Message>
                        ) : (
                            <div className="space-y-4">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-4">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                        <Link to={`/product/${item.product}`} className="hover:underline font-semibold">
                                            {item.name}
                                        </Link>
                                        <div>
                                            {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="border p-4 rounded-lg shadow-sm h-fit">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="flex justify-between mb-2">
                        <span>Items</span>
                        <span>${order.itemsPrice}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Shipping</span>
                        <span>${order.shippingPrice}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Tax</span>
                        <span>${order.taxPrice}</span>
                    </div>
                    <div className="flex justify-between mb-4 border-t pt-2 font-bold text-lg">
                        <span>Total</span>
                        <span>${order.totalPrice}</span>
                    </div>

                    {!order.isPaid && (
                        <div className="mb-4">
                            {loadingPay && <Loader />}
                            {/* Placeholder Payment Button */}
                            <button
                                onClick={paymentHandler}
                                className="w-full bg-blue-600 text-white dev-button py-2 rounded mb-2 hover:bg-blue-700"
                            >
                                Pay Order (Simulate)
                            </button>
                        </div>
                    )}

                    {loadingDeliver && <Loader />}
                    {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                        <button
                            type='button'
                            className='w-full bg-black text-white py-2 rounded hover:bg-gray-800'
                            onClick={deliverOrderHandler}
                        >
                            Mark As Delivered
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default OrderScreen;
