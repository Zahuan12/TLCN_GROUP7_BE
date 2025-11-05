import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  BellIcon,
  MenuIcon,
  UserIcon,
  LogOutIcon,
  SettingsIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Header - Top navigation bar with user menu and notifications
 * 
 * @param {Object} props
 * @param {Function} props.onToggleSidebar - Sidebar toggle handler
 * @param {number} props.notificationCount - Unread notification count
 */
export default function Header({ onToggleSidebar, notificationCount = 0 }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications] = useState([
    {
      id: 1,
      title: 'Công ty mới đăng ký',
      description: 'Viettel Solutions vừa đăng ký tài khoản',
      time: '5 phút trước',
      read: false
    },
    {
      id: 2,
      title: 'Bài viết mới',
      description: 'Nguyễn Văn A đăng bài viết mới',
      time: '1 giờ trước',
      read: false
    }
  ]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'AD';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-10 bg-background border-b">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <MenuIcon className="w-5 h-5" />
          </Button>

          <div>
            <h1 className="text-lg font-semibold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Quản lý hệ thống
            </p>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <BellIcon className="w-5 h-5" />
                {notificationCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3">
                    <div className="flex items-start justify-between w-full">
                      <span className="font-medium text-sm">{notification.title}</span>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {notification.description}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {notification.time}
                    </span>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Không có thông báo mới
                </div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary">
                Xem tất cả
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {getInitials(user?.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium">{user?.fullName || 'Admin'}</p>
                  <p className="text-xs text-muted-foreground">{user?.role || 'Administrator'}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user?.fullName || 'Admin'}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {user?.email || 'admin@example.com'}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <UserIcon className="w-4 h-4 mr-2" />
                Tài khoản
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <SettingsIcon className="w-4 h-4 mr-2" />
                Cài đặt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOutIcon className="w-4 h-4 mr-2" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

