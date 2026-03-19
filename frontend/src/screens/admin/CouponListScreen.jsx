import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaArrowLeft } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetCouponsQuery, useDeleteCouponMutation, useCreateCouponMutation } from '../../slices/couponsApiSlice';
import { toast } from 'react-toastify';
import '../../styles/admin/CouponListScreen.css';

const CouponListScreen = () => {
    const { data: coupons, isLoading, error, refetch } = useGetCouponsQuery();
    const [deleteCoupon, { isLoading: loadingDelete }] = useDeleteCouponMutation();
    const [createCoupon, { isLoading: loadingCreate }] = useCreateCouponMutation();

    const [code, setCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [expiryDate, setExpiryDate] = useState('');

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            try {
                await deleteCoupon(id);
                toast.success('Coupon deleted');
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await createCoupon({
                code,
                discount: Number(discount),
                expiryDate
            }).unwrap();
            toast.success('Coupon created successfully');
            setCode('');
            setDiscount('');
            setExpiryDate('');
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="container-custom admin-coupon-container">
            <Link className="btn-outline admin-coupon-back" to='/'>
                <FaArrowLeft className="mr-2" /> Go Back
            </Link>
            <div className="admin-coupon-header">
                <h1 className="admin-coupon-title">Coupons</h1>
            </div>

            <div className="admin-coupon-layout">
                {/* Create Coupon Form */}
                <div className="admin-coupon-sidebar">
                    <div className="admin-coupon-form-card">
                        <h2 className="admin-coupon-form-title">Create Coupon</h2>
                        <form onSubmit={submitHandler} className="admin-coupon-form">
                            <div>
                                <label className="admin-coupon-label">Code</label>
                                <input
                                    type='text'
                                    placeholder='Enter coupon code'
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="input-field admin-coupon-input-code"
                                    required
                                />
                            </div>
                            <div>
                                <label className="admin-coupon-label">Discount Percentage (%)</label>
                                <input
                                    type='number'
                                    placeholder='Ex: 20'
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="admin-coupon-label">Expiry Date</label>
                                <input
                                    type='date'
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <button type='submit' className='btn-primary admin-coupon-submit' disabled={loadingCreate}>
                                <FaPlus className="mr-2" /> Create Coupon
                            </button>
                        </form>
                    </div>
                </div>

                {/* Coupons List */}
                <div className="admin-coupon-list-area">
                    {isLoading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant='danger'>{error?.data?.message || error.error}</Message>
                    ) : (
                        <div className="admin-coupon-table-card">
                            <table className="admin-coupon-table">
                                <thead className="admin-coupon-thead">
                                    <tr>
                                        <th className="admin-coupon-th">ID</th>
                                        <th className="admin-coupon-th">Code</th>
                                        <th className="admin-coupon-th">Discount</th>
                                        <th className="admin-coupon-th">Expiry</th>
                                        <th className="admin-coupon-th">Status</th>
                                        <th className="admin-coupon-th center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="admin-coupon-tbody">
                                    {coupons.map((coupon) => (
                                        <tr key={coupon._id} className="admin-coupon-tr">
                                            <td className="admin-coupon-td admin-coupon-td-id">{coupon._id.substring(0, 10)}...</td>
                                            <td className="admin-coupon-td admin-coupon-td-code">{coupon.code}</td>
                                            <td className="admin-coupon-td admin-coupon-td-discount">{coupon.discount}%</td>
                                            <td className="admin-coupon-td admin-coupon-td-expiry">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                                            <td className="admin-coupon-td">
                                                {new Date(coupon.expiryDate) < new Date() ? (
                                                    <span className="admin-coupon-badge expired">
                                                        Expired
                                                    </span>
                                                ) : (
                                                    <span className="admin-coupon-badge active">
                                                        Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="admin-coupon-td admin-coupon-td-actions">
                                                <button
                                                    onClick={() => deleteHandler(coupon._id)}
                                                    className="admin-coupon-btn-delete"
                                                    disabled={loadingDelete}
                                                    title="Delete Coupon"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {coupons.length === 0 && <div className="admin-coupon-empty">No coupons found</div>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CouponListScreen;
