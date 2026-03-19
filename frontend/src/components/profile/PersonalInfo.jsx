import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useProfileMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';
import Loader from '../Loader';
import '../../styles/PersonalInfo.css';

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
        <div className="personal-info-card">
            <h2 className="personal-info-title">Personal Information</h2>

            <form onSubmit={submitHandler} className="personal-info-form">
                <div className="personal-info-grid">
                    <div>
                        <label className="personal-info-label">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="personal-info-label">Email Address</label>
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
                    <label className="personal-info-label">Phone Number</label>
                    <input
                        type="text"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input-field"
                    />
                </div>

                <div className="personal-info-section">
                    <h3 className="personal-info-section-title">Change Password</h3>
                    <div className="personal-info-grid">
                        <div>
                            <label className="personal-info-label">New Password</label>
                            <input
                                type="password"
                                placeholder="Leave blank to keep current"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="personal-info-label">Confirm Password</label>
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

                <div className="personal-info-section">
                    <h3 className="personal-info-section-title">Notification Preferences</h3>
                    <div className="personal-info-checkbox-group">
                        <label className="personal-info-checkbox-label">
                            <input
                                type="checkbox"
                                checked={notificationPreferences.email}
                                onChange={(e) => setNotificationPreferences({ ...notificationPreferences, email: e.target.checked })}
                                className="personal-info-checkbox form-checkbox"
                            />
                            <span className="personal-info-checkbox-text">Email Notifications</span>
                        </label>
                        <label className="personal-info-checkbox-label">
                            <input
                                type="checkbox"
                                checked={notificationPreferences.sms}
                                onChange={(e) => setNotificationPreferences({ ...notificationPreferences, sms: e.target.checked })}
                                className="personal-info-checkbox form-checkbox"
                            />
                            <span className="personal-info-checkbox-text">SMS Notifications</span>
                        </label>
                    </div>
                </div>

                <button type="submit" className="btn-primary personal-info-submit" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Save Changes'}
                </button>
            </form>
            {isLoading && <Loader />}
        </div>
    );
};

export default PersonalInfo;
