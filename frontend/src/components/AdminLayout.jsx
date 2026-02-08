
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Header from './Header'; // Ensure Header is used for consistency, or standard header

const AdminLayout = () => {
    return (
        <div className="flex bg-secondary/30 min-h-screen font-sans text-text-main">
            <AdminSidebar />
            <main className="flex-1 flex flex-col min-w-0">
                {/* Optional: Add a top navbar specific for Admin here if Header is too user-centric */}
                {/* For now, just Outlet content area with padding */}
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
