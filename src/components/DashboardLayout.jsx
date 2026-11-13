import Sidebar from './sidebar/sidebar';
import './DashboardLayout.css';
import { Outlet } from 'react-router-dom';

function DashboardLayout({ children }) {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-content">
                {children || <Outlet />}
            </main>
        </div>
    );
}

export default DashboardLayout;