import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../organisms/Sidebar';
import Header from '../organisms/Header';
import { cn } from '../../utils/cn';

/**
 * DashboardLayout - Main layout with sidebar and header
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content
 * @param {Object} props.pendingCounts - Pending approval counts
 */
export default function DashboardLayout({ children, pendingCounts = {} }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          pendingCounts={pendingCounts}
        />
      </div>

      {/* Sidebar - Mobile */}
      {mobileSidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Sidebar 
              collapsed={false} 
              pendingCounts={pendingCounts}
            />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          onToggleSidebar={toggleSidebar}
          notificationCount={pendingCounts.companies + pendingCounts.blogs || 0}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}

