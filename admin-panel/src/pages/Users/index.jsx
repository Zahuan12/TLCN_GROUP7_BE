import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/templates/DashboardLayout';
import SearchBar from '../../components/molecules/SearchBar';
import StatusBadge from '../../components/molecules/StatusBadge';
import DataTable from '../../components/organisms/DataTable';
import Pagination from '../../components/molecules/Pagination';
import UserFilters from './components/UserFilters';
import UserActionMenu from './components/UserActionMenu';
import UserDetailModal from './components/UserDetailModal';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { PlusIcon, RefreshCwIcon } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';
import { useToast } from '../../hooks/useToast';
import userService from '../../services/userService';
import { mockUsers, generateMockUsers } from '../../utils/mockData';
import { ROLE_LABELS } from '../../utils/constants';
import { formatDateTime } from '../../utils/formatDate';

/**
 * Users Page - User management with search, filter, pagination
 */
export default function UsersPage() {
  const { toast } = useToast();
  const { page, pageSize, goToPage, changePageSize } = usePagination();
  const [searchParams] = useSearchParams();
  
  const [users, setUsers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    isActive: '',
    verifyStatus: ''
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  // Read role from URL query params and update filters
  useEffect(() => {
    const roleFromUrl = searchParams.get('role');
    if (roleFromUrl) {
      setFilters(prev => ({ ...prev, role: roleFromUrl }));
    } else {
      // Reset role filter if no query param
      setFilters(prev => ({ ...prev, role: '' }));
    }
  }, [searchParams.get('role')]); // Only re-run when role param changes

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize, debouncedSearch, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // TODO: Replace with real API when backend is ready
      // const response = await userService.getAll({
      //   page,
      //   limit: pageSize,
      //   search: debouncedSearch,
      //   ...filters
      // });

      // Mock API call with delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate mock users
      const allMockUsers = [...mockUsers, ...generateMockUsers(50)];
      
      // Filter mock data
      let filtered = allMockUsers;
      
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        filtered = filtered.filter(user => 
          user.username?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.fullName?.toLowerCase().includes(searchLower)
        );
      }

      if (filters.role) {
        filtered = filtered.filter(user => user.role === filters.role);
      }

      if (filters.isActive !== '') {
        filtered = filtered.filter(user => user.isActive === filters.isActive);
      }

      if (filters.verifyStatus) {
        filtered = filtered.filter(user => user.verifyStatus === filters.verifyStatus);
      }

      // Pagination
      const startIndex = (page - 1) * pageSize;
      const paginatedUsers = filtered.slice(startIndex, startIndex + pageSize);

      setUsers(paginatedUsers);
      setTotalItems(filtered.length);

    } catch (error) {
      toast.error('Không thể tải danh sách users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    if (key === 'clear') {
      setFilters({ role: '', isActive: '', verifyStatus: '' });
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
    goToPage(1); // Reset to first page when filter changes
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleEdit = (user) => {
    // TODO: Implement edit modal
    toast.info(`Chỉnh sửa user: ${user.username}`);
  };

  const handleToggleActive = async (user) => {
    try {
      const action = user.isActive ? 'khóa' : 'mở khóa';
      if (!confirm(`Xác nhận ${action} tài khoản ${user.username}?`)) {
        return;
      }

      // TODO: Replace with real API
      // await userService.toggleActive(user.id, !user.isActive);

      toast.success(`Đã ${action} tài khoản thành công`);
      fetchUsers();
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleVerify = async (user) => {
    try {
      if (!confirm(`Xác nhận verify user ${user.username}?`)) {
        return;
      }

      // TODO: Replace with real API
      // await userService.verify(user.id);

      toast.success('Đã xác thực user thành công');
      fetchUsers();
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleDelete = async (user) => {
    try {
      if (!confirm(`Xác nhận xóa user ${user.username}? Hành động này không thể hoàn tác.`)) {
        return;
      }

      // TODO: Replace with real API
      // await userService.delete(user.id);

      toast.success('Đã xóa user thành công');
      fetchUsers();
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const columns = [
    {
      key: 'user',
      label: 'User',
      render: (user) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.fullName || user.username}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'username',
      label: 'Username',
      render: (user) => <span className="font-mono text-sm">{user.username}</span>
    },
    {
      key: 'role',
      label: 'Role',
      render: (user) => <Badge variant="outline">{ROLE_LABELS[user.role]}</Badge>
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (user) => (
        <div className="flex flex-col gap-1">
          <StatusBadge status={user.isActive ? 'ACTIVE' : 'INACTIVE'} />
          <StatusBadge status={user.verifyStatus} />
        </div>
      )
    },
    {
      key: 'createdDate',
      label: 'Ngày tạo',
      render: (user) => (
        <span className="text-sm text-muted-foreground">
          {formatDateTime(user.createdDate)}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Hành động',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (user) => (
        <UserActionMenu
          user={user}
          onView={handleView}
          onEdit={handleEdit}
          onToggleActive={handleToggleActive}
          onVerify={handleVerify}
          onDelete={handleDelete}
        />
      )
    }
  ];

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Quản lý Users</h1>
            <p className="text-muted-foreground mt-1">
              Quản lý tất cả users trong hệ thống
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchUsers}>
              <RefreshCwIcon className="w-4 h-4 mr-2" />
              Làm mới
            </Button>
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              Thêm user
            </Button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Tìm kiếm theo username, email, tên..."
            />
          </div>
          <UserFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          emptyMessage="Không tìm thấy user nào"
        />

        {/* Pagination */}
        {!loading && totalItems > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={goToPage}
            onPageSizeChange={changePageSize}
          />
        )}
      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        user={selectedUser}
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
    </DashboardLayout>
  );
}

