import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaCheckCircle, FaBoxOpen, FaArrowRight } from 'react-icons/fa';
import { clearCartItems } from '../slices/cartSlice';
import '../styles/OrderSuccess.css';

const OrderSuccess = () => {
    const { id: orderId } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearCartItems());
    }, [dispatch]);

    return (
        <div className="container-custom order-success-container">
            <div className="order-success-icon-wrap">
                <FaCheckCircle className="order-success-icon" />
            </div>

            <h1 className="order-success-title">Payment Successful!</h1>
            <p className="order-success-desc">
                Thank you for your purchase. Your order has been placed successfully and is being processed.
            </p>

            <div className="order-success-card">
                <div className="order-success-row">
                    <span className="order-success-label">Order ID</span>
                    <span className="order-success-id">{orderId}</span>
                </div>
                <div className="order-success-row">
                    <span className="order-success-status-label">Status</span>
                    <span className="order-success-status-badge">Paid</span>
                </div>
            </div>

            <div className="order-success-actions">
                <Link to={`/order/${orderId}`} className="btn-outline order-success-btn-view">
                    <FaBoxOpen className="order-success-btn-icon-l" /> View Order
                </Link>
                <Link to="/" className="btn-primary order-success-btn-shop">
                    Continue Shopping <FaArrowRight className="order-success-btn-icon-r" />
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccess;
