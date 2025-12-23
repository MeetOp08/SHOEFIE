import { FaUser, FaMapMarkerAlt, FaBoxOpen, FaSignOutAlt, FaIdCard } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../slices/authSlice';

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = () => {
        dispatch(logout());
        navigate('/login');
    };

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: <FaUser /> },
        { id: 'personal', label: 'Personal Information', icon: <FaIdCard /> },
        { id: 'addresses', label: 'Manage Addresses', icon: <FaMapMarkerAlt /> },
        { id: 'orders', label: 'My Orders', icon: <FaBoxOpen /> },
    ];

    return (
        <div className="bg-gray-dark rounded-xl border border-gray-700/50 overflow-hidden sticky top-24">
            <div className="p-4 border-b border-gray-700/50 bg-gray-800/30">
                <h3 className="text-gray-400 uppercase text-xs font-bold tracking-wider">Account Settings</h3>
            </div>
            <div className="flex flex-col">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center px-6 py-4 transition-all duration-200 text-left border-l-4 ${activeTab === item.id
                                ? 'bg-gray-800 border-accent text-white'
                                : 'border-transparent text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                            }`}
                    >
                        <span className={`text-lg mr-4 ${activeTab === item.id ? 'text-accent' : 'text-gray-500'}`}>
                            {item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}

                <div className="border-t border-gray-700/50 mt-2">
                    <button
                        onClick={logoutHandler}
                        className="w-full flex items-center px-6 py-4 text-left text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                        <span className="text-lg mr-4"><FaSignOutAlt /></span>
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSidebar;
