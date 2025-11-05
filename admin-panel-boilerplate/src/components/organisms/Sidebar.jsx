import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { Badge } from '../ui/badge';
import {
  LayoutDashboard,
  Users,
  Building2,
  Route,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

/**
 * Sidebar - Navigation sidebar with nested menu support
 * 
 * @param {Object} props
 * @param {boolean} props.collapsed - Whether sidebar is collapsed
 * @param {Object} props.pendingCounts - Pending approval counts { companies: number, blogs: number }
 */
export default function Sidebar({ collapsed = false, pendingCounts = {} }) {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (id) => {
    setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard'
    },
    {
      id: 'users',
      label: 'Quản lý Users',
      icon: Users,
      path: '/users',
      subItems: [
        { label: 'Tất cả Users', path: '/users' },
        { label: 'Students', path: '/users?role=STUDENT' },
        { label: 'Companies', path: '/users?role=COMPANY' }
      ]
    },
    {
      id: 'companies',
      label: 'Quản lý Companies',
      icon: Building2,
      path: '/companies',
      badge: pendingCounts.companies,
      subItems: [
        { label: 'Chờ duyệt', path: '/companies?status=PENDING', badge: pendingCounts.companies },
        { label: 'Đã duyệt', path: '/companies?status=APPROVED' },
        { label: 'Từ chối', path: '/companies?status=REJECTED' }
      ]
    },
    {
      id: 'career-paths',
      label: 'Quản lý Career Paths',
      icon: Route,
      path: '/career-paths'
    },
    {
      id: 'blogs',
      label: 'Quản lý Blogs',
      icon: FileText,
      path: '/blogs',
      badge: pendingCounts.blogs,
      subItems: [
        { label: 'Mới đăng', path: '/blogs?status=PENDING', badge: pendingCounts.blogs },
        { label: 'Đã duyệt', path: '/blogs?status=APPROVED' }
      ]
    },
    {
      id: 'reports',
      label: 'Xem báo cáo',
      icon: BarChart3,
      path: '/reports',
      subItems: [
        { label: 'Tăng trưởng Users', path: '/reports/users-growth' },
        { label: 'Top học sinh', path: '/reports/top-students' },
        { label: 'Lộ trình phổ biến', path: '/reports/popular-paths' },
        { label: 'Nội dung báo cáo', path: '/reports/flagged-content' }
      ]
    },
    {
      id: 'settings',
      label: 'Cài đặt',
      icon: Settings,
      path: '/settings',
      subItems: [
        { label: 'Cấu hình', path: '/settings/config' },
        { label: 'Địa bàn', path: '/settings/locations' }
      ]
    }
  ];

  return (
    <aside
      className={cn(
        'bg-card border-r h-screen sticky top-0 flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AP</span>
          </div>
          {!collapsed && (
            <span className="font-semibold text-lg">Admin Panel</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              {/* Main Menu Item */}
              <div>
                {item.subItems ? (
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={cn(
                      'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      'hover:bg-accent hover:text-accent-foreground',
                      openMenus[item.id] && 'bg-accent'
                    )}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="truncate">{item.label}</span>
                          {item.badge > 0 && (
                            <Badge variant="destructive" className="ml-auto">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                    {!collapsed && (
                      openMenus[item.id] ? 
                        <ChevronDown className="w-4 h-4 flex-shrink-0" /> : 
                        <ChevronRight className="w-4 h-4 flex-shrink-0" />
                    )}
                  </button>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        'hover:bg-accent hover:text-accent-foreground',
                        isActive && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                      )
                    }
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && item.badge > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </NavLink>
                )}
              </div>

              {/* Sub Menu Items */}
              {!collapsed && item.subItems && openMenus[item.id] && (
                <ul className="ml-7 mt-1 space-y-1 border-l pl-4">
                  {item.subItems.map((subItem, index) => (
                    <li key={index}>
                      <NavLink
                        to={subItem.path}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                            'hover:bg-accent hover:text-accent-foreground',
                            isActive && 'bg-accent text-accent-foreground font-medium'
                          )
                        }
                      >
                        <span className="truncate">{subItem.label}</span>
                        {subItem.badge > 0 && (
                          <Badge variant="destructive" size="sm">
                            {subItem.badge}
                          </Badge>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground">
            <p>Admin Panel v1.0</p>
            <p className="mt-1">© 2025 TLCN Group 7</p>
          </div>
        </div>
      )}
    </aside>
  );
}

