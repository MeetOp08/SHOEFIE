import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import PersonalInfo from '../components/profile/PersonalInfo';
import AddressBook from '../components/profile/AddressBook';
import OrderHistory from '../components/profile/OrderHistory';
import { FaUser, FaShoppingBag, FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/ProfileScreen.css';

const ProfileScreen = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { userInfo } = useSelector((state) => state.auth);

    // Simple Overview Component
    const Overview = () => (
        <div className="profile-overview-layout">
            <div className="profile-welcome-card">
                <div className="profile-welcome-content">
                    <div className="profile-avatar-wrap">
                        {userInfo.avatar ? <img src={userInfo.avatar} alt="Profile" className="profile-avatar-img" /> : <FaUser />}
                    </div>
                    <div>
                        <h2 className="profile-welcome-title">Hello, {userInfo.name}</h2>
                        <p className="profile-welcome-subtitle">Welcome to your personal dashboard. Manage your orders and account details here.</p>
                    </div>
                </div>
            </div>

            <div className="profile-cards-grid">
                <button onClick={() => setActiveTab('orders')} className="profile-action-card">
                    <div className="profile-action-icon-wrap profile-icon-orders-bg">
                        <FaShoppingBag className="profile-action-icon profile-icon-orders" />
                    </div>
                    <h3 className="profile-card-title">My Orders</h3>
                    <p className="profile-card-desc">Track active orders and view purchase history.</p>
                </button>

                <button onClick={() => setActiveTab('addresses')} className="profile-action-card">
                    <div className="profile-action-icon-wrap profile-icon-address-bg">
                        <FaMapMarkerAlt className="profile-action-icon profile-icon-address" />
                    </div>
                    <h3 className="profile-card-title">Addresses</h3>
                    <p className="profile-card-desc">Manage your shipping and delivery locations.</p>
                </button>

                <button onClick={() => setActiveTab('personal')} className="profile-action-card">
                    <div className="profile-action-icon-wrap profile-icon-personal-bg">
                        <FaUser className="profile-action-icon profile-icon-personal" />
                    </div>
                    <h3 className="profile-card-title">Profile Details</h3>
                    <p className="profile-card-desc">Update your name, email, and password.</p>
                </button>
            </div>
        </div>
    );

    return (
        <div className="container-custom profile-screen-container">
            <h1 className="profile-screen-title">My Account</h1>

            <div className="profile-main-layout">
                <div className="profile-sidebar-col">
                    <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                <div className="profile-content-col">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'overview' && <Overview />}
                        {activeTab === 'personal' && <PersonalInfo />}
                        {activeTab === 'addresses' && <AddressBook />}
                        {activeTab === 'orders' && <OrderHistory />}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;
