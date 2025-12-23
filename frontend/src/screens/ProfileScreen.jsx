import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import PersonalInfo from '../components/profile/PersonalInfo';
import AddressBook from '../components/profile/AddressBook';
import OrderHistory from '../components/profile/OrderHistory';
import { FaUser, FaShoppingBag, FaMapMarkerAlt } from 'react-icons/fa';

const ProfileScreen = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { userInfo } = useSelector((state) => state.auth);

    // Simple Overview Component
    const Overview = () => (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 shadow-lg">
                <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-4xl text-gray-400 border-2 border-accent">
                        {userInfo.avatar ? <img src={userInfo.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" /> : <FaUser />}
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-1">Hello, {userInfo.name}</h2>
                        <p className="text-gray-400">From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button onClick={() => setActiveTab('orders')} className="card p-6 bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700 group text-left">
                    <FaShoppingBag className="text-3xl text-accent mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-white mb-2">Orders</h3>
                    <p className="text-gray-400 text-sm">Check the status of your orders or browse history.</p>
                </button>

                <button onClick={() => setActiveTab('addresses')} className="card p-6 bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700 group text-left">
                    <FaMapMarkerAlt className="text-3xl text-accent mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-white mb-2">Addresses</h3>
                    <p className="text-gray-400 text-sm">Manage your shipping and billing addresses.</p>
                </button>

                <button onClick={() => setActiveTab('personal')} className="card p-6 bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700 group text-left">
                    <FaUser className="text-3xl text-accent mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-white mb-2">Profile</h3>
                    <p className="text-gray-400 text-sm">Edit personal details and change password.</p>
                </button>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-display font-bold text-white mb-8 border-b border-gray-700 pb-4">My Account</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                <div className="lg:col-span-3">
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
