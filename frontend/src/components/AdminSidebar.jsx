import { Link, useLocation } from 'react-router-dom';
import { FaChartLine, FaBox, FaShoppingBag, FaUsers, FaTags, FaStar, FaListAlt, FaCopyright } from 'react-icons/fa';
import '../styles/AdminLayout.css';

const AdminSidebar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <aside className="admin-sidebar-container">
            <div className="admin-sidebar-header">
                <Link to='/admin/dashboard' className="admin-sidebar-brand">
                    <span className="admin-sidebar-brand-text">ADMIN</span>
                </Link>
            </div>

            <nav className="admin-sidebar-nav">
                <Link to='/admin/dashboard' className={`admin-sidebar-link ${isActive('/admin/dashboard')}`}>
                    <FaChartLine /> Dashboard
                </Link>

                <div className="admin-sidebar-section-title">Management</div>

                <Link to='/admin/productlist' className={`admin-sidebar-link ${isActive('/admin/productlist')}`}>
                    <FaBox /> Products
                </Link>
                <Link to='/admin/orderlist' className={`admin-sidebar-link ${isActive('/admin/orderlist')}`}>
                    <FaShoppingBag /> Orders
                </Link>
                <Link to='/admin/userlist' className={`admin-sidebar-link ${isActive('/admin/userlist')}`}>
                    <FaUsers /> Users
                </Link>
                <Link to='/admin/categorylist' className={`admin-sidebar-link ${isActive('/admin/categorylist')}`}>
                    <FaListAlt /> Categories
                </Link>
                <Link to='/admin/brandlist' className={`admin-sidebar-link ${isActive('/admin/brandlist')}`}>
                    <FaCopyright /> Brands
                </Link>

                <div className="admin-sidebar-section-title">Marketing</div>

                <Link to='/admin/couponlist' className={`admin-sidebar-link ${isActive('/admin/couponlist')}`}>
                    <FaTags /> Coupons
                </Link>
                <Link to='/admin/reviewlist' className={`admin-sidebar-link ${isActive('/admin/reviewlist')}`}>
                    <FaStar /> Reviews
                </Link>
            </nav>
        </aside>
    );
};

export default AdminSidebar;
