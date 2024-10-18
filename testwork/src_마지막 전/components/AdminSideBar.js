import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="w-48 h-full bg-gray-800 text-white p-4">
            <ul className="space-y-2">
                <li>
                    <NavLink to="/admin-dashboard" className={({ isActive }) => 
                            `block p-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
                    } end>
                    대시보드
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin-dashboard/users" className={({ isActive }) => 
                            `block p-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
                    }>
                    유저 처리
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin-dashboard/reports" className={({ isActive }) => 
                            `block p-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
                    }>
                    신고 처리
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;