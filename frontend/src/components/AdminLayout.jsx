import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Header from './Header'; // Ensure Header is used for consistency, or standard header
import '../styles/AdminLayout.css';

const AdminLayout = () => {
    return (
        <div className="admin-layout-container">
            <AdminSidebar />
            <main className="admin-layout-main">
                {/* Optional: Add a top navbar specific for Admin here if Header is too user-centric */}
                {/* For now, just Outlet content area with padding */}
                <div className="admin-layout-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
