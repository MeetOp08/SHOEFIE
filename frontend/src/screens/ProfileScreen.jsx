import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { Link } from 'react-router-dom';
import { FaTimes, FaUser, FaBoxOpen, FaCheckCircle, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);

    const [updateProfile, { isLoading: loadingUpdateProfile }] =
        useProfileMutation();

    const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetMyOrdersQuery();

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    }, [userInfo, userInfo.name, userInfo.email]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            try {
                const res = await updateProfile({
                    _id: userInfo._id,
                    name,
                    email,
                    password,
                }).unwrap();
                dispatch(setCredentials(res));
                toast.success('Profile updated successfully');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-4 gap-8"
            >
                {/* User Details Card */}
                <div className="lg:col-span-1">
                    <div className="card p-6 bg-gray-dark border border-gray-700/50 sticky top-24">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center border-2 border-accent mb-4 shadow-neon">
                                <FaUser className="text-4xl text-gray-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">{userInfo.name}</h2>
                            <p className="text-gray-400 text-sm">{userInfo.email}</p>
                            {userInfo.isAdmin && (
                                <span className="bg-accent/20 text-accent text-xs px-2 py-1 rounded-full mt-2 border border-accent/50">
                                    Admin User
                                </span>
                            )}
                        </div>

                        <form onSubmit={submitHandler} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                                <input
                                    type='text'
                                    placeholder='Update Name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-field"
                                ></input>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                <input
                                    type='email'
                                    placeholder='Update Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field"
                                ></input>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                                <input
                                    type='password'
                                    placeholder='New Password (Optional)'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field"
                                ></input>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
                                <input
                                    type='password'
                                    placeholder='Confirm New Password'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="input-field"
                                ></input>
                            </div>

                            <button
                                disabled={loadingUpdateProfile}
                                type='submit'
                                className="btn-primary w-full mt-4"
                            >
                                {loadingUpdateProfile ? 'Updating...' : 'Update Profile'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* My Orders Section */}
                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-display font-bold text-white flex items-center">
                            <FaBoxOpen className="mr-3 text-accent" /> Order History
                        </h2>
                    </div>

                    {loadingOrders ? (
                        <Loader />
                    ) : errorOrders ? (
                        <Message variant='danger'>
                            {errorOrders?.data?.message || errorOrders.error}
                        </Message>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-12 bg-gray-dark rounded-xl border border-gray-700">
                            <FaBoxOpen className="text-6xl text-gray-600 mx-auto mb-4" />
                            <p className="text-xl text-gray-400">No orders found.</p>
                            <Link to="/" className="text-accent hover:underline mt-2 inline-block">Start Shopping</Link>
                        </div>
                    ) : (
                        <div className="bg-gray-dark rounded-xl shadow-lg border border-gray-700/50 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-800/50 border-b border-gray-700">
                                        <tr>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">Order ID</th>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                                            <th className="py-4 px-6 text-center text-sm font-semibold text-gray-400 uppercase tracking-wider">Paid</th>
                                            <th className="py-4 px-6 text-center text-sm font-semibold text-gray-400 uppercase tracking-wider">Delivered</th>
                                            <th className="py-4 px-6 text-right text-sm font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {orders.map((order) => (
                                            <tr key={order._id} className="hover:bg-gray-800/50 transition-colors">
                                                <td className="py-4 px-6 text-sm text-white font-mono">{order._id.substring(0, 10)}...</td>
                                                <td className="py-4 px-6 text-sm text-gray-300">
                                                    {order.createdAt.substring(0, 10)}
                                                    <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                </td>
                                                <td className="py-4 px-6 text-sm font-bold text-accent">${order.totalPrice}</td>
                                                <td className="py-4 px-6 text-center">
                                                    {order.isPaid ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                                                            <FaCheckCircle className="mr-1" /> Paid
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                                                            <FaTimes className="mr-1" /> Unpaid
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    {order.isDelivered ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                                                            <FaCheckCircle className="mr-1" /> Delivered
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                                            <FaClock className="mr-1" /> Processing
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <Link to={`/order/${order._id}`} className="btn-outline py-1 px-4 text-xs">
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ProfileScreen;
