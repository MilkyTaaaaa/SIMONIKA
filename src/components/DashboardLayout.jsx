import {useState} from 'react';
import {Link} from 'react-router-dom';
import Sidebar from './sidebar/sidebar';
import './DashboardLayout.css';

function DashboardLayout({ children }) {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-content">
                {children}
            </main>
        </div>
    );
}

export default DashboardLayout;