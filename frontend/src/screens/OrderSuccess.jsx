import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaCheckCircle, FaBoxOpen, FaArrowRight } from 'react-icons/fa';
import { clearCartItems } from '../slices/cartSlice';

const OrderSuccess = () => {
    const { id: orderId } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearCartItems());
    }, [dispatch]);

    return (
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
            <div className="bg-green-100 p-6 rounded-full mb-8 animate-bounce-slow">
                <FaCheckCircle className="text-6xl text-green-500" />
            </div>

            <h1 className="text-4xl font-display font-bold text-text-main mb-4">Payment Successful!</h1>
            <p className="text-lg text-text-muted mb-8 max-w-md">
                Thank you for your purchase. Your order has been placed successfully and is being processed.
            </p>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-border-color w-full max-w-md mb-8">
                <div className="flex justify-between items-center border-b border-border-color pb-4 mb-4">
                    <span className="text-text-muted font-medium">Order ID</span>
                    <span className="font-mono font-bold text-text-main">{orderId}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Status</span>
                    <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full">Paid</span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link to={`/order/${orderId}`} className="btn-outline flex items-center justify-center px-8 py-3">
                    <FaBoxOpen className="mr-2" /> View Order
                </Link>
                <Link to="/" className="btn-primary flex items-center justify-center px-8 py-3">
                    Continue Shopping <FaArrowRight className="ml-2" />
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccess;
