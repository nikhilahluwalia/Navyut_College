import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

// Provides the shared chrome (sidebar + navbar) and an Outlet for nested pages.
export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <Navbar />
      <main className="pt-16 pl-64 transition-all duration-300">
        <div className="p-6">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
