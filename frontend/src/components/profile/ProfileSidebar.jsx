import { FaUser, FaMapMarkerAlt, FaBoxOpen, FaSignOutAlt, FaIdCard } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../slices/authSlice';
import '../../styles/ProfileSidebar.css';

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
        <div className="profile-sidebar-container">
            <div className="profile-sidebar-header">
                <h3 className="profile-sidebar-title">Account Settings</h3>
            </div>
            <div className="profile-sidebar-menu">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`profile-sidebar-btn ${activeTab === item.id ? 'active' : 'default'}`}
                    >
                        <span className={`profile-sidebar-icon ${activeTab === item.id ? 'active' : 'default'}`}>
                            {item.icon}
                        </span>
                        <span>{item.label}</span>
                    </button>
                ))}

                <div className="profile-sidebar-logout-wrapper">
                    <button
                        onClick={logoutHandler}
                        className="profile-sidebar-logout-btn"
                    >
                        <span className="profile-sidebar-icon"><FaSignOutAlt /></span>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSidebar;
