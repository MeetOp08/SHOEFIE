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
        <div className="bg-white rounded-xl border border-border-color overflow-hidden sticky top-24 shadow-sm">
            <div className="p-4 border-b border-border-color bg-gray-50">
                <h3 className="text-text-muted uppercase text-xs font-bold tracking-wider">Account Settings</h3>
            </div>
            <div className="flex flex-col">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center px-6 py-4 transition-all duration-200 text-left border-l-4 ${activeTab === item.id
                            ? 'bg-orange-50 border-accent text-accent font-semibold'
                            : 'border-transparent text-text-muted hover:bg-gray-50 hover:text-text-main'
                            }`}
                    >
                        <span className={`text-lg mr-4 ${activeTab === item.id ? 'text-accent' : 'text-gray-400'}`}>
                            {item.icon}
                        </span>
                        <span>{item.label}</span>
                    </button>
                ))}

                <div className="border-t border-border-color mt-2">
                    <button
                        onClick={logoutHandler}
                        className="w-full flex items-center px-6 py-4 text-left text-red-500 hover:bg-red-50 transition-colors font-medium"
                    >
                        <span className="text-lg mr-4"><FaSignOutAlt /></span>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSidebar;
