import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useProfileMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';
import Loader from '../Loader';

const PersonalInfo = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [notificationPreferences, setNotificationPreferences] = useState({ email: true, sms: true });

    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
    const [updateProfile, { isLoading }] = useProfileMutation();

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name);
            setEmail(userInfo.email);
            setPhone(userInfo.phone || '');
            if (userInfo.notificationPreferences) {
                setNotificationPreferences(userInfo.notificationPreferences);
            }
        }
    }, [userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        try {
            const res = await updateProfile({
                _id: userInfo._id,
                name,
                email,
                phone,
                password,
                notificationPreferences
            }).unwrap();
            dispatch(setCredentials(res));
            toast.success('Profile updated successfully');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="card p-8 bg-gray-dark border border-gray-700/50">
            <h2 className="text-2xl font-bold font-display text-white mb-6">Personal Information</h2>

            <form onSubmit={submitHandler} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Phone Number</label>
                    <input
                        type="text"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input-field"
                    />
                </div>

                <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-bold text-white mb-4">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">New Password</label>
                            <input
                                type="password"
                                placeholder="Leave blank to keep current"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input-field"
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-bold text-white mb-4">Notification Preferences</h3>
                    <div className="flex space-x-6">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notificationPreferences.email}
                                onChange={(e) => setNotificationPreferences({ ...notificationPreferences, email: e.target.checked })}
                                className="form-checkbox h-5 w-5 text-accent rounded bg-gray-700 border-gray-600 focus:ring-accent"
                            />
                            <span className="text-gray-300">Email Notifications</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notificationPreferences.sms}
                                onChange={(e) => setNotificationPreferences({ ...notificationPreferences, sms: e.target.checked })}
                                className="form-checkbox h-5 w-5 text-accent rounded bg-gray-700 border-gray-600 focus:ring-accent"
                            />
                            <span className="text-gray-300">SMS Notifications</span>
                        </label>
                    </div>
                </div>

                <button type="submit" className="btn-primary w-full md:w-auto px-8" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Save Changes'}
                </button>
            </form>
            {isLoading && <Loader />}
        </div>
    );
};

export default PersonalInfo;
