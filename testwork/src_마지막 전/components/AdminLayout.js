import React from 'react';
import Sidebar from '../components/AdminSideBar';

const AdminLayout = ({ children }) => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="p-4 flex-1">
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;