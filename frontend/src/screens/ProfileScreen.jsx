import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* User Details */}
            <div className="md:col-span-1">
                <h2 className="text-2xl font-bold mb-4">User Profile</h2>
                <form onSubmit={submitHandler} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-semibold">Name</label>
                        <input
                            type='text'
                            placeholder='Enter name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border p-2 rounded"
                        ></input>
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Email Address</label>
                        <input
                            type='email'
                            placeholder='Enter email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border p-2 rounded"
                        ></input>
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Password</label>
                        <input
                            type='password'
                            placeholder='Enter password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border p-2 rounded"
                        ></input>
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Confirm Password</label>
                        <input
                            type='password'
                            placeholder='Confirm password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border p-2 rounded"
                        ></input>
                    </div>

                    <button
                        disabled={loadingUpdateProfile}
                        type='submit'
                        className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
                    >
                        Update
                    </button>
                    {loadingUpdateProfile && <Loader />}
                </form>
            </div>

            {/* My Orders */}
            <div className="md:col-span-3">
                <h2 className="text-2xl font-bold mb-4">My Orders</h2>
                {loadingOrders ? (
                    <Loader />
                ) : errorOrders ? (
                    <Message variant='danger'>
                        {errorOrders?.data?.message || errorOrders.error}
                    </Message>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border">ID</th>
                                    <th className="py-2 px-4 border">DATE</th>
                                    <th className="py-2 px-4 border">TOTAL</th>
                                    <th className="py-2 px-4 border">PAID</th>
                                    <th className="py-2 px-4 border">DELIVERED</th>
                                    <th className="py-2 px-4 border"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id} className="text-center">
                                        <td className="py-2 px-4 border">{order._id.substring(0, 10)}...</td>
                                        <td className="py-2 px-4 border">{order.createdAt.substring(0, 10)}</td>
                                        <td className="py-2 px-4 border">${order.totalPrice}</td>
                                        <td className="py-2 px-4 border">
                                            {order.isPaid ? (
                                                <span className="text-green-500">{order.paidAt.substring(0, 10)}</span>
                                            ) : (
                                                <FaTimes className="text-red-500 mx-auto" />
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border">
                                            {order.isDelivered ? (
                                                <span className="text-green-500">{order.deliveredAt.substring(0, 10)}</span>
                                            ) : (
                                                <FaTimes className="text-red-500 mx-auto" />
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border">
                                            <Link to={`/order/${order._id}`} className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
                                                Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileScreen;
