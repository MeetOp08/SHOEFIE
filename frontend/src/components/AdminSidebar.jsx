
import { Link, useLocation } from 'react-router-dom';
import { FaChartLine, FaBox, FaShoppingBag, FaUsers, FaTags, FaStar, FaListAlt, FaCopyright } from 'react-icons/fa';

const AdminSidebar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-accent text-white' : 'text-text-muted hover:bg-secondary hover:text-text-main';
    };

    return (
        <aside className="w-64 bg-white border-r border-border-color h-[calc(100vh-80px)] sticky top-20 md:block hidden overflow-y-auto">
            <div className="p-6 border-b border-border-color">
                <Link to='/admin/dashboard' className="flex items-center gap-2">
                    <span className="text-2xl font-display font-bold text-accent tracking-tighter">ADMIN</span>
                </Link>
            </div>

            <nav className="mt-6 px-4 space-y-2">
                <Link to='/admin/dashboard' className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/admin/dashboard')}`}>
                    <FaChartLine /> Dashboard
                </Link>

                <div className="pt-4 pb-2 px-4 text-xs font-bold text-text-muted uppercase tracking-wider">Management</div>

                <Link to='/admin/productlist' className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/admin/productlist')}`}>
                    <FaBox /> Products
                </Link>
                <Link to='/admin/orderlist' className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/admin/orderlist')}`}>
                    <FaShoppingBag /> Orders
                </Link>
                <Link to='/admin/userlist' className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/admin/userlist')}`}>
                    <FaUsers /> Users
                </Link>
                <Link to='/admin/categorylist' className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/admin/categorylist')}`}>
                    <FaListAlt /> Categories
                </Link>
                <Link to='/admin/brandlist' className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/admin/brandlist')}`}>
                    <FaCopyright /> Brands
                </Link>

                <div className="pt-4 pb-2 px-4 text-xs font-bold text-text-muted uppercase tracking-wider">Marketing</div>

                <Link to='/admin/couponlist' className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/admin/couponlist')}`}>
                    <FaTags /> Coupons
                </Link>
                <Link to='/admin/reviewlist' className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive('/admin/reviewlist')}`}>
                    <FaStar /> Reviews
                </Link>
            </nav>
        </aside>
    );
};

export default AdminSidebar;
