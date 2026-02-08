import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaArrowLeft } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetCouponsQuery, useDeleteCouponMutation, useCreateCouponMutation } from '../../slices/couponsApiSlice';
import { toast } from 'react-toastify';

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
        <div className="container mx-auto px-4 py-8">
            <Link className='btn-outline px-4 py-2 inline-flex items-center text-sm mb-8' to='/'>
                <FaArrowLeft className="mr-2" /> Go Back
            </Link>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-display font-bold text-text-main">Coupons</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Coupon Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-border-color p-6 sticky top-24">
                        <h2 className="text-xl font-bold text-text-main mb-6">Create Coupon</h2>
                        <form onSubmit={submitHandler} className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-bold text-text-main">Code</label>
                                <input
                                    type='text'
                                    placeholder='Enter coupon code'
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="input-field font-mono uppercase"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-bold text-text-main">Discount Percentage (%)</label>
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
                                <label className="block mb-1 text-sm font-bold text-text-main">Expiry Date</label>
                                <input
                                    type='date'
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <button type='submit' className='btn-primary w-full flex items-center justify-center' disabled={loadingCreate}>
                                <FaPlus className="mr-2" /> Create Coupon
                            </button>
                        </form>
                    </div>
                </div>

                {/* Coupons List */}
                <div className="lg:col-span-2">
                    {isLoading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant='danger'>{error?.data?.message || error.error}</Message>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-border-color overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-border-color text-text-muted uppercase text-xs font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Code</th>
                                        <th className="px-6 py-4">Discount</th>
                                        <th className="px-6 py-4">Expiry</th>
                                        <th className="px-6 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {coupons.map((coupon) => (
                                        <tr key={coupon._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-text-muted">{coupon._id.substring(0, 10)}...</td>
                                            <td className="px-6 py-4 font-bold text-accent font-mono uppercase tracking-wider">{coupon.code}</td>
                                            <td className="px-6 py-4 font-medium">{coupon.discount}%</td>
                                            <td className="px-6 py-4 text-text-muted">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => deleteHandler(coupon._id)}
                                                    className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
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
                            {coupons.length === 0 && <div className="p-8 text-center text-text-muted">No coupons found</div>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CouponListScreen;
