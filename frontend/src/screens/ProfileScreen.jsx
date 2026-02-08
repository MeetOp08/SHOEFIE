import { useState } from 'react';
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
            <div className="bg-text-main rounded-xl p-8 border border-gray-800 shadow-xl text-white">
                <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-4xl text-gray-400 border-2 border-accent overflow-hidden">
                        {userInfo.avatar ? <img src={userInfo.avatar} alt="Profile" className="w-full h-full object-cover" /> : <FaUser />}
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold mb-1">Hello, {userInfo.name}</h2>
                        <p className="text-gray-300 text-sm opacity-80">Welcome to your personal dashboard. Manage your orders and account details here.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button onClick={() => setActiveTab('orders')} className="card p-6 bg-white hover:border-accent group text-left shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4 group-hover:bg-accent transition-colors">
                        <FaShoppingBag className="text-xl text-accent group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-text-main mb-2">My Orders</h3>
                    <p className="text-text-muted text-sm">Track active orders and view purchase history.</p>
                </button>

                <button onClick={() => setActiveTab('addresses')} className="card p-6 bg-white hover:border-accent group text-left shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                        <FaMapMarkerAlt className="text-xl text-blue-500 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-text-main mb-2">Addresses</h3>
                    <p className="text-text-muted text-sm">Manage your shipping and delivery locations.</p>
                </button>

                <button onClick={() => setActiveTab('personal')} className="card p-6 bg-white hover:border-accent group text-left shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
                        <FaUser className="text-xl text-purple-500 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-text-main mb-2">Profile Details</h3>
                    <p className="text-text-muted text-sm">Update your name, email, and password.</p>
                </button>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-display font-bold text-text-main mb-8 pb-4 border-b border-border-color">My Account</h1>

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
